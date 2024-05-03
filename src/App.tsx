/* App.tsx */
import React, { useState, useEffect, Suspense, useRef, RefObject/* , useMemo */ } from 'react';
import { Canvas, useThree, /* , useLoader */ } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html, useProgress } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
/* import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; */
import { ArrowHelper, Scene, Vector3, Box3, Object3D } from 'three';

import '/src/index.css';

/* interface ObjModelProps {
*   setModelLoaded: React.Dispatch<React.SetStateAction<boolean>>;
*   setProgress: React.Dispatch<React.SetStateAction<number>>;
* } */

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
  setModelLoaded: (loaded: boolean) => void;
  setProgress: (progress: number) => void;
}

interface Model {
  mtlFile: string;
  objFile: string;
}
const mtlLoader = new MTLLoader();
const objLoader = new OBJLoader();

const ObjModel: React.FC<ObjModelProps> = React.memo(({ setModelLoaded, setProgress }) => {
  const { scene } = useThree();

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/models');
        const models: Model[] = await response.json();

        for (const model of models) {
          if (model.mtlFile && model.objFile) {
            try {
              // Load and prepare materials
              const materialsCreator = await mtlLoader.loadAsync(model.mtlFile);
              materialsCreator.preload(); // This should be valid as it's a method of MaterialCreator
              objLoader.setMaterials(materialsCreator); // Pass the materials creator directly

              const object = await objLoader.loadAsync(model.objFile) as Object3D;
              const box = new Box3().setFromObject(object);
              const center = new Vector3();
              box.getCenter(center).negate();
              object.position.add(center);

              scene.add(object);
              setModelLoaded(true);
            } catch (error) {
              console.error('Error loading model:', error);
              setModelLoaded(false);
            }
          }
        };
      } catch (error) {
        console.error('Error fetching models:', error);
        setModelLoaded(false);
      }
    };

    fetchModels();
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
