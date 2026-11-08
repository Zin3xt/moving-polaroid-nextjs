import Link from "next/link";
import {notFound} from "next/navigation";
import {ARViewer} from "@/components/ar-viewer";
import {getPolaroid} from "@/lib/polaroids";
export default async function PolaroidPage({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const polaroid=getPolaroid(id);if(!polaroid)notFound();
 return <main className="inner"><p className="eyebrow">A MEMORY IN MOTION</p><h1>{polaroid.title}</h1><p className="lead">{polaroid.caption}</p><ARViewer polaroid={polaroid}/>
 <p className="hint">The standard Camera app opens this site via QR. The website then asks permission to use your camera for AR.</p>
 <Link className="textlink" href={"/print/"+polaroid.id}>Print the matching test picture →</Link></main>;
}
