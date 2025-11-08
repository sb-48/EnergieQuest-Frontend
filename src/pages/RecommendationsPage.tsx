import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import BurgerMenu from '../components/BurgerMenu'
import NavigationButtons from '../components/NavigationButtons'
import './RecommendationsPage.css'

interface RecommendedUser {
  id: string
  email: string
  name: string
  vorname: string
  telefonnummer: string
  created_at: string
  status: number // 0 = aktiv, 1 = pending, 2 = pending
}

const RecommendationsPage = () => {
  const [recommendedUsers, setRecommendedUsers] = useState<RecommendedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendedUsers = async () => {
      try {
        setLoading(true)
        setError(null)

        // Hole den aktuellen User
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          setError('Sie müssen angemeldet sein')
          setLoading(false)
          return
        }

        // Hole den Ref-Code des aktuellen Users
        const { data: userData, error: userError } = await supabase
          .from('user')
          .select('ref')
          .eq('id', user.id)
          .single()

        if (userError || !userData || !userData.ref) {
          setError('Referral-Code nicht gefunden')
          setLoading(false)
          return
        }

        // Hole alle Recommendations mit dem Ref-Code des aktuellen Users (inkl. Status)
        const { data: recommendations, error: recommendationsError } = await supabase
          .from('recommendations')
          .select('referred_id, ref_code, created_at, status')
          .eq('ref_code', userData.ref)

        if (recommendationsError) {
          console.error('Error fetching recommendations:', recommendationsError)
          setError('Fehler beim Laden der Empfehlungen')
          setLoading(false)
          return
        }

        if (!recommendations || recommendations.length === 0) {
          setRecommendedUsers([])
          setLoading(false)
          return
        }

        // Hole die User-Daten für alle empfohlenen User zusammen mit dem Status
        const referredIds = recommendations.map(r => r.referred_id)
        const { data: users, error: usersError } = await supabase
          .from('user')
          .select('id, email, name, vorname, telefonnummer, created_at')
          .in('id', referredIds)
          .order('created_at', { ascending: false })

        if (usersError) {
          console.error('Error fetching users:', usersError)
          setError('Fehler beim Laden der User-Daten')
          setLoading(false)
          return
        }

        // Erstelle Map für Status aus recommendations
        const statusMap = new Map<string, number>()
        recommendations.forEach(rec => {
          statusMap.set(rec.referred_id, rec.status || 0)
        })

        // Füge Status zu den User-Daten hinzu
        const usersWithStatus = (users || []).map(user => ({
          ...user,
          status: statusMap.get(user.id) || 0
        }))

        setRecommendedUsers(usersWithStatus)
      } catch (err: any) {
        console.error('Unexpected error:', err)
        setError('Ein unerwarteter Fehler ist aufgetreten')
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendedUsers()
  }, [])

  return (
    <div className="recommendations-page">
      <header className="recommendations-header">
        <BurgerMenu />
      </header>

      <NavigationButtons />

      <main className="recommendations-main">
        <div className="recommendations-container">
          <h1 className="recommendations-title">Meine Empfehlungen</h1>

          {loading ? (
            <div className="recommendations-loading">
              <p>Lade Empfehlungen...</p>
            </div>
          ) : error ? (
            <div className="recommendations-error">
              <p>{error}</p>
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="recommendations-empty">
              <p>Noch keine Empfehlungen vorhanden</p>
            </div>
          ) : (
            <div className="recommendations-table-container">
              <table className="recommendations-table">
                <thead>
                  <tr>
                    <th>Vorname</th>
                    <th>Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.vorname}</td>
                      <td>{user.name}</td>
                      <td>
                        <div className="status-icons">
                          <span 
                            className={`status-icon ${user.status === 0 ? 'status-active' : 'status-pending'}`} 
                            title={user.status === 0 ? 'Aktiv' : 'Pending'}
                          >
                            {user.status === 0 ? '✓' : '⏳'}
                          </span>
                          <span 
                            className={`status-icon ${user.status === 1 ? 'status-active' : 'status-pending'}`} 
                            title={user.status === 1 ? 'Aktiv' : 'Pending'}
                          >
                            {user.status === 1 ? '✓' : '⏳'}
                          </span>
                          <span 
                            className={`status-icon ${user.status === 2 ? 'status-active' : 'status-pending'}`} 
                            title={user.status === 2 ? 'Aktiv' : 'Pending'}
                          >
                            {user.status === 2 ? '✓' : '⏳'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* OPTIMIZER footer */}
      <div className="optimizer-footer">
        <span className="optimizer-text">OPTIMIZER</span>
        <span className="copyright-footer">©</span>
      </div>
    </div>
  )
}

export default RecommendationsPage

