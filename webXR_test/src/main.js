import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

async function startAR() {
    try {
        console.log("Initializing WebXR...");
        
        const canvas = document.getElementById("canvas");
        if (!canvas) {
            throw new Error("Canvas element not found");
        }

        // Ensure canvas has dimensions
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
         // Create engine with explicit options to avoid initialization issues
        const engine = new BABYLON.Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            disableWebGL2Support: false, // Ensure WebGL2 is used if available
            audioEngine: false // Disable audio to reduce complexity
        });
        // Handle engine resize immediately
        window.addEventListener("resize", () => {
            engine.resize();
        });
        
        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
        
        const camera = new BABYLON.FreeCamera("camera", BABYLON.Vector3.Zero(), scene);
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 1;
        
        // Load model first
        console.log("Loading model..."); 
        let modelMesh = null;
        try {
            const result = await BABYLON.SceneLoader.ImportMeshAsync(
                "", "./",
                "arm_chair__furniture.glb",
                scene
            );
            modelMesh = result.meshes[0];
            modelMesh.setEnabled(false);
            console.log("Model loaded successfully");
        } catch (e) {
            console.error("Model loading failed:", e);
        }
        
        // Start render loop
        engine.runRenderLoop(() => scene.render());
        window.addEventListener("resize", () => engine.resize());
        
        // Create XR helper first without entering XR
        console.log("Setting up WebXR...");
        const xrHelper = await BABYLON.WebXRDefaultExperience.CreateAsync(scene, {
            uiOptions: {
                sessionMode: "immersive-ar",
                referenceSpaceType: "unbounded",
                onError: (error) => {
                    console.error("XR UI Error:", error);
                }
            },
            // Disable automatic entry into XR
            disableTeleportation: true,
            useStablePlugins: true,
            disableHandTracking: true,
        });
        
        let modelPlaced = false;
        
        // Configure features BEFORE entering XR
        const featuresManager = xrHelper.baseExperience.featuresManager;
        
        xrHelper.baseExperience.sessionManager.onXRSessionInit.add((xrSession) => {
            console.log("AR Session started!");
            
            // IMMEDIATELY place model - don't wait for hit-test
            if (modelMesh) {
                console.log("Placing model immediately");
                modelMesh.setEnabled(true);
                modelMesh.position = new BABYLON.Vector3(0, -0.5, -1.5); // 1.5m in front, 0.5m down
                modelMesh.scaling.setAll(0.1);
                modelPlaced = true;
            }
            
            // Create a visible test object to confirm rendering
            const testSphere = BABYLON.MeshBuilder.CreateSphere("testSphere", { diameter: 0.1 }, scene);
            const testMat = new BABYLON.StandardMaterial("testMat", scene);
            testMat.emissiveColor = new BABYLON.Color3(1, 0, 0); // Bright red
            testSphere.material = testMat;
            testSphere.position = new BABYLON.Vector3(0.5, 0, -0.2); // To the right
            
            // Your existing hit-test code can stay...
        });

        // Pre-configure hit-test feature (since image tracking isn't working)
        let hitTestFeature = null;
        try {
            hitTestFeature = featuresManager.enableFeature(
                BABYLON.WebXRFeatureName.HIT_TEST,
                "latest",
                {
                    offsetRay: {
                        origin: { x: 0, y: 0, z: 0 },
                        direction: { x: 0, y: 0, z: -1 }
                    }
                },
                false, // Don't attach yet
                false  // Optional feature
            );
            console.log("Hit-test feature configured");
        } catch (e) {
            console.log("Hit-test configuration failed:", e);
        }
        
        // Create placement indicator
        const indicator = BABYLON.MeshBuilder.CreateTorus("indicator", {
            diameter: 0.15,
            thickness: 0.01
        }, scene);
        const indicatorMat = new BABYLON.StandardMaterial("indicatorMat", scene);
        indicatorMat.emissiveColor = new BABYLON.Color3(0, 1, 0);
        indicatorMat.alpha = 0.7;
        indicator.material = indicatorMat;
        indicator.setEnabled(false);
        
        // Set up session event handlers
        xrHelper.baseExperience.sessionManager.onXRSessionInit.add((xrSession) => {
            console.log("AR Session started!");
            
            // Now attach the hit-test feature
            if (hitTestFeature) {
                try {
                    // Set up hit-test observable
                    hitTestFeature.onHitTestResultObservable.add((results) => {
                        if (results.length > 0 && !modelPlaced) {
                            const result = results[0];
                            indicator.setEnabled(true);
                            
                            // Use the transformation matrix directly
                            if (result.transformationMatrix) {
                                const matrix = result.transformationMatrix;
                                const position = new BABYLON.Vector3();
                                const quaternion = new BABYLON.Quaternion();
                                const scale = new BABYLON.Vector3();
                                matrix.decompose(scale, quaternion, position);
                                
                                indicator.position = position;
                                indicator.rotationQuaternion = quaternion;
                            } else {
                                indicator.position = result.position;
                                indicator.rotationQuaternion = result.rotationQuaternion;
                            }
                        } else if (modelPlaced) {
                            indicator.setEnabled(false);
                        }
                    });
                    
                    console.log("Hit-test activated");
                } catch (e) {
                    console.error("Hit-test activation error:", e);
                }
            }
            
            // If no features work, place model directly after a delay
            if (!hitTestFeature && modelMesh) {
                setTimeout(() => {
                    if (!modelPlaced) {
                        console.log("Placing model at fixed position");
                        modelMesh.setEnabled(true);
                        modelMesh.position = new BABYLON.Vector3(0, -0.5, -2);
                        modelMesh.scaling.setAll(0.1);
                        modelPlaced = true;
                    }
                }, 1000);
            }
        });
        
        // Handle tap to place model
        scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
                // Check if we're in an XR session
                if (!xrHelper.baseExperience.sessionManager.session) {
                    return;
                }
                
                if (!modelPlaced && indicator.isEnabled && modelMesh) {
                    // Place the model
                    modelMesh.setEnabled(true);
                    modelMesh.position = indicator.position.clone();
                    modelMesh.rotationQuaternion = indicator.rotationQuaternion ? 
                        indicator.rotationQuaternion.clone() : 
                        BABYLON.Quaternion.Identity();
                    modelMesh.scaling.setAll(0.1);
                    modelPlaced = true;
                    indicator.setEnabled(false);
                    console.log("Model placed!");
                } else if (modelPlaced && modelMesh) {
                    // Rotate the model
                    modelMesh.rotation.y += 0.4;
                    console.log("Model rotated");
                }
            }
        });
        
        // Add floating animation
        scene.registerBeforeRender(() => {
            if (modelPlaced && modelMesh && modelMesh.isEnabled()) {
                const time = performance.now() * 0.001;
                modelMesh.position.y += Math.sin(time * 2) * 0.0005;
            }
        });
        
        console.log("WebXR initialized successfully");
        console.log("Click the AR button to start the session");
        
    } catch (error) {
        console.error("AR initialization failed:", error);
        document.body.innerHTML = `
            <div style="padding: 20px; background: white; color: red;">
                <h2>AR Initialization Error</h2>
                <p>${error.message}</p>
                <p>Please check the console for details</p>
            </div>
        `;
    }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAR);
} else {
    startAR();
}