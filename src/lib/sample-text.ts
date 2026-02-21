interface SampledText {
  positions: Float32Array;
  width: number;
  height: number;
}

export async function sampleTextPositions(
  text: string,
  fontSize: number,
  maxParticles: number,
): Promise<SampledText> {
  await document.fonts.ready;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return { positions: new Float32Array(0), width: 0, height: 0 };
  }

  const font = `bold ${fontSize}px "Geist Sans", sans-serif`;
  ctx.font = font;
  const metrics = ctx.measureText(text);
  const padding = 20;
  const width = Math.ceil(metrics.width) + padding * 2;
  const height = fontSize * 1.4 + padding * 2;

  canvas.width = width;
  canvas.height = height;

  ctx.font = font;
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);

  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  const points: [number, number][] = [];
  const step = 2;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const alpha = pixels[idx + 3];
      if (alpha !== undefined && alpha > 128) {
        points.push([x - width / 2, -(y - height / 2)]);
      }
    }
  }

  const selected =
    points.length <= maxParticles
      ? points
      : shuffle(points).slice(0, maxParticles);

  const positions = new Float32Array(selected.length * 3);
  for (let i = 0; i < selected.length; i++) {
    const point = selected[i];
    if (!point) continue;
    positions[i * 3] = point[0];
    positions[i * 3 + 1] = point[1];
    positions[i * 3 + 2] = 0;
  }

  return { positions, width, height };
}

function shuffle<T>(arr: T[]): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = tmp;
  }
  return copy;
}
