import{E as w,S as y,C as b,F as E,V as c,H as R,W as v,a as x,L as A,Q as C,P as L}from"./babylon-UkJlfVTd.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))u(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&u(a)}).observe(document,{childList:!0,subtree:!0});function o(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function u(e){if(e.ep)return;e.ep=!0;const r=o(e);fetch(e.href,r)}})();async function m(){try{console.log("Starting AR initialization...");const s=document.getElementById("renderCanvas");if(!s)throw new Error("Canvas element with id 'renderCanvas' not found");const n=new w(s,!0),o=new y(n);o.clearColor=new b(0,0,0,0);const u=new E("camera",new c(0,0,0),o),e=new R("light",new c(0,1,0),o);if(e.intensity=1,console.log("Checking WebXR support..."),!await v.IsSessionSupportedAsync("immersive-ar"))throw new Error("WebXR AR is not supported on this device/browser");console.log("Creating XR experience...");const a=await o.createDefaultXRExperienceAsync({uiOptions:{sessionMode:"immersive-ar",referenceSpaceType:"local"},optionalFeatures:!0});console.log("Enabling image tracking...");const g=a.baseExperience.featuresManager.enableFeature(x.IMAGE_TRACKING,"latest",{images:[{src:"./furniture.jpg",estimatedRealWorldWidth:.2}]});let t=null,l=!1;console.log("Loading 3D model...");try{const i=await A("/","arm_chair__furniture.glb",o);i.addAllToScene(),t=i.meshes[0],t.scaling=new c(1,1,1),t.setEnabled(!1),console.log("Model loaded successfully")}catch(i){throw console.error("Error loading model:",i),new Error("Failed to load 3D model: "+i.message)}o.onBeforeRenderObservable.add(()=>{l&&t&&(t.position.y+=Math.sin(performance.now()*.002)*.01)}),g.onTrackedImageUpdatedObservable.add(i=>{if(t)if(console.log("Image tracking state:",i.trackingState),i.trackingState==="tracked"){t.setEnabled(!0),l=!0;const d=i.transformationMatrix,p=new c,f=new C,h=new c;d.decompose(h,f,p),t.position=p,t.rotationQuaternion=f,t.scaling.setAll(.1)}else t.setEnabled(!1),l=!1}),o.onPointerObservable.add(i=>{if(!(!l||!t)&&i.type===L.POINTERDOWN){const d=o.pick(o.pointerX,o.pointerY);d.hit&&d.pickedMesh===t&&(t.rotation.y+=.4,console.log("Model rotated"))}}),n.runRenderLoop(()=>{o.render()}),window.addEventListener("resize",()=>{n.resize()}),console.log("AR initialization complete")}catch(s){console.error("AR initialization failed:",s),S(s.message)}}function S(s){const n=document.createElement("div");n.style.cssText=`
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
    `,n.innerHTML=`
        <h3>AR Initialization Error</h3>
        <p>${s}</p>
        <p style="font-size: 0.9em; margin-top: 10px;">
            Check the browser console for more details (F12)
        </p>
    `,document.body.appendChild(n)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",m):m();
//# sourceMappingURL=index-C990QZ2t.js.map
