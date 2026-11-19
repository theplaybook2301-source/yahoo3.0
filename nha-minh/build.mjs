// Build: gộp app thành một file HTML để đăng làm claude.ai Artifact.
// React/ReactDOM nạp từ jsDelivr (CDN được Artifact cho phép); phần còn lại inline.
//   node build.mjs              -> dist/nha-minh-messenger.html
//   LOCAL_REACT=1 OUT=x.html node build.mjs  -> bản thử nghiệm offline (inline React)
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const r = (p) => path.join(dir, p);

const js = await build({
  entryPoints: [r('src/main.jsx')],
  bundle: true,
  minify: true,
  write: false,
  format: 'iife',
  target: ['es2019'],
  jsx: 'transform',
  alias: {
    react: r('shims/react.js'),
    'react-dom/client': r('shims/react-dom-client.js'),
    'react/jsx-runtime': r('shims/jsx-runtime.js'),
  },
  define: { 'process.env.NODE_ENV': '"production"' },
  legalComments: 'none',
});
const appJs = js.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');

mkdirSync(r('dist'), { recursive: true });
const cssOut = r('dist/.tw.css');
writeFileSync(r('dist/.tw-in.css'), '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n');
execFileSync(process.execPath, [r('node_modules/tailwindcss/lib/cli.js'), '-c', r('tailwind.config.cjs'), '-i', r('dist/.tw-in.css'), '-o', cssOut, '--minify'], { cwd: dir, stdio: 'inherit' });
const css = readFileSync(cssOut, 'utf8');

const local = process.env.LOCAL_REACT === '1';
const reactTags = local
  ? ['react/umd/react.production.min.js', 'react-dom/umd/react-dom.production.min.js']
      .map((f) => `<script>${readFileSync(r(`node_modules/${f}`), 'utf8').replace(/<\/script/gi, '<\\/script')}</script>`).join('\n')
  : [
      '<script src="https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js"></script>',
      '<script src="https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js"></script>',
    ].join('\n');

const html = `<title>Nhà Mình Messenger</title>
<style>:root{color-scheme:light}html,body{height:100%;margin:0;background:#0b4f8f}#root{height:100%}</style>
<style>${css}</style>
<div id="root"></div>
<noscript>Cần bật JavaScript để dùng Nhà Mình Messenger.</noscript>
${reactTags}
<script>${appJs}</script>
`;
const out = process.env.OUT ? path.resolve(process.env.OUT) : r('dist/nha-minh-messenger.html');
writeFileSync(out, html);
console.log(`Đã build ${out} (${(html.length / 1024).toFixed(0)} KB)`);
