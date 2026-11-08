"use client";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { Polaroid } from "@/lib/polaroids";

export function PrintCard({ polaroid }: { polaroid: Polaroid }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const path = polaroid.id === "demo" ? "/ar/demo.html" : "/p/" + encodeURIComponent(polaroid.id);
    setUrl(origin.replace(/\/$/, "") + path);
  }, [polaroid.id]);
  return <div className="printsection">
    <div className="printarea"><div className="polaroid">
      {/* QR should not overlap the tracked image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="polaroidImage" src={polaroid.photoSrc} alt="Printable sample AR tracking target" />
      <div className="polaroidBottom">
        <div><strong>look closer ✦</strong><small>scan me to relive this</small></div>
        <div className="qr">{url ? <QRCodeSVG value={url} size={73} /> : null}</div>
      </div>
    </div></div>
    <p className="hint">QR destination: <code>{url || "Preparing link…"}</code></p>
    <div className="actions noPrint">
      <button className="btn primary" onClick={() => window.print()}>Print Polaroid</button>
      <a className="btn" href={url || "#"}>Open AR camera</a>
    </div>
    <p className="hint noPrint">Print at 100% size, avoid reflections, and keep the original picture area sharp.</p>
  </div>;
}
