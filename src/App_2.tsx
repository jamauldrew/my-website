/* App_2.tsx */
import React, { useEffect } from 'react';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { Box3, Vector3, Object3D } from 'three';
import { useThree } from '@react-three/fiber';

interface ObjModelProps {
    setModelLoaded: (loaded: boolean) => void;
    setProgress: (progress: number) => void;
    model: Model;
}

interface Model {
    mtlFile: string;
    objFile: string;
}

const ObjModel = React.memo(({ setModelLoaded, setProgress, model }: ObjModelProps) => {
    const { scene } = useThree(); // Use the useThree hook to access the scene

    useEffect(() => {
        const loadModel = async (model: Model, isFallback = false): Promise<Object3D> => {
            const mtlLoader = new MTLLoader();
            const objLoader = new OBJLoader();

            try {
                const basePath = isFallback ? '/fallback' : '';
                const mtlFile = `${basePath}/${model.mtlFile}`;
                const objFile = `${basePath}/${model.objFile}`;

                const materials = await new Promise<MTLLoader.MaterialCreator>((resolve, reject) => {
                    mtlLoader.load(mtlFile, resolve, undefined, reject);
                });
                console.log("MTL file loaded successfully");
                objLoader.setMaterials(materials);

                const object = await new Promise<Object3D>((resolve, reject) => {
                    objLoader.load(objFile, resolve, undefined, reject);
                });
                console.log("OBJ file loaded successfully");

                const box = new Box3().setFromObject(object);
                const center = new Vector3();
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

export default ObjModel;
