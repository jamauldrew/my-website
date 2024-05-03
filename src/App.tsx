/* App.tsx */
import React, { useState, useEffect, useCallback, Suspense, useRef, RefObject/* , useMemo */ } from 'react';
import { Canvas, useThree, /* , useLoader */ } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { ArrowHelper, Scene, Vector3, Box3, Object3D } from 'three';

import './index.css';

function useDisableMiddleMouseScroll(ref: RefObject<HTMLDivElement>) {
    const handleMouseDown = useCallback((e: MouseEvent) => {
        if (e.button === 1) e.preventDefault();
    }, []);
    useEffect(() => {
        const currentRef = ref.current;
        if (currentRef) {
            currentRef.addEventListener('mousedown', handleMouseDown);
            return () => {
                currentRef.removeEventListener('mousedown', handleMouseDown);
            };
        };
    }, [ref, handleMouseDown]);
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

const ObjModel = React.memo(({ setModelLoaded, setProgress }: ObjModelProps) => {
    const { scene } = useThree();

    useEffect(() => {
        const fetchAndLoadModels = async () => {
            try {
                const response = await fetch('/api/models');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const models: Model[] = await response.json();

                for (const model of models) {
                    try {
                        const mtlLoader = new MTLLoader();
                        const objLoader = new OBJLoader();

                        // Load materials
                        const materialsCreator = await mtlLoader.loadAsync(model.mtlFile);
                        materialsCreator.preload();
                        objLoader.setMaterials(materialsCreator);

                        // Load object
                        const object = await objLoader.loadAsync(model.objFile) as Object3D;
                        setProgress(50);

                        // Adjust object position
                        const box = new Box3().setFromObject(object);
                        const center = new Vector3();
                        box.getCenter(center).negate();
                        object.position.add(center);

                        // Simulate model loading completion
                        setTimeout(() => {
                            setModelLoaded(true);
                            setProgress(100);
                        }, 1000);

                        // Add object to the scene
                        scene.add(object);
                        setModelLoaded(true);
                    } catch (err) {
                        console.error(`Error loading model ${model.objFile}: ${err}`);
                        setModelLoaded(false);
                    }
                }
            } catch (err) {
                console.error(`Error fetching models: ${err}`);
                setModelLoaded(false);
            }
        }

        fetchAndLoadModels();
    }, [setModelLoaded, setProgress, scene]);

    return null;
});

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
                <Suspense >
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
