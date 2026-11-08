"use client";
import {useSyncExternalStore} from "react";
import {QRCodeSVG} from "qrcode.react";
import type {Polaroid} from "@/lib/polaroids";

const subscribe = () => () => {};
const getOrigin = () => window.location.origin;
const getServerOrigin = () => "";

export function PrintCard({polaroid}:{polaroid:Polaroid}){
 const browserOrigin=useSyncExternalStore(subscribe,getOrigin,getServerOrigin);
 const origin=process.env.NEXT_PUBLIC_SITE_URL||browserOrigin;
 const path=polaroid.id==="demo"?"/ar/demo.html":"/p/"+encodeURIComponent(polaroid.id);
 const url=origin?origin.replace(/\/$/,"")+path:"";
 return <div className="printsection">
 <div className="printarea"><div className="polaroid">
 {/* The QR code is outside the image target. */}
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img className="polaroidImage" src={polaroid.photoSrc} alt="Printable AR tracking target"/>
 <div className="polaroidBottom"><div><strong>look closer ✦</strong><small>scan me to relive this</small></div><div className="qr">{url?<QRCodeSVG value={url} size={73}/>:null}</div></div>
 </div></div>
 <p className="hint">QR destination: <code>{url||"Preparing link…"}</code></p>
 <div className="actions noPrint"><button className="btn primary" onClick={()=>window.print()}>Print Polaroid</button><a className="btn" href={url||"#"}>Open AR page</a></div>
 <p className="hint noPrint">Print at 100% size, keep the target image sharp and avoid glossy reflections.</p>
 </div>;
}
