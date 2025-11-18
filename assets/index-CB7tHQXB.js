import{E as w,S as y,C as b,F as E,V as l,H as R,W as v,a as x,L as A,Q as C,P as L}from"./babylon-UkJlfVTd.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))u(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&u(c)}).observe(document,{childList:!0,subtree:!0});function t(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function u(e){if(e.ep)return;e.ep=!0;const o=t(e);fetch(e.href,o)}})();async function m(){try{console.log("Starting AR initialization...");const s=document.getElementById("renderCanvas");if(!s)throw new Error("Canvas element with id 'renderCanvas' not found");const r=new w(s,!0),t=new y(r);t.clearColor=new b(0,0,0,0);const u=new E("camera",new l(0,0,0),t),e=new R("light",new l(0,1,0),t);if(e.intensity=1,console.log("Checking WebXR support..."),!await v.IsSessionSupportedAsync("immersive-ar"))throw new Error("WebXR AR is not supported on this device/browser");console.log("Creating XR experience...");const c=await t.createDefaultXRExperienceAsync({uiOptions:{sessionMode:"immersive-ar",referenceSpaceType:"local"},optionalFeatures:!0});console.log("Enabling image tracking...");const g=c.baseExperience.featuresManager.enableFeature(x.IMAGE_TRACKING,"latest",{images:[{src:"./furniture.jpg",estimatedRealWorldWidth:.2}]});let n=null,d=!1;console.log("Loading 3D model...");try{const i=await A("","/arm_chair__furniture.glb",t);i.addAllToScene();const a=i.meshes[0];a.scaling=new l(1,1,1),a.setEnabled(!1),console.log("Model loaded successfully")}catch(i){throw console.error("Error loading model:",i),new Error("Failed to load 3D model: "+i.message)}t.onBeforeRenderObservable.add(()=>{d&&n&&(n.position.y+=Math.sin(performance.now()*.002)*.01)}),g.onTrackedImageUpdatedObservable.add(i=>{if(n)if(console.log("Image tracking state:",i.trackingState),i.trackingState==="tracked"){n.setEnabled(!0),d=!0;const a=i.transformationMatrix,p=new l,f=new C,h=new l;a.decompose(h,f,p),n.position=p,n.rotationQuaternion=f,n.scaling.setAll(.1)}else n.setEnabled(!1),d=!1}),t.onPointerObservable.add(i=>{if(!(!d||!n)&&i.type===L.POINTERDOWN){const a=t.pick(t.pointerX,t.pointerY);a.hit&&a.pickedMesh===n&&(n.rotation.y+=.4,console.log("Model rotated"))}}),r.runRenderLoop(()=>{t.render()}),window.addEventListener("resize",()=>{r.resize()}),console.log("AR initialization complete")}catch(s){console.error("AR initialization failed:",s),M(s.message)}}function M(s){const r=document.createElement("div");r.style.cssText=`
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
    `,r.innerHTML=`
        <h3>AR Initialization Error</h3>
        <p>${s}</p>
        <p style="font-size: 0.9em; margin-top: 10px;">
            Check the browser console for more details (F12)
        </p>
    `,document.body.appendChild(r)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",m):m();
//# sourceMappingURL=index-CB7tHQXB.js.map
