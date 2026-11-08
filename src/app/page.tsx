import Link from "next/link";
export default function Home(){
 return <main className="home">
 <section className="hero">
  <div><p className="eyebrow">A new way to keep your memories</p><h1>Your favorite moments, <em>alive again.</em></h1>
  <p className="lead">Print a picture. Scan its QR with your normal phone camera. Open the link and point your phone at the photo to watch it come alive.</p>
  <div className="actions"><Link className="btn primary" href="/p/demo">Open AR demo ↗</Link><Link className="btn" href="/print/demo">Print sample card</Link></div>
  <p className="hint">No dedicated AR app required. The normal camera opens the browser experience.</p></div>
  <div className="heroArt"><div className="photoArt"><div className="sun"/><div className="hills">✦</div><p>hold onto this feeling ♡</p></div></div>
 </section>
 <section className="steps"><p className="eyebrow">HOW IT WORKS</p><h2>Three steps. One magical moment.</h2><div className="stepgrid">
 <article><b>01</b><h3>Print the picture</h3><p>Use the correct tracked photo on your Polaroid card.</p></article>
 <article><b>02</b><h3>Scan the QR code</h3><p>Open the link from your normal phone camera.</p></article>
 <article><b>03</b><h3>See it move</h3><p>Allow browser camera access to view video over the print.</p></article>
 </div></section>
 <section className="notice"><strong>Demo:</strong> This prototype uses MindAR’s official sample card with a separate demonstration video. Real photos need their own compiled .mind tracking files.</section>
 </main>;
}
