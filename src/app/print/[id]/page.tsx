import {notFound} from "next/navigation";
import {PrintCard} from "@/components/print-card";
import {getPolaroid} from "@/lib/polaroids";
export default async function PrintPage({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const polaroid=getPolaroid(id);if(!polaroid)notFound();
 return <main className="inner"><p className="eyebrow">READY TO PRINT</p><h1>Your Polaroid, in real life.</h1><p className="lead">Scan the QR with your phone, open the page, and point the AR camera at the photo.</p><PrintCard polaroid={polaroid}/></main>;
}
