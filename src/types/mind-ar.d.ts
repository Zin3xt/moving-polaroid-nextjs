declare module "mind-ar/dist/mindar-image-three.prod.js" {
 import type {Camera,Group,Scene,WebGLRenderer} from "three";
 export class MindARThree {
  constructor(options:{container:HTMLElement;imageTargetSrc:string;maxTrack?:number});
  renderer:WebGLRenderer;scene:Scene;camera:Camera;
  addAnchor(index:number):{group:Group;onTargetFound?:()=>void;onTargetLost?:()=>void};
  start():Promise<void>;stop():void;
 }
}
