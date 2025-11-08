import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { TextureLoader } from 'three'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import './Avatar3D.css'

const AvatarModel = () => {
  const fbx = useLoader(FBXLoader, '/Minion_FBX.fbx')
  const brownEyeTexture = useLoader(TextureLoader, '/brown-eye.png')
  const jeansTexture = useLoader(TextureLoader, '/jeans_texture4807.jpg')
  
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)
  const clockRef = useRef<THREE.Clock>(new THREE.Clock())
  const groupRef = useRef<THREE.Group>(new THREE.Group())

  useEffect(() => {
    if (fbx) {
      // Clear previous model
      groupRef.current.clear()
      
      // Scale the model - try larger scale
      const scaleValue = 1.0 // Much larger scale
      fbx.scale.setScalar(scaleValue)
      
      // Center and position the model
      const box = new THREE.Box3().setFromObject(fbx)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      
      // Calculate scale to fit in view
      const maxDimension = Math.max(size.x, size.y, size.z)
      const targetSize = 3 // Target size in scene units
      const autoScale = targetSize / maxDimension
      
      fbx.scale.setScalar(autoScale)
      
      // Position model centered at origin
      fbx.position.set(-center.x * autoScale, -center.y * autoScale, -center.z * autoScale)
      
      // Configure textures
      brownEyeTexture.flipY = false
      brownEyeTexture.wrapS = THREE.RepeatWrapping
      brownEyeTexture.wrapT = THREE.RepeatWrapping
      
      jeansTexture.flipY = false
      jeansTexture.wrapS = THREE.RepeatWrapping
      jeansTexture.wrapT = THREE.RepeatWrapping
      
      // Traverse and update materials with textures
      fbx.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          
          // Apply textures based on material name or automatically
          if (child.material) {
            const materials = Array.isArray(child.material) ? child.material : [child.material]
            
            materials.forEach((mat: any, index: number) => {
              if (mat) {
                mat.needsUpdate = true
                
                // Make material visible
                if (mat.transparent !== undefined) {
                  mat.transparent = false
                }
                
                // Apply textures - try to match by name or apply to all
                const matName = mat.name ? mat.name.toLowerCase() : ''
                
                // Apply eye texture if material name contains "eye"
                if (matName.includes('eye') || matName.includes('auge')) {
                  if (mat.map) {
                    mat.map = brownEyeTexture
                  } else {
                    // Create new material with texture if needed
                    const newMat = new THREE.MeshStandardMaterial({
                      map: brownEyeTexture,
                      color: mat.color || 0xffffff
                    })
                    if (Array.isArray(child.material)) {
                      child.material[index] = newMat
                    } else {
                      child.material = newMat
                    }
                  }
                }
                // Apply jeans texture if material name contains "jean", "leg", "bein", "hose"
                else if (matName.includes('jean') || matName.includes('leg') || matName.includes('bein') || matName.includes('hose') || matName.includes('pants')) {
                  if (mat.map) {
                    mat.map = jeansTexture
                  } else {
                    const newMat = new THREE.MeshStandardMaterial({
                      map: jeansTexture,
                      color: mat.color || 0xffffff
                    })
                    if (Array.isArray(child.material)) {
                      child.material[index] = newMat
                    } else {
                      child.material = newMat
                    }
                  }
                }
                
                // Ensure textures are applied
                if (mat.map) {
                  mat.map.needsUpdate = true
                }
                
                // Increase brightness
                if (mat.color) {
                  mat.color.multiplyScalar(1.2) // Slightly brighter
                }
                
                // Add emissive for visibility
                if (!mat.emissive) {
                  mat.emissive = new THREE.Color(0x000000)
                }
                mat.emissive.multiplyScalar(0.2)
                
                // Ensure material is not too dark
                if (mat.metalness !== undefined) {
                  mat.metalness = 0.1
                }
                if (mat.roughness !== undefined) {
                  mat.roughness = 0.7
                }
              }
            })
          }
        }
      })

      // Add model to group
      groupRef.current.add(fbx)

      // Setup animations if available
      if (fbx.animations && fbx.animations.length > 0) {
        mixerRef.current = new THREE.AnimationMixer(fbx)
        const action = mixerRef.current.clipAction(fbx.animations[0])
        action.play()
      }
    }

    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction()
      }
    }
  }, [fbx, brownEyeTexture, jeansTexture])

  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }
  })

  if (!fbx) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    )
  }

  return <primitive object={groupRef.current} />
}

const Avatar3D = () => {
  return (
    <div className="avatar-container">
      <Canvas gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={['#000000']} />
        <Suspense fallback={
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="gray" />
          </mesh>
        }>
          <PerspectiveCamera makeDefault position={[0, 1, 8]} fov={50} />
          
          {/* Enhanced lighting for maximum visibility */}
          <ambientLight intensity={1.5} color="#ffffff" />
          <pointLight position={[10, 10, 10]} intensity={4} color="#ffffff" />
          <pointLight position={[-10, 10, -10]} intensity={3} color="#ffffff" />
          <pointLight position={[0, 10, 0]} intensity={3} color="#ffffff" />
          <pointLight position={[5, -5, 5]} intensity={2} color="#ffffff" />
          <directionalLight position={[0, 15, 10]} intensity={2.5} color="#ffffff" />
          <directionalLight position={[-10, 10, -5]} intensity={2} color="#ffffff" />
          <spotLight position={[0, 20, 0]} angle={0.6} penumbra={0.5} intensity={4} color="#ffffff" />
          <spotLight position={[10, 10, 10]} angle={0.5} penumbra={0.7} intensity={3} color="#ffffff" />
          
          <OrbitControls 
            enablePan={false} 
            enableZoom={true}
            minDistance={2}
            maxDistance={20}
            autoRotate={false}
            enableDamping
            dampingFactor={0.05}
            makeDefault
          />
          <AvatarModel />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Avatar3D
