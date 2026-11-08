"use client";
import {useEffect,useState} from "react";
import {QRCodeSVG} from "qrcode.react";
import type {Polaroid} from "@/lib/polaroids";
export function PrintCard({polaroid}:{polaroid:Polaroid}){
 const [url,setUrl]=useState("");
 useEffect(()=>{const origin=process.env.NEXT_PUBLIC_SITE_URL||window.location.origin;setUrl(origin.replace(/\/$/,"")+"/p/"+encodeURIComponent(polaroid.id));},[polaroid.id]);
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
