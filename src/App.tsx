/* App.tsx */
import React, { useState, useEffect, Suspense, useRef, RefObject/* , useMemo */ } from 'react';
import { Canvas, useThree, /* , useLoader */ } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html, useProgress } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
/* import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; */
import { ArrowHelper, Scene, Vector3, Box3/* Group, Material  */ } from 'three';

import '/src/index.css';
const mtlLoader = new MTLLoader();
const objLoader = new OBJLoader();

function useDisableMiddleMouseScroll(ref:RefObject<HTMLDivElement>) {
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) e.preventDefault();
    };
    const currentRef = ref.current;
    if (currentRef) {

    currentRef.addEventListener('mousedown', handleMouseDown);

    return () => {
      currentRef.removeEventListener('mousedown', handleMouseDown);
    };
    };
  }, [ref]);
}

function ViewportTriad() {
  // Use a separate scene for the triad.
  const triadScene = new Scene();
  const arrowLength = 1;
  const arrowHeadSize = 0.05;
  triadScene.add(new ArrowHelper(new Vector3(1, 0, 0), new Vector3(0, 0, 0), arrowLength, 0xff0000, arrowHeadSize));
  triadScene.add(new ArrowHelper(new Vector3(0, 1, 0), new Vector3(0, 0, 0), arrowLength, 0x00ff00, arrowHeadSize));
  triadScene.add(new ArrowHelper(new Vector3(0, 0, 1), new Vector3(0, 0, 0), arrowLength, 0x0000ff, arrowHeadSize));

  return <primitive object={triadScene} />;
}

interface ObjModelProps {
  setModelLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}

const ObjModel: React.FC<ObjModelProps> = React.memo(({ setModelLoaded, setProgress }) => {
  const { scene } = useThree();

  useEffect(() => {
    mtlLoader.load('/uploads/*.mtl', (materials) => {
      materials.preload();
      objLoader.setMaterials(materials);
      objLoader.load('/uploads/*.obj', (object) => {
          const box = new Box3().setFromObject(object);
          const center = new Vector3();
          box.getCenter(center).negate();
          object.position.add(center);

          scene.add(object);
          setModelLoaded(true);
        },
        (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percentComplete = progressEvent.loaded / progressEvent.total * 100;
            setProgress(percentComplete);
          }
        },
        (error) => {
          console.error('Error loading OBJ:', error);
          setModelLoaded(false);
        }
        );
    },
        (error) => {
            console.error('Error loading MTL:', error);
            setModelLoaded(false);
        });
  }, [setModelLoaded, setProgress, scene]);

  return null;
});

const Loader = () => {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
};

function App() {
    const [modelLoaded, setModelLoaded] = useState(false);
    const [progress, setProgress] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    useDisableMiddleMouseScroll(containerRef);
    return (
        <div ref={containerRef} className="object-container">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 15, 10]} angle={0.3} />
                <Suspense fallback={<Loader />}>
                    <ObjModel setModelLoaded={setModelLoaded} setProgress={setProgress} />
                </Suspense>
                <OrbitControls />
                <ViewportTriad />
            </Canvas>
            {!modelLoaded && <div className="loading">Loading... {Math.round(progress)}%</div>}
            <div className="instructions">Use mouse or touch to orbit, zoom, and pan</div>
        </div>
    );
}

export default App;
