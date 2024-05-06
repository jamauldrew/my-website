/* App.tsx */
import React, { useRef, useState, useEffect, memo, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as Three from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from '@react-three/drei';
import './index.css';

function useDisableMiddleMouseScroll(ref: React.RefObject<HTMLDivElement>) {
    const handleMouseDown = (e: MouseEvent) => {
        if (e.button === 1) e.preventDefault();
    };
    useEffect(() => {
        const currentRef = ref.current;
        if (currentRef) {
            currentRef.addEventListener('mousedown', handleMouseDown);
            return () => {
                currentRef.removeEventListener('mousedown', handleMouseDown);
            };
        }
    }, [ref]);
}

const Hud = memo(({ children, renderPriority }: { children: React.ReactNode; renderPriority: number }) => {
    const { gl, scene, camera } = useThree();
    useFrame(() => {
        if (renderPriority === 1) {
            gl.autoClear = true;
            gl.clearColor();
            gl.clearDepth();
            gl.render(scene, camera);
        } else {
            gl.autoClear = false;
            gl.clearDepth();
            gl.render(scene, camera);
            gl.autoClear = true;
        }
    }, renderPriority);
    return <>{children}</>;
});

const ViewportTriad = memo(() => {
    const { camera } = useThree();
    const triadScene = useRef(new Three.Scene()).current;
    const xArrow = useRef<Three.ArrowHelper | null>(null);
    const yArrow = useRef<Three.ArrowHelper | null>(null);
    const zArrow = useRef<Three.ArrowHelper | null>(null);
    useEffect(() => {
        // Create ArrowHelpers only once
        xArrow.current = new Three.ArrowHelper(new Three.Vector3(1, 0, 0), new Three.Vector3(), 1, 0xff0000);
        yArrow.current = new Three.ArrowHelper(new Three.Vector3(0, 1, 0), new Three.Vector3(), 1, 0x00ff00);
        zArrow.current = new Three.ArrowHelper(new Three.Vector3(0, 0, 1), new Three.Vector3(), 1, 0x0000ff);
        triadScene.add(xArrow.current, yArrow.current, zArrow.current);
    }, []);

    useFrame(() => {
        const triadCenter = new Three.Vector3();
        if (xArrow.current) {
            xArrow.current.position.copy(triadCenter);
        }
        if (yArrow.current) {
            yArrow.current.position.copy(triadCenter);
        }
        if (zArrow.current) {
            zArrow.current.position.copy(triadCenter);
        }
        const triadViewport = new Three.Vector3(1, 1, camera.near).unproject(camera);
        const triadPosition = new Three.Vector3(-1, -1, 0);
        const newPosition = triadViewport.add(triadPosition);
        triadScene.position.copy(newPosition);
        triadScene.quaternion.copy(camera.quaternion);
    }, 1);
  return (
    <Hud renderPriority={2}>
      <primitive object={triadScene} />
    </Hud>
  );
});

interface ObjModelProps {
    setModelLoaded: (loaded: boolean) => void;
    model?: Model;
}

interface Model {
    mtlFile: string;
    objFile: string;
}

const ObjModel = memo(({ setModelLoaded, model }: ObjModelProps) => {
    const { scene } = useThree();

    useEffect(() => {
        if (!model) return;

        const loadModel = async () => {
            const mtlLoader = new MTLLoader();
            const objLoader = new OBJLoader();

            try {
                const materials = await mtlLoader.loadAsync(model.mtlFile);
                console.log("MTL file loaded successfully");
                objLoader.setMaterials(materials);

                const object = await objLoader.loadAsync(model.objFile);
                console.log("OBJ file loaded successfully");

                // Calculate the bounding box and center the object
                const box = new Three.Box3().setFromObject(object);
                const size = box.getSize(new Three.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 2 / maxDim;
                object.scale.set(scale, scale, scale);
                const center = box.getCenter(new Three.Vector3()).multiplyScalar(scale);
                object.position.add(center);

                scene.add(object);
                setModelLoaded(true);
            } catch (error) {
                console.error(`Failed to load model: ${model.objFile}, error`);
                setModelLoaded(false);
            }
        };
        loadModel();
    }, [setModelLoaded, model, scene]);
    return null;
});

function App() {
    const [modelLoaded, setModelLoaded] = useState(false);
    const [progress] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const initialModel = {
        mtlFile: "uploads/Assem1.mtl",
        objFile: "uploads/Assem1.obj"
    };

    useDisableMiddleMouseScroll(containerRef);

    return (
        <div ref={containerRef} className="object-container">
            <Canvas
                camera={{ position: [0, 0, 5], near: 0.1, far: 1000, type: "OrthographicCamera" }}
                onCreated={({ gl }) => {
                    gl.setClearColor(new Three.Color(0x000000));
                }}
            >
                <ambientLight intensity={0.6} />
                <spotLight position={[10, 15, 10]} angle={0.3} />
                <Suspense fallback={null}>
                    <ObjModel setModelLoaded={setModelLoaded} model={initialModel} />
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
