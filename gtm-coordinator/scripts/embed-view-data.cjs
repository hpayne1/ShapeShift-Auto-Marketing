/**
 * Injects __PACKET_DATA__ (drafts + paths) into an existing packet's view.html
 * so the preview works when opened from disk (file://).
 * Usage: node scripts/embed-view-data.cjs <packet-dir>
 * Example: node scripts/embed-view-data.cjs research-output/rfox
 */
const fs = require('fs');
const path = require('path');

const packetDir = path.resolve(process.cwd(), process.argv[2] || 'research-output/rfox');
const viewPath = path.join(packetDir, 'view.html');

if (!fs.existsSync(viewPath)) {
  console.error('view.html not found at', viewPath);
  process.exit(1);
}

const packetData = { drafts: {}, paths: {} };

const draftsDir = path.join(packetDir, 'drafts');
if (fs.existsSync(draftsDir)) {
  for (const name of fs.readdirSync(draftsDir)) {
    if (name.endsWith('.md')) {
      const id = name.slice(0, -3);
      packetData.drafts[id] = fs.readFileSync(path.join(draftsDir, name), 'utf8');
    }
  }
}

const pathDirs = [{ dir: '', files: ['README.md'] }];
for (const sub of ['partner', 'press', 'design', 'outreach', 'seo', 'calendar']) {
  const subPath = path.join(packetDir, sub);
  if (fs.existsSync(subPath))
    pathDirs.push({ dir: sub, files: fs.readdirSync(subPath) });
}
for (const { dir, files } of pathDirs) {
  const dirPath = dir ? path.join(packetDir, dir) : packetDir;
  if (!fs.existsSync(dirPath)) continue;
  for (const name of files) {
    if (!name.endsWith('.md') && !name.endsWith('.txt')) continue;
    const rel = dir ? `${dir}/${name}` : name;
    const fpath = path.join(dirPath, name);
    try {
      if (fs.statSync(fpath).isFile())
        packetData.paths[rel] = fs.readFileSync(fpath, 'utf8');
    } catch (_) {}
  }
}

let viewHtml = fs.readFileSync(viewPath, 'utf8');
if (viewHtml.includes('window.__PACKET_DATA__')) {
  viewHtml = viewHtml.replace(/<script>window\.__PACKET_DATA__=[^<]+<\/script>\n?/g, '');
}
const script = `<script>window.__PACKET_DATA__=${JSON.stringify(packetData)};</script>`;
viewHtml = viewHtml.replace('</body>', `${script}\n</body>`);
fs.writeFileSync(viewPath, viewHtml);
console.log('Injected __PACKET_DATA__ into', viewPath);
