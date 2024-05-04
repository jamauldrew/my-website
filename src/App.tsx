/* App.tsx */
import react from 'react';
import * as fiber from '@react-three/fiber';
import * as drei from '@react-three/drei';
import * as OBJLoaderJs from 'three/examples/jsm/loaders/OBJLoader.js';
import * as MTLLoaderJs from 'three/examples/jsm/loaders/MTLLoader.js';
import * as three from 'three';

import './index.css';

function useDisableMiddleMouseScroll(ref: react.RefObject<HTMLDivElement>) {
    const handleMouseDown = react.useCallback((e: MouseEvent) => {
        if (e.button === 1) e.preventDefault();
    }, []);
    react.useEffect(() => {
        const currentRef = ref.current;
        if (currentRef) {
            currentRef.addEventListener('mousedown', handleMouseDown);
            return () => {
                currentRef.removeEventListener('mousedown', handleMouseDown);
            };
        }
    }, [ref, handleMouseDown]);
}

function ViewportTriad() {
    // Use a separate scene for the triad.
    const triadScene = new three.Scene();
    const arrowLength = 1;
    const arrowHeadSize = 0.05;
    triadScene.add(new three.ArrowHelper(new three.Vector3(1, 0, 0), new three.Vector3(0, 0, 0), arrowLength, 0xff0000, arrowHeadSize));
    triadScene.add(new three.ArrowHelper(new three.Vector3(0, 1, 0), new three.Vector3(0, 0, 0), arrowLength, 0x00ff00, arrowHeadSize));
    triadScene.add(new three.ArrowHelper(new three.Vector3(0, 0, 1), new three.Vector3(0, 0, 0), arrowLength, 0x0000ff, arrowHeadSize));

    return <primitive object={triadScene} />;
}

interface ObjModelProps {
    setModelLoaded: (loaded: boolean) => void;
    setProgress: (progress: number) => void;
    model?: Model;
}

interface Model {
    mtlFile: string;
    objFile: string;
}

const ObjModel = react.memo(({ setModelLoaded, setProgress, model }: ObjModelProps) => {
    const { scene } = fiber.useThree(); // Use the useThree hook to access the scene

    react.useEffect(() => {
        const loadModel = async (model: Model, isFallback = false): Promise<three.Object3D> => {
            const mtlLoader = new MTLLoaderJs.MTLLoader();
            const objLoader = new OBJLoaderJs.OBJLoader();

            try {
                const basePath = isFallback ? '/uploads/Assem1.obj' : '';
                const mtlFile = `${basePath}/${model.mtlFile}`;
                const objFile = `${basePath}/${model.objFile}`;

                const materials = await new Promise<MTLLoaderJs.MTLLoader.MaterialCreator>((resolve, reject) => {
                    mtlLoader.load(mtlFile, resolve, undefined, reject);
                });
                console.log("MTL file loaded successfully");
                objLoader.setMaterials(materials);

                const object = await new Promise<three.Object3D>((resolve, reject) => {
                    objLoader.load(objFile, resolve, undefined, reject);
                });
                console.log("OBJ file loaded successfully");

                const box = new three.Box3().setFromObject(object);
                const center = new three.Vector3();
                box.getCenter(center).negate();
                object.position.add(center);

                scene.add(object); // Add the loaded object directly to the scene
                return object;
            } catch (error) {
                if (!isFallback) {
                    console.error(`Failed to load model from API, attempting fallback for: ${model.objFile}`);
                    return loadModel(model, true);
                } else {
                    console.error(`Failed to load model from fallback as well: ${model.objFile}`);
                    throw error;
                }
            }
        };

        const fetchAndLoadModels = async () => {
            try {
                const response = await fetch('/api/models');
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const models = await response.json();

                let successfulLoads = 0;

                const promises = models.map((model: Model, index: number) =>
                    loadModel(model).then(obj => {
                        successfulLoads++;
                        setProgress((index + 1) / models.length * 100);
                        return obj;
                    }).catch(error => {
                        console.error(`Final fail to load model: ${error}`);
                        return null;
                    })
                );

                await Promise.all(promises);
                setModelLoaded(successfulLoads > 0);
            } catch (err) {
                console.error(err);
                setModelLoaded(false);
            }
        };

        fetchAndLoadModels();
    }, [setModelLoaded, setProgress, model, scene]);

    return null; // This component does not render anything itself
});

function App() {
    const [modelLoaded, setModelLoaded] = react.useState(false);
    const [progress, setProgress] = react.useState(0);
    const containerRef = react.useRef<HTMLDivElement>(null);
    const initialModel = {
        mtlFile: "/uploads/Assem1.mtl",
        objFile: "/uploads/Assem1.obj"
    };

    useDisableMiddleMouseScroll(containerRef);

    return (
        <div ref={containerRef} className="object-container">
            <fiber.Canvas>
                <drei.PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 15, 10]} angle={0.3} />
                <react.Suspense >
                    <ObjModel setModelLoaded={setModelLoaded} setProgress={setProgress} model={initialModel}/>
                </react.Suspense>
                <drei.OrbitControls />
                <ViewportTriad />
            </fiber.Canvas>
            {!modelLoaded && <div className="loading">Loading... {Math.round(progress)}%</div>}
            <div className="instructions">Use mouse or touch to orbit, zoom, and pan</div>
        </div>
    );
}

export default App;
