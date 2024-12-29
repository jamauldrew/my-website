// src/components/ObjModel.tsx
import React, { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as Three from 'three'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

interface ObjModelProps {
  mtl: string
  obj: string
  onLoad: () => void
  onSetOrientation: (quaternion: Three.Quaternion) => void
}

const ObjModel: React.FC<ObjModelProps> = ({
  mtl,
  obj,
  onLoad,
  onSetOrientation,
}) => {
  const { scene } = useThree()
  const objectRef = useRef<Three.Group | null>(null)

  useEffect(() => {
    const loadModel = async () => {
      try {
        const mtlLoader = new MTLLoader()
        const objLoader = new OBJLoader()

        const materials = await mtlLoader.loadAsync(mtl)
        console.log('MTL file loaded successfully')
        objLoader.setMaterials(materials)

        const object = await objLoader.loadAsync(obj)
        console.log('OBJ file loaded successfully')

        object.traverse((child: Three.Object3D) => {
          if (child instanceof Three.Mesh) {
            child.material.dispose()
            child.geometry.dispose()
          }
        })

        const box = new Three.Box3().setFromObject(object)
        const size = box.getSize(new Three.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 2 / maxDim
        object.scale.set(scale, scale, scale)

        const center = box.getCenter(new Three.Vector3()).multiplyScalar(scale)
        object.position.sub(center)

        object.quaternion.normalize()
        onSetOrientation(object.quaternion)

        scene.add(object)
        objectRef.current = object
        onLoad()
      } catch (error) {
        console.error(`Failed to load model: ${obj}`, error)
      }
    }

    loadModel()

    return () => {
      if (objectRef.current) {
        scene.remove(objectRef.current)
        objectRef.current = null
      }
    }
  }, [mtl, obj, scene, onLoad, onSetOrientation])

  useFrame(() => {
    if (objectRef.current) {
      onSetOrientation(objectRef.current.quaternion)
    }
  })

  return null
}

export default ObjModel
