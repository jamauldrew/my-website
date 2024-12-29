// src/components/ViewportTriad.tsx
import React, { useRef, useEffect, memo } from 'react'
import * as Three from 'three'
import { useThree, useFrame } from '@react-three/fiber'

interface ViewportTriadProps {
  modelOrientation: Three.Quaternion
}

const ViewportTriad: React.FC<ViewportTriadProps> = memo(
  ({ modelOrientation }) => {
    const { camera, gl } = useThree()
    const triadScene = useRef(new Three.Scene())
    const arrowLength = 0.02
    const headLength = 0.01

    const xArrow = useRef<Three.ArrowHelper>(
      new Three.ArrowHelper(
        new Three.Vector3(1, 0, 0),
        new Three.Vector3(0, 0, 0),
        arrowLength,
        0xff0000,
        headLength
      )
    )

    const yArrow = useRef<Three.ArrowHelper>(
      new Three.ArrowHelper(
        new Three.Vector3(0, 1, 0),
        new Three.Vector3(0, 0, 0),
        arrowLength,
        0x00ff00,
        headLength
      )
    )

    const zArrow = useRef<Three.ArrowHelper>(
      new Three.ArrowHelper(
        new Three.Vector3(0, 0, 1),
        new Three.Vector3(0, 0, 0),
        arrowLength,
        0x0000ff,
        headLength
      )
    )

    useEffect(() => {
      triadScene.current.add(xArrow.current, yArrow.current, zArrow.current)
    }, [])

    useFrame(() => {
      const viewport = new Three.Vector3(0.8, 0.8, camera.near).unproject(
        camera
      )
      triadScene.current.position.copy(viewport)
      const scale = camera.zoom ? 1 / camera.zoom : 1
      triadScene.current.scale.set(scale, scale, scale)
      triadScene.current.quaternion.copy(modelOrientation).invert()
      gl.clearDepth()
      gl.render(triadScene.current, camera)
    }, 1)

    return null
  }
)

export default ViewportTriad
