import{E as w,S as y,C as b,F as E,V as l,H as R,W as v,a as x,L as A,Q as C,P as L}from"./babylon-UkJlfVTd.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))u(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&u(c)}).observe(document,{childList:!0,subtree:!0});function t(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function u(e){if(e.ep)return;e.ep=!0;const r=t(e);fetch(e.href,r)}})();async function m(){try{console.log("Starting AR initialization...");const s=document.getElementById("renderCanvas");if(!s)throw new Error("Canvas element with id 'renderCanvas' not found");const n=new w(s,!0),t=new y(n);t.clearColor=new b(0,0,0,0);const u=new E("camera",new l(0,0,0),t),e=new R("light",new l(0,1,0),t);if(e.intensity=1,console.log("Checking WebXR support..."),!await v.IsSessionSupportedAsync("immersive-ar"))throw new Error("WebXR AR is not supported on this device/browser");console.log("Creating XR experience...");const c=await t.createDefaultXRExperienceAsync({uiOptions:{sessionMode:"immersive-ar",referenceSpaceType:"local"},optionalFeatures:!0});console.log("Enabling image tracking...");const g=c.baseExperience.featuresManager.enableFeature(x.IMAGE_TRACKING,"latest",{images:[{src:"./furniture.jpg",estimatedRealWorldWidth:.2}]});let o=null,d=!1;console.log("Loading 3D model...");try{await A("","arm_chair__furniture.glb",t).then(i=>{i.meshes.forEach(a=>{a.scaling=new l(1,1,1)})}),o=container.meshes[0],o.setEnabled(!1),console.log("Model loaded successfully")}catch(i){throw console.error("Error loading model:",i),new Error("Failed to load 3D model: "+i.message)}t.onBeforeRenderObservable.add(()=>{d&&o&&(o.position.y+=Math.sin(performance.now()*.002)*.01)}),g.onTrackedImageUpdatedObservable.add(i=>{if(o)if(console.log("Image tracking state:",i.trackingState),i.trackingState==="tracked"){o.setEnabled(!0),d=!0;const a=i.transformationMatrix,f=new l,p=new C,h=new l;a.decompose(h,p,f),o.position=f,o.rotationQuaternion=p,o.scaling.setAll(.1)}else o.setEnabled(!1),d=!1}),t.onPointerObservable.add(i=>{if(!(!d||!o)&&i.type===L.POINTERDOWN){const a=t.pick(t.pointerX,t.pointerY);a.hit&&a.pickedMesh===o&&(o.rotation.y+=.4,console.log("Model rotated"))}}),n.runRenderLoop(()=>{t.render()}),window.addEventListener("resize",()=>{n.resize()}),console.log("AR initialization complete")}catch(s){console.error("AR initialization failed:",s),M(s.message)}}function M(s){const n=document.createElement("div");n.style.cssText=`
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
//# sourceMappingURL=index-H97d6xoc.js.map
