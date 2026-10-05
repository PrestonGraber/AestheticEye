import fs from 'node:fs';
import path from 'node:path';
import { imageSize } from 'image-size';

const directory = path.resolve('public/assets');
const manifest = {};
for (const name of fs.readdirSync(directory)) {
  if (!/\.(?:jpe?g|png|webp)$/i.test(name)) continue;
  const buffer = fs.readFileSync(path.join(directory, name));
  const { width, height } = imageSize(buffer);
  manifest[name] = { width, height };
}
fs.writeFileSync('src/asset-dimensions.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(
  `Recorded original dimensions for ${Object.keys(manifest).length} photos and logos. No media was modified.`,
);

const video = fs.readFileSync(path.join(directory, 'REAL-ESTATE-1.mp4'));
const tracks = [];
function boxes(start, end, trail = []) {
  for (let offset = start; offset + 8 <= end;) {
    let size = video.readUInt32BE(offset);
    const type = video.toString('ascii', offset + 4, offset + 8);
    let header = 8;
    if (size === 1) {
      size = Number(video.readBigUInt64BE(offset + 8));
      header = 16;
    }
    if (size === 0) size = end - offset;
    if (size < header || offset + size > end) break;
    if (type === 'hdlr')
      tracks.push({
        path: [...trail, type].join('/'),
        handler: video.toString('ascii', offset + header + 8, offset + header + 12),
      });
    if (['moov', 'trak', 'mdia'].includes(type))
      boxes(offset + header, offset + size, [...trail, type]);
    offset += size;
  }
}
boxes(0, video.length);
console.log('Original video track types:', tracks);
