import { ChangeEvent, useEffect, useRef, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import BurgerMenu from '../components/BurgerMenu'
import BottomNavigation from '../components/BottomNavigation'
import { supabase } from '../utils/supabase'
import { storage } from '../utils/storage'
import './UploadPage.css'

const BUCKET_NAME = 'user-uploads'

type StatusType = 'success' | 'error' | 'info'

interface StatusMessage {
  type: StatusType
  message: string
}

interface StoredUpload {
  id: string
  user_id: string
  file_path: string
  storage_key: string
  original_name: string
  mime_type: string | null
  size: number | null
  created_at: string
}

type StoredUser = Partial<User> & { id: string }

const UploadPage = () => {
  const [user, setUser] = useState<StoredUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<StatusMessage | null>(null)
  const [uploads, setUploads] = useState<StoredUpload[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        // First, try to get the current session from Supabase
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
        } else {
          // Fallback to sessionStorage
          const userStr = storage.get('user')
          if (userStr) {
            const userData = JSON.parse(userStr)
            setUser(userData)
          }
        }
      } catch (error) {
        // Fallback to sessionStorage
        const userStr = storage.get('user')
        if (userStr) {
          try {
            const userData = JSON.parse(userStr)
            setUser(userData)
          } catch (e) {
            // Silent fallback
          }
        }
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  useEffect(() => {
    if (user) {
      void fetchUploads()
    }
  }, [user])

  const fetchUploads = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_uploads')
        .select('id, user_id, file_path, storage_key, original_name, mime_type, size, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        setStatus({
          type: 'error',
          message: 'Uploads konnten nicht geladen werden. Bitte versuche es erneut.'
        })
        return
      }

      setUploads(data ?? [])
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Fehler beim Laden der Uploads.'
      })
    }
  }

  const triggerFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!isFileTypeAllowed(file)) {
      setStatus({
        type: 'error',
        message: 'Nur Bilder (PNG, JPG, JPEG) oder PDF-Dateien sind erlaubt.'
      })
      return
    }

    await uploadFile(file)
  }

  const isFileTypeAllowed = (file: File) => {
    const isImage = file.type.startsWith('image/')
    const isPdf = file.type === 'application/pdf'
    return isImage || isPdf
  }

  const generateStorageKey = () => {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10)
  }

  const uploadFile = async (file: File) => {
    if (!user) {
      setStatus({ type: 'error', message: 'Bitte melde dich zuerst an.' })
      return
    }

    setUploading(true)
    setStatus(null)

    try {
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (!session || sessionError) {
        throw new Error('Du bist nicht angemeldet. Bitte melde dich erneut an.')
      }

      // Use session.user.id instead of user.id to ensure consistency with auth.uid()
      const userId = session.user.id
      
      const storageKey = generateStorageKey()
      const fileExtension = file.name.split('.').pop()
      const filePathInStorage = `files/${storageKey}.${fileExtension ?? 'dat'}`

      // Upload to Supabase Storage
      // Use session.user.id as string for RLS policy - must match auth.uid()
      // Ensure user_id is stored as string in metadata
      console.log('[UPLOAD DEBUG] Starting upload...')
      console.log('[UPLOAD DEBUG] User ID:', userId)
      console.log('[UPLOAD DEBUG] File path:', filePathInStorage)
      console.log('[UPLOAD DEBUG] Metadata:', { user_id: String(userId) })
      console.log('[UPLOAD DEBUG] Auth UID (from session):', session.user.id)
      
      const { data: uploadData, error: storageError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePathInStorage, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: false,
          metadata: {
            user_id: String(userId)
          }
        })

      console.log('[UPLOAD DEBUG] Upload response data:', uploadData)
      console.log('[UPLOAD DEBUG] Upload error:', storageError)

      if (storageError) {
        // Safely handle error object
        let errorMessage = 'Upload fehlgeschlagen.'
        
        try {
          if (typeof storageError === 'string') {
            errorMessage = storageError
          } else if (storageError && typeof storageError === 'object') {
            errorMessage = (storageError as any)?.message || 
                          (storageError as any)?.error || 
                          (storageError as any)?.toString() || 
                          JSON.stringify(storageError) ||
                          'Upload fehlgeschlagen.'
          }
          
          console.error('[UPLOAD DEBUG] Storage error details:', {
            error: storageError,
            errorMessage,
            errorType: typeof storageError,
            errorString: String(storageError)
          })
        } catch (e) {
          console.error('[UPLOAD DEBUG] Error parsing storage error:', e)
          errorMessage = 'Upload fehlgeschlagen. Bitte versuche es erneut.'
        }
        
        throw new Error(
          errorMessage.includes('Storage bucket does not exist') || 
          errorMessage.includes('bucket does not exist') ||
          errorMessage.includes('does not exist')
            ? 'Der Speicher-Bucket existiert nicht. Bitte erstelle in Supabase einen Bucket mit dem Namen "user-uploads".'
            : errorMessage
        )
      }

      console.log('[UPLOAD DEBUG] Upload successful!')

      // Insert metadata into database
      // Use session.user.id to ensure consistency
      const { error: insertError } = await supabase.from('user_uploads').insert({
        user_id: userId,
        file_path: filePathInStorage,
        storage_key: storageKey,
        original_name: file.name,
        mime_type: file.type,
        size: file.size
      })

      if (insertError) {
        // Try to delete the uploaded file if database insert fails
        await supabase.storage.from(BUCKET_NAME).remove([filePathInStorage])
        throw new Error('Die Datei wurde hochgeladen, konnte aber nicht in der Datenbank gespeichert werden.')
      }

      setStatus({ type: 'success', message: 'Datei erfolgreich hochgeladen.' })
      await fetchUploads()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Es ist ein Fehler beim Hochladen aufgetreten.'
      setStatus({ type: 'error', message })
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (upload: StoredUpload) => {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(upload.file_path, 60)

      if (error || !data?.signedUrl) {
        throw new Error(error?.message ?? 'Download-Link konnte nicht erstellt werden.')
      }

      window.open(data.signedUrl, '_blank')
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Download fehlgeschlagen.'
      setStatus({ type: 'error', message })
    }
  }

  const handleDelete = async (upload: StoredUpload) => {
    if (!confirm(`Möchtest du "${upload.original_name}" wirklich löschen?`)) {
      return
    }

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([upload.file_path])

      if (storageError) {
        throw new Error('Datei konnte nicht aus dem Storage gelöscht werden.')
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('user_uploads')
        .delete()
        .eq('id', upload.id)

      if (deleteError) {
        throw new Error('Eintrag konnte nicht aus der Datenbank gelöscht werden.')
      }

      setStatus({ type: 'success', message: 'Datei erfolgreich gelöscht.' })
      await fetchUploads()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Löschen fehlgeschlagen.'
      setStatus({ type: 'error', message })
    }
  }

  const formatSize = (size: number | null) => {
    if (!size) return '–'
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / 1024 / 1024).toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('de-DE')
  }

  if (loading) {
    return (
      <div className="upload-page page-with-bottom-nav">
        <header className="upload-header">
          <BurgerMenu />
        </header>
        <main className="upload-main">
          <div className="upload-content">
            <p>Lade...</p>
          </div>
        </main>
        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="upload-page page-with-bottom-nav">
     

      <main className="upload-main">
        <div className="upload-container">
          <h1 className="upload-title">Dateien hochladen</h1>
          <p className="upload-description">
            Lade deine Dateien (Bilder oder PDFs) hoch, um sie sicher zu speichern und zu verwalten.
          </p>

          {status && (
            <div className={`upload-status upload-status-${status.type}`}>
              {status.message}
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="upload-input"
            accept="image/*,application/pdf"
            disabled={uploading || !user}
          />
          <button
            className="upload-button"
            onClick={triggerFileDialog}
            disabled={uploading || !user}
          >
            {uploading ? 'Lade hoch...' : 'Datei hochladen'}
          </button>

          {user && (
            <section className="upload-list-section">
              <h2 className="upload-list-title">Deine hochgeladenen Dateien</h2>
              {uploads.length === 0 ? (
                <p className="upload-empty">Noch keine Dateien hochgeladen.</p>
              ) : (
                <ul className="upload-list">
                  {uploads.map((upload) => (
                    <li key={upload.id} className="upload-list-item">
                      <div className="upload-list-meta">
                        <span className="upload-file-name">{upload.original_name}</span>
                        <span className="upload-file-info">
                          {formatSize(upload.size)} | {formatDate(upload.created_at)}
                        </span>
                      </div>
                      <div className="upload-list-actions">
                        <button
                          className="upload-download-button"
                          onClick={() => void handleDownload(upload)}
                        >
                          Download
                        </button>
                        <button
                          className="upload-delete-button"
                          onClick={() => void handleDelete(upload)}
                        >
                          Löschen
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {!user && (
            <div className="upload-status upload-status-info">
              <p>Bitte melde dich an, um Dateien hochzuladen und zu verwalten.</p>
            </div>
          )}
        </div>
      </main>

      {/* OPTIMIZER footer */}
      <div className="optimizer-footer">
        <span className="optimizer-text">OPTIMIZER</span>
        <span className="copyright-footer">©</span>
      </div>
      <BottomNavigation />
    </div>
  )
}

export default UploadPage

