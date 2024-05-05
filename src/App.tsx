/* App.tsx */
import react from 'react';
import * as fiber from '@react-three/fiber';
import * as drei from '@react-three/drei';
import * as OBJLoaderJs from 'three/examples/jsm/loaders/OBJLoader.js';
import * as MTLLoaderJs from 'three/examples/jsm/loaders/MTLLoader.js';
import * as three from 'three';
import { OrthographicCamera } from '@react-three/drei';

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

fiber.extend({ OrthographicCamera });

interface HudProps {
    children: JSX.Element;
    renderPriority?: number;
}

const Hud: react.FC<HudProps> = ({ children }) => {
  const { gl, scene, camera } = fiber.useThree();
  fiber.useFrame(() => {
    const originalAutoClear = gl.autoClear;
    gl.autoClear = false;
    gl.clearDepth();
    gl.render(scene, camera);
    gl.autoClear = originalAutoClear;
  }, 2);

    return fiber.createPortal(children, scene);;
};

const ViewportTriad = () => {
  const { size } = fiber.useThree();
  const triadScene = react.useRef(new three.Scene()).current;
      const arrowLength = 1;
      const arrowHeadSize = 0.05;

    // Setup the triad scene once
  react.useEffect(() => {
      const xArrow = new three.ArrowHelper(new three.Vector3(1, 0, 0), new three.Vector3(0, 0, 0), arrowLength, 0xff0000, arrowHeadSize);
      const yArrow = new three.ArrowHelper(new three.Vector3(0, 1, 0), new three.Vector3(0, 0, 0), arrowLength, 0x00ff00, arrowHeadSize);
      const zArrow = new three.ArrowHelper(new three.Vector3(0, 0, 1), new three.Vector3(0, 0, 0), arrowLength, 0x0000ff, arrowHeadSize);
    triadScene.add(xArrow, yArrow, zArrow);
  }, []);

    return (
        <Hud>
        <primitive object={triadScene}
        position={[size.width - 100, size.height - 100, 0]}
        />
        </Hud>
    );
};

interface ObjModelProps {
    setModelLoaded: (loaded: boolean) => void;
    model?: Model;
}

interface Model {
    mtlFile: string;
    objFile: string;
}

const ObjModel = react.memo(({ setModelLoaded, model }: ObjModelProps) => {
    const { scene } = fiber.useThree();

    react.useEffect(() => {
        if (!model) return;

        const loadModel = async (model: Model): Promise<three.Object3D> => {
            const mtlLoader = new MTLLoaderJs.MTLLoader();
            const objLoader = new OBJLoaderJs.OBJLoader();

            try {
                const materials = await mtlLoader.loadAsync(model.mtlFile);
                console.log("MTL file loaded successfully");
                objLoader.setMaterials(materials);

                const object = await objLoader.loadAsync(model.objFile);
                console.log("OBJ file loaded successfully");

                // Calculate the bounding box and center the object
                const boundingBox = new three.Box3().setFromObject(object);
                const center = new three.Vector3();
                boundingBox.getCenter(center);
                object.position.sub(center);

                scene.add(object);
                return object;
            } catch (error) {
                console.error(`Failed to load model: ${model.objFile}`, error);
                throw error;
            }
        };

        loadModel(model)
            .then(() => setModelLoaded(true))
            .catch(() => setModelLoaded(false));

    }, [setModelLoaded, model, scene]);

    return null;
});

function App() {
    const [modelLoaded, setModelLoaded] = react.useState(false);
    const [progress] = react.useState(0);
    const containerRef = react.useRef<HTMLDivElement>(null);
    const initialModel = {
        mtlFile: "uploads/Assem1.mtl",
        objFile: "uploads/Assem1.obj"
    };

    useDisableMiddleMouseScroll(containerRef);

    return (
        <div ref={containerRef} className="object-container">
            <fiber.Canvas>
                <drei.OrthographicCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.6} />
                <spotLight position={[10, 15, 10]} angle={0.3} />
                <react.Suspense >
                    <ObjModel setModelLoaded={setModelLoaded} model={initialModel} />
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
