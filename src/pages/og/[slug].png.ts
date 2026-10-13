import type { APIRoute, GetStaticPaths } from 'astro';
import sharp from 'sharp';

// Open Graph images (1200x630 PNG) rasterised from the cover SVGs at build
// time. LinkedIn and Slack don't render SVG previews.
const covers = import.meta.glob<string>('../../assets/covers/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export const getStaticPaths = (() =>
  Object.entries(covers).map(([path, svg]) => ({
    params: { slug: path.split('/').pop()!.replace(/\.svg$/, '') },
    props: { svg },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await sharp(Buffer.from(props.svg as string))
    .resize(1200, 630, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
