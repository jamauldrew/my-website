/* App.tsx */
import React, { useRef, useState, useEffect, memo, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as Three from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from '@react-three/drei';
import './index.css';


interface ViewportTriadProps {
    modelOrientation: Three.Quaternion;
}

interface ObjModelProps {
    setModelOrientation: (orientation: Three.Quaternion) => void;
    setModelLoaded: (loaded: boolean) => void;
    model?: Model;
}

interface Model {
    mtlFile: string;
    objFile: string;
}

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



const ViewportTriad: React.FC<ViewportTriadProps> = memo(({ modelOrientation }) => {
    const { camera, gl } = useThree();
    const triadScene = useRef(new Three.Scene()).current;
    const xArrow = useRef<Three.ArrowHelper | null>(null);
    const yArrow = useRef<Three.ArrowHelper | null>(null);
    const zArrow = useRef<Three.ArrowHelper | null>(null);

    useEffect(() => {
        const arrowLength = 0.02;
        const headLength = 0.01;

        xArrow.current = new Three.ArrowHelper(new Three.Vector3(1, 0, 0), new Three.Vector3(0, 0, 0), arrowLength, 0xff0000, headLength);
        yArrow.current = new Three.ArrowHelper(new Three.Vector3(0, 1, 0), new Three.Vector3(0, 0, 0), arrowLength, 0x00ff00, headLength);
        zArrow.current = new Three.ArrowHelper(new Three.Vector3(0, 0, 1), new Three.Vector3(0, 0, 0), arrowLength, 0x0000ff, headLength);
        triadScene.add(xArrow.current, yArrow.current, zArrow.current);
  }, []);

    useFrame(() => {
        const viewport = new Three.Vector3(0.8, 0.8, camera.near).unproject(camera);
        triadScene.position.copy(viewport);
        const scale = camera.zoom ? 1 / camera.zoom : 1;
        triadScene.scale.set(scale, scale, scale);
        triadScene.quaternion.copy(modelOrientation.clone().invert());

        gl.clearDepth();
        gl.render(triadScene, camera);
    }, 1);

    return (
        <Hud renderPriority={2}>
            <primitive object={triadScene} />
        </Hud>
    );
});


const ObjModel = memo(({ setModelLoaded, model, setModelOrientation }: ObjModelProps) => {
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
                object.position.sub(center);

                scene.add(object);

                // Inside ObjModel useEffect, after object is added to the scene
                object.quaternion.normalize(); // Ensure the quaternion is normalized (if needed)
                setModelOrientation(object.quaternion);

                setModelLoaded(true);
            } catch (error) {
                console.error(`Failed to load model: ${model.objFile}, error`);
                setModelLoaded(false);
            }
        };
        loadModel();
    }, [setModelLoaded, model, scene, setModelOrientation]);
    return null;
});

function App() {
    const [modelLoaded, setModelLoaded] = useState(false);
    const [modelOrientation, setModelOrientation] = useState(new Three.Quaternion());
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
                camera={{ position: [0, 0, 2], near: 0.1, far: 1000, type: "OrthographicCamera" }}
                onCreated={({ gl }) => {
                    gl.setClearColor(new Three.Color(0xf0f0f0));
                }}
            >
                <ambientLight intensity={0.6} />
                <spotLight position={[10, 15, 10]} angle={0.3} />
                <Suspense fallback={null}>
                    <ObjModel setModelLoaded={setModelLoaded} model={initialModel} setModelOrientation = {setModelOrientation}/>
                </Suspense>
                <OrbitControls enableDamping dampingFactor={0.09} />
                <ViewportTriad modelOrientation={modelOrientation}/>
            </Canvas>
            {!modelLoaded && <div className="loading">Loading... {Math.round(progress)}%</div>}
            <div className="instructions">Use mouse or touch to orbit, zoom, and pan</div>
        </div>
    );
}

export default App;
