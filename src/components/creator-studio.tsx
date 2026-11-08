"use client";

import { useEffect, useRef, useState } from "react";
import { compilePhoto, imageAspectRatio } from "@/lib/browser-compiler";
import { deleteDraft, downloadBlob, listDrafts, putDraft, type LocalDraft } from "@/lib/local-drafts";

const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const MAX_VIDEO_BYTES = 80 * 1024 * 1024;

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, { dateStyle: "medium" });
}

function DraftCard({
  draft,
  onDelete,
}: {
  draft: LocalDraft;
  onDelete: (id: string) => void;
}) {
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;
    const url = URL.createObjectURL(draft.photo);
    image.src = url;
    return () => URL.revokeObjectURL(url);
  }, [draft.photo]);

  return <article className="draftCard">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img ref={imageRef} alt={draft.title} className="draftThumb" />
    <div className="draftCardBody">
      <strong>{draft.title}</strong>
      <span className="hint">{formatDate(draft.createdAt)} · Saved on this device</span>
      <div className="draftActions">
        <a className="btn small primary" href={"/ar/local.html?id=" + encodeURIComponent(draft.id)}>Test AR</a>
        <a className="btn small" href={"/studio/print.html?id=" + encodeURIComponent(draft.id)}>Print</a>
        <button type="button" className="btn small" onClick={() => downloadBlob(draft.target, draft.id + ".mind")}>Get .mind</button>
        <button type="button" className="textDanger" onClick={() => onDelete(draft.id)}>Delete</button>
      </div>
    </div>
  </article>;
}

export function CreatorStudio() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [existingTarget, setExistingTarget] = useState<File | null>(null);
  const photoPreviewRef = useRef<HTMLImageElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const [drafts, setDrafts] = useState<LocalDraft[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void listDrafts().then(setDrafts).catch((reason) => {
      setError(reason instanceof Error ? reason.message : "Cannot load local drafts.");
    });
  }, []);

  useEffect(() => {
    const image = photoPreviewRef.current;
    if (!photo || !image) return;
    const url = URL.createObjectURL(photo);
    image.src = url;
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  useEffect(() => {
    const player = videoPreviewRef.current;
    if (!video || !player) return;
    const url = URL.createObjectURL(video);
    player.src = url;
    player.load();
    return () => {
      player.pause();
      URL.revokeObjectURL(url);
    };
  }, [video]);

  async function createDraft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError("");
    setStatus("");
    if (!photo || !video) {
      setError("Please choose a photo and video.");
      return;
    }
    if (!IMAGE_TYPES.has(photo.type) || photo.size > MAX_IMAGE_BYTES) {
      setError("Photo must be JPG, PNG, or WebP and no larger than 12 MB.");
      return;
    }
    if (!VIDEO_TYPES.has(video.type) || video.size > MAX_VIDEO_BYTES) {
      setError("Video must be MP4 or WebM and no larger than 80 MB.");
      return;
    }
    if (existingTarget && (existingTarget.size > 15 * 1024 * 1024 || !existingTarget.name.toLowerCase().endsWith(".mind"))) {
      setError("The optional tracking file must be a .mind file smaller than 15 MB.");
      return;
    }
    setBusy(true);
    setProgress(0);
    try {
      setStatus(existingTarget ? "Checking uploaded tracking file…" : "Generating the image tracking file…");
      const result = existingTarget
        ? { target: existingTarget as Blob, aspectRatio: await imageAspectRatio(photo) }
        : await compilePhoto(photo, setProgress);
      const draft: LocalDraft = {
        id: crypto.randomUUID(),
        title: title.trim().slice(0, 80) || "Untitled memory",
        caption: caption.trim().slice(0, 180),
        createdAt: Date.now(),
        photo,
        video,
        target: result.target,
        aspectRatio: result.aspectRatio,
      };
      await putDraft(draft);
      setDrafts(await listDrafts());
      setStatus("Saved privately in this browser. Use Test AR on the same device, or download your .mind file.");
      setProgress(100);
      setTitle("");
      setCaption("");
      setPhoto(null);
      setVideo(null);
      setExistingTarget(null);
      form.reset();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to compile or save this Polaroid.");
    } finally {
      setBusy(false);
    }
  }

  async function removeDraft(id: string) {
    if (!window.confirm("Delete this local draft and its photo/video from this browser?")) return;
    try {
      await deleteDraft(id);
      setDrafts(await listDrafts());
      setStatus("Draft deleted from this browser.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to delete draft.");
    }
  }

  return <div className="studioRoot">
    <div className="studioNotice" role="note">
      <strong><span aria-hidden="true">🔒</span> Private browser workspace</strong>
      <p>Your image, video, and tracking file are saved only in this browser&apos;s IndexedDB. They are not uploaded to Vercel or GitHub. A QR code for other phones is not available until secure publishing is implemented.</p>
    </div>

    <div className="studioLayout">
      <section className="studioPanel">
        <h2>1. Create your Polaroid</h2>
        <form onSubmit={(event) => void createDraft(event)} className="studioForm">
          <label htmlFor="studio-title">Title</label>
          <input id="studio-title" type="text" maxLength={80} placeholder="A day to remember" value={title} onChange={(event) => setTitle(event.target.value)} />
          <label htmlFor="studio-caption">Caption (optional)</label>
          <input id="studio-caption" type="text" maxLength={180} placeholder="November 2026 ✨" value={caption} onChange={(event) => setCaption(event.target.value)} />
          <label htmlFor="studio-photo">Printed photo · JPG, PNG or WebP (max 12 MB)</label>
          <input id="studio-photo" type="file" accept="image/png,image/jpeg,image/webp" required onChange={(event) => setPhoto(event.target.files?.[0] ?? null)} />
          <label htmlFor="studio-video">Moving video · MP4 or WebM (max 80 MB)</label>
          <input id="studio-video" type="file" accept="video/mp4,video/webm" required onChange={(event) => setVideo(event.target.files?.[0] ?? null)} />
          <details className="studioAdvanced">
            <summary>Already have a .mind target file?</summary>
            <p className="hint">You can import a precompiled MindAR target instead of generating it automatically. Make sure it matches the exact photo selected above.</p>
            <input aria-label="Optional MindAR target file" type="file" accept=".mind" onChange={(event) => setExistingTarget(event.target.files?.[0] ?? null)} />
          </details>
          <button className="btn primary" type="submit" disabled={busy || !photo || !video}>{busy ? "Working on your AR target…" : "Create private Polaroid"}</button>
          {busy && <progress value={progress ?? 0} max={100} aria-label="Image target compilation progress" />}
          {status && <p className="studioSuccess" role="status">{status}</p>}
          {error && <p className="studioError" role="alert">{error}</p>}
        </form>
      </section>

      <aside className="studioPanel">
        <h2>2. Review your media</h2>
        <div className="studioPreview">
          {photo
            // eslint-disable-next-line @next/next/no-img-element
            ? <div className="studioPolaroid"><img ref={photoPreviewRef} alt="Selected Polaroid photo" /><p>{caption || title || "a moving memory ♡"}</p></div>
            : <div className="studioEmpty"><span aria-hidden="true">▣</span><p>Select a photo to see a Polaroid preview.</p></div>}
        </div>
        {video
          ? <video ref={videoPreviewRef} controls playsInline preload="metadata" className="studioVideo" />
          : <p className="hint">Your selected video preview will appear here.</p>}
        <p className="hint">Use a detailed, sharp image without the white border or QR code as the AR target. Print the same image without cropping or rotating it.</p>
      </aside>
    </div>

    <section className="studioPanel studioLibrary">
      <div className="studioLibraryHeader">
        <div><p className="eyebrow">ON THIS DEVICE</p><h2>3. Your drafts</h2></div>
        <span className="draftCount">{drafts.length} saved</span>
      </div>
      {drafts.length
        ? <div className="draftGrid">{drafts.map((draft) => <DraftCard key={draft.id} draft={draft} onDelete={(id) => void removeDraft(id)} />)}</div>
        : <p className="hint">Create your first draft to test camera tracking and generate a print-ready Polaroid.</p>}
    </section>

    <section className="studioNotice">
      <strong>Publishing comes next</strong>
      <p>A public QR must point to hosted photo, video, and .mind files. Publishing will require sign-in, authenticated uploads, durable storage, and explicit confirmation before anything is publicly accessible.</p>
    </section>
  </div>;
}
