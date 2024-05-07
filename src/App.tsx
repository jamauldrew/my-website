import React, { useRef, DependencyList, EffectCallback, useState, useEffect, memo, useMemo, Suspense } from 'react';
import { Canvas,  useThree, useFrame } from '@react-three/fiber';
import * as Three from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from '@react-three/drei';
import './index.css';

function useDebouncedEffect(effect: EffectCallback, deps: DependencyList, delay: number): void {
  const callback = useRef<EffectCallback>();

  useEffect(() => {
    callback.current = effect;
  }, [effect]);

  useEffect(() => {
    const handler = () => {
      if (callback.current) {
        callback.current();
      }
    };

    const timer = setTimeout(handler, delay);

    return () => clearTimeout(timer);
  }, [deps, delay]);
}

interface ViewportTriadProps {
    modelOrientation: Three.Quaternion;
    onReset?: () => void;
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
    gl.autoClear = renderPriority === 1;
    gl.clearDepth();
    gl.render(scene, camera);
  }, renderPriority);
  return <>{children}</>;
});


type Direction = 'x' | 'y' | 'z';

const ViewportTriad: React.FC<ViewportTriadProps> = memo(({ modelOrientation, onReset }) => {
    const { camera, gl } = useThree(); // Assuming import is correct
    const triadScene = useRef(new Three.Scene()).current;
    const arrowLength = 0.02;
    const headLength = 0.01;


    // Create arrows directly without material
    const xArrow = useRef<Three.ArrowHelper>(
        new Three.ArrowHelper(
            new Three.Vector3(1, 0, 0),
            new Three.Vector3(0, 0, 0),
            arrowLength,
            0xff0000, // Red color
            headLength
        )
    );
    const yArrow = useRef<Three.ArrowHelper>(
        new Three.ArrowHelper(
            new Three.Vector3(0, 1, 0),
            new Three.Vector3(0, 0, 0),
            arrowLength,
            0x00ff00, // Green color
            headLength
        )
    );
    const zArrow = useRef<Three.ArrowHelper>(
        new Three.ArrowHelper(
            new Three.Vector3(0, 0, 1),
            new Three.Vector3(0, 0, 0),
            arrowLength,
            0x0000ff, // Blue color
            headLength
        )
    );

    // Add arrows to the scene only once
    useEffect(() => {
        triadScene.add(xArrow.current, yArrow.current, zArrow.current);
    }, []);

    useDebouncedEffect(() => {
        const updateArrowDirection = (arrow: Three.ArrowHelper, direction: Direction) => {
            arrow.setDirection(new Three.Vector3(direction === 'x' ? 1 : 0, direction === 'y' ? 1 : 0, direction === 'z' ? 1 : 0));
        };

        updateArrowDirection(xArrow.current, 'x');
        updateArrowDirection(yArrow.current, 'y');
        updateArrowDirection(zArrow.current, 'z');
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
            {onReset && <button onClick={onReset}>Reset Arrows</button>}
        </Hud>
    );
});

const ObjModel = memo(({ setModelLoaded, model, setModelOrientation }: ObjModelProps) => {
  const { scene } = useThree();

  const loadModel = async () => {
    if (!model) return;

    try {
      const mtlLoader = new MTLLoader();
      const objLoader = new OBJLoader();

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

      const box = new Three.Box3().setFromObject(object);
      const size = box.getSize(new Three.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;

      object.scale.set(scale, scale, scale);
      const center = box.getCenter(new Three.Vector3()).multiplyScalar(scale);
      object.position.sub(center);

      object.quaternion.normalize(); // Normalize quaternion before setting orientation
      setModelOrientation(object.quaternion);

      scene.add(object);
    } catch (error) {
      console.error(`Failed to load model: ${model.objFile}, error`);
    } finally {
      // If there's any final cleanup needed, do it here (rarely needed)
    }

    setModelLoaded(true);
  };

  // **Industry Best Practice: Use useEffect with async/await**
  useEffect(() => {
    const fetchData = async () => {
      if (model) {
        await loadModel();
      }
    };

    fetchData();
  }, [model, loadModel]); // Only re-run when model or loadModel changes

  return null;
});

function App() {
    const [modelLoaded, setModelLoaded] = useState(false);
    const [modelOrientation, setModelOrientation] = useState(new Three.Quaternion());
    const [progress] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
  const initialModel = useMemo(() => ({ mtlFile: "uploads/Assem1.mtl", objFile: "uploads/Assem1.obj" }), []);

    useDisableMiddleMouseScroll(containerRef);

    return (
            <div ref={containerRef} className="object-container">
                <Canvas
                    camera={{ position: [-1, 1, 2], near: 0.1, far: 1000, type: "OrthographicCamera" }}
                    onCreated={({ gl }) => {
                        gl.setClearColor(new Three.Color(0xf0f0f0));
                    }}
                >
                    <directionalLight position={[5, 3, 5]} intensity={0.5} />
                    <ambientLight intensity={0.6} />
                    <spotLight position={[10, 15, 10]} angle={0.3} />
                    <Suspense fallback={null}>
                        <ObjModel setModelLoaded={setModelLoaded} model={initialModel} setModelOrientation={setModelOrientation} />
                    </Suspense>
                    <OrbitControls enableDamping dampingFactor={0.05} />
                    <ViewportTriad modelOrientation={modelOrientation} />
                </Canvas>
                {!modelLoaded && <div className="loading">Loading... {Math.round(progress)}%</div>}
                <div className="instructions">Use mouse or touch to orbit, zoom, and pan</div>
            </div>
    );
}

export default App;
