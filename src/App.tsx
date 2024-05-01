/* App.tsx */
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { Box3, Vector3 } from 'three';

import '/src/index.css';

interface ObjModelProps {
  setModelLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}

const ObjModel: React.FC<ObjModelProps> = React.memo(({ setModelLoaded, setProgress }) => {
  const { scene } = useThree();

  useEffect(() => {
    const mtlLoader = new MTLLoader();
    mtlLoader.load('/uploads/Assem1.mtl', (materials) => {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(
        '/uploads/Assem1.obj',
        (object) => {
          const box = new Box3().setFromObject(object);
          const center = new Vector3();
          box.getCenter(center).negate();
          object.position.add(center);

          scene.add(object);
          setModelLoaded(true);
        },
        (progressEvent) => {
          const percentComplete = progressEvent.loaded / progressEvent.total * 100;
          setProgress(percentComplete);
        },
        (error) => console.error('Error loading OBJ:', error)
      );
    });
  }, [setModelLoaded, setProgress, scene]);

  return null;
})

function CameraController() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0, 5);
  }, [camera]);

  return null;
}

function App() {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <div className="object-container">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 15, 10]} angle={0.3} />
        <Suspense fallback={<div>Loading...</div>}>
          <ObjModel setModelLoaded={setModelLoaded} setProgress={setProgress} />
        </Suspense>
        <OrbitControls />
        <CameraController />
      </Canvas>
      {!modelLoaded && <div className="loading">Loading... {Math.round(progress)}%</div>}
      <div className="instructions">Use mouse or touch to orbit, zoom, and pan</div>
    </div>
  );
}

export default App;
