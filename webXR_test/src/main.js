import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

async function startAR() {
    try {
        console.log("Starting AR initialization...");
        
        // Get canvas element - make sure this ID matches your HTML
        const canvas = document.getElementById("renderCanvas");
        if (!canvas) {
            throw new Error("Canvas element with id 'renderCanvas' not found");
        }
        
        const engine = new BABYLON.Engine(canvas, true);
        const scene = new BABYLON.Scene(engine);
        
        // Set transparent background for AR
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
        
        // Create camera
        const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, 0), scene);
        
        // Add light to the scene
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 1;
        
        console.log("Checking WebXR support...");
        
        // Check if WebXR is supported
        const xrSupported = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-ar');
        if (!xrSupported) {
            throw new Error("WebXR AR is not supported on this device/browser");
        }
        
        console.log("Creating XR experience...");
        
        // Create XR experience
        const xr = await scene.createDefaultXRExperienceAsync({
            uiOptions: {
                sessionMode: "immersive-ar",
                referenceSpaceType: "local"
            },
            optionalFeatures: true
        });
        
        console.log("Enabling image tracking...");
        
        // Enable image tracking
        const fm = xr.baseExperience.featuresManager;
        const imageTracking = fm.enableFeature(
            BABYLON.WebXRFeatureName.IMAGE_TRACKING,
            "latest",
            {
                images: [
                    {
                        src: "./furniture.jpg", // Updated to match your actual file
                        estimatedRealWorldWidth: 0.2 // 20cm width - adjust based on your actual image size
                    }
                ]
            }
        );
        
        let modelMesh = null;
        let anchorFound = false;
        
        console.log("Loading 3D model...");
        
        // Load the 3D model
        try {
            const container = await BABYLON.SceneLoader.LoadAssetContainerAsync(
                "", 
                "arm_chair__furniture.glb", // ensures GH Pages works
                scene
            );
            container.addAllToScene();  

            modelMesh = container.meshes[0];
            modelMesh.scaling = new BABYLON.Vector3(1, 1, 1);
            modelMesh.setEnabled(false); // Hide initially
            
            console.log("Model loaded successfully");
        } catch (modelError) {
            console.error("Error loading model:", modelError);
            throw new Error("Failed to load 3D model: " + modelError.message);
        }
        
        // Simple "floating" animation
        scene.onBeforeRenderObservable.add(() => {
            if (anchorFound && modelMesh) {
                modelMesh.position.y += Math.sin(performance.now() * 0.002) * 0.01;
            }
        });
        
        // Image tracking event handler
        imageTracking.onTrackedImageUpdatedObservable.add((image) => {
            if (!modelMesh) return;
            
            console.log("Image tracking state:", image.trackingState);
            
            if (image.trackingState === 'tracked') {
                modelMesh.setEnabled(true);
                anchorFound = true;
                
                // Get transformation from the tracked image
                const matrix = image.transformationMatrix;
                const position = new BABYLON.Vector3();
                const rotation = new BABYLON.Quaternion();
                const scale = new BABYLON.Vector3();
                
                matrix.decompose(scale, rotation, position);
                
                // Apply position and rotation
                modelMesh.position = position;
                modelMesh.rotationQuaternion = rotation;
                
                // Set appropriate scale for your model
                modelMesh.scaling.setAll(0.1); // Adjust this value based on your model size
            } else {
                // Hide model when tracking is lost
                modelMesh.setEnabled(false);
                anchorFound = false;
            }
        });
        
        // Tap interaction: rotate the model
        scene.onPointerObservable.add((pointerInfo) => {
            if (!anchorFound || !modelMesh) return;
            
            if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
                const pickResult = scene.pick(
                    scene.pointerX, 
                    scene.pointerY
                );
                
                if (pickResult.hit && pickResult.pickedMesh === modelMesh) {
                    modelMesh.rotation.y += 0.4;
                    console.log("Model rotated");
                }
            }
        });
        
        // Start render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
        
        // Handle window resize
        window.addEventListener("resize", () => {
            engine.resize();
        });
        
        console.log("AR initialization complete");
        
    } catch (error) {
        console.error("AR initialization failed:", error);
        showError(error.message);
    }
}

// Error display function
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        font-family: Arial, sans-serif;
        z-index: 10000;
        max-width: 80%;
        text-align: center;
    `;
    errorDiv.innerHTML = `
        <h3>AR Initialization Error</h3>
        <p>${message}</p>
        <p style="font-size: 0.9em; margin-top: 10px;">
            Check the browser console for more details (F12)
        </p>
    `;
    document.body.appendChild(errorDiv);
}

// Start AR when page is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAR);
} else {
    startAR();
}
