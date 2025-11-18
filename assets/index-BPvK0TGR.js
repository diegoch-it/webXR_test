import{E as f,S as m,C as g,F as h,V as u,H as y,W as w,a as b,b as E,P as R}from"./babylon-DGpKBIGw.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&c(s)}).observe(document,{childList:!0,subtree:!0});function r(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function c(e){if(e.ep)return;e.ep=!0;const o=r(e);fetch(e.href,o)}})();async function p(){try{console.log("Starting AR initialization...");const n=document.getElementById("renderCanvas");if(!n)throw new Error("Canvas element with id 'renderCanvas' not found");const t=new f(n,!0),r=new m(t);r.clearColor=new g(0,0,0,0);const c=new h("camera",new u(0,0,0),r),e=new y("light",new u(0,1,0),r);if(e.intensity=1,console.log("Checking WebXR support..."),!await w.IsSessionSupportedAsync("immersive-ar"))throw new Error("WebXR AR is not supported on this device/browser");console.log("Creating XR experience...");const s=await r.createDefaultXRExperienceAsync({uiOptions:{sessionMode:"immersive-ar",referenceSpaceType:"local"},optionalFeatures:!0});console.log("Enabling image tracking...");const x=s.baseExperience.featuresManager.enableFeature(b.IMAGE_TRACKING,"latest",{images:[{src:"./furniture.jpg",estimatedRealWorldWidth:.2}]});let a=null,l=!1;console.log("Loading 3D model...");try{const i=await E.LoadAssetContainerAsync("","arm_chair__furniture.glb",r);i.addAllToScene(),a=i.meshes[0],console.log("Model loaded successfully")}catch(i){throw console.error("Error loading model:",i),new Error("Failed to load 3D model: "+i.message)}r.onBeforeRenderObservable.add(()=>{}),r.onPointerObservable.add(i=>{if(!(!l||!a)&&i.type===R.POINTERDOWN){const d=r.pick(r.pointerX,r.pointerY);d.hit&&d.pickedMesh===a&&(a.rotation.y+=.4,console.log("Model rotated"))}}),t.runRenderLoop(()=>{r.render()}),window.addEventListener("resize",()=>{t.resize()}),console.log("AR initialization complete")}catch(n){console.error("AR initialization failed:",n),v(n.message)}}function v(n){const t=document.createElement("div");t.style.cssText=`
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
    `,t.innerHTML=`
        <h3>AR Initialization Error</h3>
        <p>${n}</p>
        <p style="font-size: 0.9em; margin-top: 10px;">
            Check the browser console for more details (F12)
        </p>
    `,document.body.appendChild(t)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",p):p();
//# sourceMappingURL=index-BPvK0TGR.js.map
