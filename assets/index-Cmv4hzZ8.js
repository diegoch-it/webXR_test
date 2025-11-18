import{E as w,S as y,C as b,F as E,V as d,H as R,W as v,a as x,b as A,Q as S,P as C}from"./babylon-ePRypmtb.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))u(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&u(a)}).observe(document,{childList:!0,subtree:!0});function t(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function u(e){if(e.ep)return;e.ep=!0;const o=t(e);fetch(e.href,o)}})();async function m(){try{console.log("Starting AR initialization...");const s=document.getElementById("renderCanvas");if(!s)throw new Error("Canvas element with id 'renderCanvas' not found");const n=new w(s,!0),t=new y(n);t.clearColor=new b(0,0,0,0);const u=new E("camera",new d(0,0,0),t),e=new R("light",new d(0,1,0),t);if(e.intensity=1,console.log("Checking WebXR support..."),!await v.IsSessionSupportedAsync("immersive-ar"))throw new Error("WebXR AR is not supported on this device/browser");console.log("Creating XR experience...");const a=await t.createDefaultXRExperienceAsync({uiOptions:{sessionMode:"immersive-ar",referenceSpaceType:"local"},optionalFeatures:!0});console.log("Enabling image tracking...");const g=a.baseExperience.featuresManager.enableFeature(x.IMAGE_TRACKING,"latest",{images:[{src:"./furniture.jpg",estimatedRealWorldWidth:.2}]});let r=null,c=!1;console.log("Loading 3D model...");try{r=(await A("arm_chair__furniture.glb",t)).meshes[0],r.setEnabled(!1),console.log("Model loaded successfully")}catch(i){throw console.error("Error loading model:",i),new Error("Failed to load 3D model: "+i.message)}t.onBeforeRenderObservable.add(()=>{c&&r&&(r.position.y+=Math.sin(performance.now()*.002)*.01)}),g.onTrackedImageUpdatedObservable.add(i=>{if(r)if(console.log("Image tracking state:",i.trackingState),i.trackingState==="tracked"){r.setEnabled(!0),c=!0;const l=i.transformationMatrix,p=new d,f=new S,h=new d;l.decompose(h,f,p),r.position=p,r.rotationQuaternion=f,r.scaling.setAll(.1)}else r.setEnabled(!1),c=!1}),t.onPointerObservable.add(i=>{if(!(!c||!r)&&i.type===C.POINTERDOWN){const l=t.pick(t.pointerX,t.pointerY);l.hit&&l.pickedMesh===r&&(r.rotation.y+=.4,console.log("Model rotated"))}}),n.runRenderLoop(()=>{t.render()}),window.addEventListener("resize",()=>{n.resize()}),console.log("AR initialization complete")}catch(s){console.error("AR initialization failed:",s),M(s.message)}}function M(s){const n=document.createElement("div");n.style.cssText=`
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
//# sourceMappingURL=index-Cmv4hzZ8.js.map
