/* App.tsx */
import React, { useRef, DependencyList, EffectCallback, useState, useEffect, memo, Suspense } from 'react';
import { Canvas,  useThree, useFrame } from '@react-three/fiber';
import * as Three from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls as OrbitControlsThree } from 'three/examples/jsm/controls/OrbitControls.js';
import { OrbitControls } from '@react-three/drei';
import './index.css';


function useDebouncedEffect(effect: EffectCallback, deps: DependencyList, delay: number): void {
  const callback = useRef<EffectCallback>();

  // Store the latest effect callback
  useEffect(() => {
    callback.current = effect;
  }, [effect]);

  useEffect(() => {
    const handler = () => {
      if (callback.current) {
        callback.current();
      }
    };

    // Set up the timeout to run the effect
    const timer = setTimeout(handler, delay);

    // Clear the timeout if the dependencies change or the component unmounts
    return () => clearTimeout(timer);
  }, [...deps, delay]); // Ensure delay is also a dependency
}

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

    useDebouncedEffect(() => {
        const arrowLength = 0.02;
        const headLength = 0.01;

        xArrow.current = new Three.ArrowHelper(new Three.Vector3(1, 0, 0), new Three.Vector3(0, 0, 0), arrowLength, 0xff0000, headLength);
        yArrow.current = new Three.ArrowHelper(new Three.Vector3(0, 1, 0), new Three.Vector3(0, 0, 0), arrowLength, 0x00ff00, headLength);
        zArrow.current = new Three.ArrowHelper(new Three.Vector3(0, 0, 1), new Three.Vector3(0, 0, 0), arrowLength, 0x0000ff, headLength);
        triadScene.add(xArrow.current, yArrow.current, zArrow.current);
  }, [modelOrientation], 500);

    useFrame(() => {
        const viewport = new Three.Vector3(0.8, 0.8, camera.near).unproject(camera);
        triadScene.position.copy(viewport);
        const scale = camera.zoom ? 1 / camera.zoom : 1;
        triadScene.scale.set(scale, scale, scale);
        triadScene.quaternion.copy(modelOrientation.invert());

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

    useDebouncedEffect(() => {
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

                object.traverse((child: Three.Object3D) => {
                    if (child instanceof Three.Mesh) {
                        child.material.dispose();
                        child.geometry.dispose();
                    }
                });

                // Calculate the bounding box and center the object
                const box = new Three.Box3().setFromObject(object);
                const size = box.getSize(new Three.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 2 / maxDim;
                object.scale.set(scale, scale, scale);
                const center = box.getCenter(new Three.Vector3()).multiplyScalar(scale);
                object.position.sub(center);

                scene.add(object);

//                const aspectRatio = window.innerWidth / window.innerHeight;
//                // Parameters for OrthographicCamera: left, right, top, bottom, near, far
//                const camera = new Three.OrthographicCamera(-aspectRatio, aspectRatio, 0.33, -0.33, 0.3, 100);
//
//                // Set the camera position for a SW isometric view.
//                // Assuming the positive X-axis goes right, the positive Y-axis goes up, and the positive Z-axis comes out of the screen.
//                // You might need to adjust these values based on the size and position of your scene's contents.
//                camera.position.set(-1, 1, 1); // Moving the camera to the SW position relative to the centered object
//
//                // Look at the center of the scene (or the object)
//                camera.lookAt(scene.position);
//
//                // Add the camera to the scene
//                scene.add(camera);
                // Cleanup
                object.quaternion.normalize();
                setModelOrientation(object.quaternion);

                setModelLoaded(true);
            } catch (error) {
                console.error(`Failed to load model: ${model.objFile}, error`);
                setModelLoaded(false);
            }
        };
        loadModel();
        return () => {
            // Cleanup: dispose of objects and materials if unmounting
            scene.children.forEach((child) => {
                if (child instanceof Three.Mesh) {
                    child.material.dispose();
                    child.geometry.dispose();
                }
                scene.remove(child);
            });
        };
    }, [setModelLoaded, model, scene, setModelOrientation], 500);
    return <primitive object={ObjModel} />;
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

    // Function to reset the model orientation
    const controlsRef = useRef< OrbitControlsThree | null>(null);
    const resetModelOrientation = () => {
        // Resetting to the identity quaternion (no rotation)
        setModelOrientation(new Three.Quaternion(0, 0, 0, 1));
        if (controlsRef.current) {
            controlsRef.current.update();
        }
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
                <directionalLight position={[5, 3, 5]} intensity={0.5} />
                <ambientLight intensity={0.6} />
                <spotLight position={[10, 15, 10]} angle={0.3} />
                <Suspense fallback={null}>
                    <ObjModel setModelLoaded={setModelLoaded} model={initialModel} setModelOrientation = {setModelOrientation}/>
                </Suspense>
                <OrbitControls enableDamping dampingFactor={0.05} />
                <ViewportTriad modelOrientation={modelOrientation}/>
            </Canvas>
            {!modelLoaded && <div className="loading">Loading... {Math.round(progress)}%</div>}
            <div className="instructions">Use mouse or touch to orbit, zoom, and pan</div>
            <button className="resetButton" onClick={resetModelOrientation}>Reset Orientation</button>
        </div>
    );
}

export default App;
