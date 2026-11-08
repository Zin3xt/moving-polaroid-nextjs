type ImageCompiler = {
  compileImageTargets(images: HTMLImageElement[], onProgress: (progress: number) => void): Promise<unknown>;
  exportData(): Promise<ArrayBuffer | Uint8Array>;
};

type CompilerConstructor = new () => ImageCompiler;
type MindarWindow = Window & {
  MINDAR?: { IMAGE?: { Compiler?: CompilerConstructor } };
};

const COMPILER_SRC = "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image.prod.js";
let pendingLoad: Promise<CompilerConstructor> | null = null;

export async function loadCompiler(): Promise<CompilerConstructor> {
  const existing = (window as MindarWindow).MINDAR?.IMAGE?.Compiler;
  if (existing) return existing;
  if (!pendingLoad) {
    pendingLoad = new Promise<CompilerConstructor>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = COMPILER_SRC;
      script.async = true;
      script.onload = () => {
        const ctor = (window as MindarWindow).MINDAR?.IMAGE?.Compiler;
        if (ctor) resolve(ctor);
        else reject(new Error("MindAR compiler was not provided by the downloaded script."));
      };
      script.onerror = () => reject(new Error("Cannot download MindAR compiler. Check your internet connection."));
      document.head.appendChild(script);
    }).catch((error) => {
      pendingLoad = null;
      throw error;
    });
  }
  return pendingLoad;
}

function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This picture cannot be read as an image."));
    };
    image.src = url;
  });
}

export async function compilePhoto(
  photo: File,
  onProgress: (progress: number) => void
): Promise<{ target: Blob; aspectRatio: number }> {
  const Compiler = await loadCompiler();
  const image = await loadImage(photo);
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  if (width < 320 || height < 320) {
    throw new Error("Use a sharper photo (at least 320 pixels wide and high).");
  }
  const compiler = new Compiler();
  await compiler.compileImageTargets([image], (progress) => {
    const value = Number(progress);
    if (Number.isFinite(value)) {
      onProgress(Math.min(100, Math.max(0, Math.round(value))));
    }
  });
  const bytes = await compiler.exportData();
  return {
    target: new Blob([new Uint8Array(bytes)], { type: "application/octet-stream" }),
    aspectRatio: width / height,
  };
}

export async function imageAspectRatio(file: Blob): Promise<number> {
  const image = await loadImage(file);
  return image.naturalWidth / image.naturalHeight;
}
