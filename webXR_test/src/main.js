import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

async function startAR() {
    const canvas = document.getElementById("canvas");
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, 0), scene);
    
    // Add light for visibility
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1;

    // Create XR experience with proper configuration for AR
    const xr = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: "immersive-ar",
            referenceSpaceType: "unbounded" // Changed from "local" to "unbounded" as recommended
        },
        optionalFeatures: true
    });

    let modelMesh = null;
    let modelPlaced = false;

    // Load the 3D model
    const result = await BABYLON.SceneLoader.ImportMeshAsync(
        "", "./",
        "arm_chair__furniture.glb",
        scene
    );

    modelMesh = result.meshes[0];
    modelMesh.setEnabled(false); // Hide until placed

    // When XR session starts, set up interaction
    xr.baseExperience.sessionManager.onXRSessionInit.add(() => {
        console.log("AR Session started!");
        
        const fm = xr.baseExperience.featuresManager;
        
        // Try to enable image tracking as optional feature
        try {
            const imageTracking = fm.enableFeature(
                BABYLON.WebXRFeatureName.IMAGE_TRACKING,
                "latest",
                {
                    images: [
                        {
                            src: "./furniture.jpg", // Make sure this matches your actual file
                            estimatedRealWorldWidth: 0.085
                        }
                    ]
                },
                false, // Not auto-attached
                false  // Optional feature - won't fail if not supported
            );
            
            if (imageTracking) {
                console.log("Image tracking available!");
                
                imageTracking.onTrackedImageUpdatedObservable.add(image => {
                    if (!modelMesh) return;
                    
                    const pose = image.realWorldTransform;
                    if (pose) {
                        modelMesh.setEnabled(true);
                        modelPlaced = true;
                        modelMesh.position.copyFrom(pose.position);
                        modelMesh.rotationQuaternion = pose.rotationQuaternion;
                        modelMesh.scaling.setAll(0.1);
                    }
                });
            }
        } catch (e) {
            console.log("Image tracking not supported, using hit-test fallback");
        }
        
        // Fallback: Use hit-test for surface placement
        try {
            const hitTest = fm.enableFeature(
                BABYLON.WebXRFeatureName.HIT_TEST, 
                "latest",
                {
                    // Ray pointing forward from camera
                    offsetRay: { 
                        origin: { x: 0, y: 0, z: 0 }, 
                        direction: { x: 0, y: 0, z: -1 } 
                    }
                }
            );
            
            if (hitTest) {
                console.log("Hit-test enabled for surface placement");
                
                // Show placement indicator
                const indicator = BABYLON.MeshBuilder.CreateTorus("indicator", {
                    diameter: 0.15,
                    thickness: 0.01
                }, scene);
                indicator.isVisible = false;
                
                // Update indicator position with hit test
                hitTest.onHitTestResultObservable.add((results) => {
                    if (results.length) {
                        const hitResult = results[0];
                        indicator.isVisible = true;
                        indicator.position = hitResult.position;
                        indicator.rotationQuaternion = hitResult.rotationQuaternion;
                    } else {
                        indicator.isVisible = false;
                    }
                });
                
                // Place model on tap
                scene.onPointerObservable.add((pointerInfo) => {
                    if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
                        if (indicator.isVisible && !modelPlaced) {
                            // Place the model at indicator position
                            modelMesh.setEnabled(true);
                            modelMesh.position = indicator.position.clone();
                            modelMesh.rotationQuaternion = indicator.rotationQuaternion.clone();
                            modelMesh.scaling.setAll(0.1);
                            modelPlaced = true;
                            indicator.isVisible = false;
                            console.log("Model placed on surface!");
                        } else if (modelPlaced) {
                            // Rotate model if already placed
                            modelMesh.rotation.y += 0.4;
                        }
                    }
                });
            }
        } catch (e) {
            console.log("Hit-test not available, using direct placement");
            
            // Ultimate fallback: Place model directly in front after delay
            setTimeout(() => {
                if (!modelPlaced && modelMesh) {
                    modelMesh.setEnabled(true);
                    modelMesh.position = new BABYLON.Vector3(0, 0, -1.5); // 1.5 meters in front
                    modelMesh.scaling.setAll(0.1);
                    modelPlaced = true;
                    console.log("Model placed at fixed position");
                }
            }, 2000);
        }
    });

    // Simple floating animation
    scene.onBeforeRenderObservable.add(() => {
        if (modelPlaced && modelMesh) {
            modelMesh.position.y += Math.sin(performance.now() * 0.002) * 0.001;
        }
    });

    engine.runRenderLoop(() => scene.render());
    window.addEventListener("resize", () => engine.resize());
    
    console.log("AR ready. Tap the AR button to start!");
}

startAR();