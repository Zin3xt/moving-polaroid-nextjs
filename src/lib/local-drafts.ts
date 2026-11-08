export type LocalDraft = {
  id: string;
  title: string;
  caption: string;
  createdAt: number;
  photo: Blob;
  video: Blob;
  target: Blob;
  aspectRatio: number;
};

const DB_NAME = "moving-polaroid-studio";
const STORE = "drafts";

function openDraftDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("This browser does not support local drafts."));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Cannot open local draft storage."));
  });
}

export async function listDrafts(): Promise<LocalDraft[]> {
  const db = await openDraftDB();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () =>
        resolve((req.result as LocalDraft[]).sort((a, b) => b.createdAt - a.createdAt));
      req.onerror = () => reject(req.error ?? new Error("Unable to load drafts."));
    });
  } finally {
    db.close();
  }
}

export async function getDraft(id: string): Promise<LocalDraft | null> {
  const db = await openDraftDB();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(id);
      req.onsuccess = () => resolve((req.result as LocalDraft | undefined) ?? null);
      req.onerror = () => reject(req.error ?? new Error("Unable to open draft."));
    });
  } finally {
    db.close();
  }
}

export async function putDraft(draft: LocalDraft): Promise<void> {
  const db = await openDraftDB();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(draft);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("Unable to save draft."));
      tx.onabort = () => reject(tx.error ?? new Error("Draft save cancelled."));
    });
  } finally {
    db.close();
  }
}

export async function deleteDraft(id: string): Promise<void> {
  const db = await openDraftDB();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("Unable to delete draft."));
    });
  } finally {
    db.close();
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 3000);
}
