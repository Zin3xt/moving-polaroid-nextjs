export type Polaroid = {
 id:string;title:string;caption:string;photoSrc:string;targetSrc:string;videoSrc:string;targetAspectRatio:number;
};
const demo:Polaroid={
 id:"demo",title:"A little moment in motion",caption:"Scan to see this memory come to life",
 photoSrc:"https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.png",
 targetSrc:"https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.mind",
 videoSrc:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
 targetAspectRatio:1/0.552
};
export const getPolaroid=(id:string):Polaroid|undefined=>id==="demo"?demo:undefined;
