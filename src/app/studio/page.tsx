import { CreatorStudio } from "@/components/creator-studio";

export const metadata = {
  title: "Creator Studio — Moving Polaroid",
  description: "Create and test your own moving photo locally in the browser.",
};

export default function StudioPage() {
  return <main className="inner studioPage">
    <p className="eyebrow">PHASE 2 · CREATOR STUDIO</p>
    <h1>Create a moving memory.</h1>
    <p className="lead">Upload a picture and video, compile its AR target, and preview your personal Polaroid. Your draft stays on this device.</p>
    <CreatorStudio />
  </main>;
}
