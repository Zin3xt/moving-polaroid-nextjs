import type { Polaroid } from "@/lib/polaroids";

// Browser AR is isolated from the Next.js build: MindAR's npm package
// pulls a native node-canvas dependency that fails on standard Vercel builders.
export function ARViewer({ polaroid }: { polaroid: Polaroid }) {
  return <section className="arExperience">
    <div className="arStage">
      <iframe
        title="Moving Polaroid AR camera"
        src="/ar/demo.html"
        allow="camera; autoplay"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
      />
    </div>
    <p className="hint">Point the camera at the photo printed from the matching sample card.</p>
    <p className="hint">Camera unavailable? <a href={polaroid.videoSrc} target="_blank" rel="noopener noreferrer">Watch the sample video normally</a>.</p>
  </section>;
}
