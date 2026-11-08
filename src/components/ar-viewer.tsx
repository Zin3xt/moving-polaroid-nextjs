"use client";
import {useEffect,useRef,useState} from "react";
import * as THREE from "three";
import type {Polaroid} from "@/lib/polaroids";

type Status="idle"|"starting"|"scanning"|"found"|"error";
export function ARViewer({polaroid}:{polaroid:Polaroid}){
 const containerRef=useRef<HTMLDivElement>(null);
 const videoRef=useRef<HTMLVideoElement>(null);
 const cleanupRef=useRef<(()=>void)|null>(null);
 const [status,setStatus]=useState<Status>("idle");
 const [error,setError]=useState("");
 const [sound,setSound]=useState(false);
 useEffect(()=>()=>cleanupRef.current?.(),[]);

 const stop=()=>{cleanupRef.current?.();cleanupRef.current=null;setStatus("idle");setSound(false);};
 const start=async()=>{
  const container=containerRef.current,video=videoRef.current;
  if(!container||!video||(status!=="idle"&&status!=="error"))return;
  setStatus("starting");setError("");
  let ar:InstanceType<typeof import("mind-ar/dist/mindar-image-three.prod.js").MindARThree>|undefined;
  let texture:THREE.VideoTexture|undefined;
  let geometry:THREE.PlaneGeometry|undefined;
  let material:THREE.MeshBasicMaterial|undefined;
  let cancelled=false;
  const destroy=()=>{
   cancelled=true;video.pause();
   if(ar){ar.renderer.setAnimationLoop(null);ar.stop();ar.renderer.dispose();}
   texture?.dispose();geometry?.dispose();material?.dispose();
  };
  cleanupRef.current=destroy;
  try {
   const {MindARThree}=await import("mind-ar/dist/mindar-image-three.prod.js");
   if(cancelled)return;
   ar=new MindARThree({container,imageTargetSrc:polaroid.targetSrc,maxTrack:1});
   const {renderer,scene,camera}=ar;
   const anchor=ar.addAnchor(0);
   video.muted=true;video.playsInline=true;video.currentTime=0;
   texture=new THREE.VideoTexture(video);texture.colorSpace=THREE.SRGBColorSpace;
   texture.minFilter=THREE.LinearFilter;texture.magFilter=THREE.LinearFilter;
   geometry=new THREE.PlaneGeometry(1,1/polaroid.targetAspectRatio);
   material=new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide,toneMapped:false});
   const plane=new THREE.Mesh(geometry,material);plane.position.z=0.01;
   anchor.group.add(plane);
   anchor.onTargetFound=()=>{
    if(cancelled)return;
    setStatus("found");
    void video.play().catch(()=>setError("Tap Play video below if autoplay is blocked."));
   };
   anchor.onTargetLost=()=>{if(cancelled)return;video.pause();setStatus("scanning");};
   await ar.start();
   if(cancelled){destroy();return;}
   setStatus(s=>s==="found"?s:"scanning");
   renderer.setAnimationLoop(()=>renderer.render(scene,camera));
  }catch(e){
   destroy();cleanupRef.current=null;
   setError(e instanceof Error?e.message:"Unable to open camera. Check HTTPS and permissions.");
   setStatus("error");
  }
 };
 const toggleSound=async()=>{
  const video=videoRef.current;if(!video)return;
  video.muted=sound;setSound(!sound);
  if(status==="found"&&video.paused){try{await video.play();}catch{setError("Tap Play video to resume.");}}
 };
 return <section className="arExperience">
  <div className="arStage">
   <div ref={containerRef} className="arContainer" aria-label="Augmented reality camera"/>
   <div className="reticle" aria-hidden="true">⌗</div>
   {(status==="idle"||status==="error")&&<div className="arOverlay"><span className="largeIcon">✧</span><h2>Bring your photo to life</h2><p>Allow camera access, then aim at the printed sample image.</p><button className="btn primary" type="button" onClick={start}>Start AR camera</button></div>}
   {status==="starting"&&<div className="arHud">Opening camera and loading image target…</div>}
   {status==="scanning"&&<div className="arHud">Point at the printed Polaroid photo</div>}
   {status==="found"&&<div className="arHud success">✦ Picture recognized · video playing</div>}
  </div>
  <video ref={videoRef} className="sourceVideo" src={polaroid.videoSrc} preload="auto" playsInline muted loop crossOrigin="anonymous"/>
  <div className="arControls"><p>{status==="found"?"Your moment is alive":"Keep the printed image in view"}</p>
  <div className="actions">
   {status==="found"&&<><button className="btn small" onClick={()=>void toggleSound()}>{sound?"Mute":"Enable sound"}</button><button className="btn small" onClick={()=>void videoRef.current?.play().catch(()=>setError("Video playback failed."))}>Play video</button></>}
   {status!=="idle"&&status!=="error"&&<button className="btn small" onClick={stop}>Stop camera</button>}
  </div></div>
  {error&&<p className="error" role="alert">{error}</p>}
  <p className="hint">Camera unavailable? <a target="_blank" rel="noopener noreferrer" href={polaroid.videoSrc}>Watch the video normally</a>.</p>
 </section>;
}
