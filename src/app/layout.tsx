import type {Metadata} from "next";
import Link from "next/link";
import "./globals.css";
export const metadata:Metadata={title:"Moving Polaroid — Memories in Motion",description:"Scan a Polaroid QR and watch the picture move in your mobile browser."};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en"><body>
 <header className="header"><Link className="logo" href="/">✦ MOVING POLAROID</Link><nav><Link href="/p/demo">AR demo</Link><Link href="/print/demo">Print photo</Link></nav></header>
 {children}
 <footer>Made for moments worth reliving · Browser AR requires HTTPS and camera permission</footer>
 </body></html>;
}
