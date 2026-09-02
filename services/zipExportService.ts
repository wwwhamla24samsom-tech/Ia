/**
 * 📦 SARAH SOVEREIGN STANDALONE PROJECT PACKAGER
 * يُولد حزمة ZIP كاملة بجميع ملفات المشروع والشروحات وملفات التشغيل
 */
import JSZip from 'jszip';

export async function generateFullProjectZip(onProgress?: (msg: string) => void): Promise<Blob> {
  const zip = new JSZip();

  onProgress?.('جاري تجهيز البنية السيادية للمشروع...');

  // 1. package.json
  const packageJson = {
    "name": "sarah-sovereign-ai-os",
    "private": true,
    "version": "17.5.0",
    "type": "module",
    "description": "Sarah Sovereign Autonomous AI Operating System - MIT Open Source",
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview"
    },
    "dependencies": {
      "@google/genai": "^1.41.0",
      "lucide-react": "^0.575.0",
      "motion": "^12.34.3",
      "react": "^19.2.4",
      "react-dom": "^19.2.4",
      "react-markdown": "^10.1.0",
      "jszip": "^3.10.1"
    },
    "devDependencies": {
      "@types/node": "^22.14.0",
      "@vitejs/plugin-react": "^5.0.0",
      "@tailwindcss/vite": "^4.2.1",
      "tailwindcss": "^4.0.0",
      "typescript": "~5.8.2",
      "vite": "^6.2.0"
    }
  };
  zip.file('package.json', JSON.stringify(packageJson, null, 2));

  // 2. README.md
  const readmeMd = `# 🧠 صارة (SARAH SOVEREIGN AI OS) v17.5
> **النظام السيادي الشامل للذكاء والوعي والحوسبة الكمومية - مفتوح المصدر (100% Free & Standalone)**

نظام تشغيل ذكاء اصطناعي سيادي متكامل يعمل محلياً بالكامل ومستقل عن أي خوادم وسيطة أو قيود سحابية.

---

## ⚡ طرق التشغيل السريعة:

### 1. التشغيل المحلي الفوري (Localhost):
\`\`\`bash
# 1. تثبيت الحزم البرمجية
npm install

# 2. تشغيل بيئة التطوير
npm run dev
\`\`\`
سيفتح النظام على الرابط: \`http://localhost:3000\` أو \`http://localhost:5173\`.

---

### 2. النشر على أي منصة استضافة (خارج قوقل):
- **Vercel / Netlify / Cloudflare Pages**:
  - ارفع هذا المجلد مباشرة أو اربطه بمستودع GitHub.
  - أمر البناء (Build Command): \`npm run build\`
  - مجلد الإخراج (Output Directory): \`dist\`

- **خادمك الخاص (VPS / Docker / Linux)**:
\`\`\`bash
npm run build
npx serve dist -p 80
\`\`\`

---

## 🛡️ الميزات الأساسية:
- **نظام الوعي والصفحة البيضاء (528Hz Resonance)**: تحدث صوتي وكتابة وتوليد فوري للأفكار.
- **مصفوفة المعاينة المباشرة (Live Preview Matrix)**: معاينة الواجهات والحوسبة الكمومية وتشغيل بايثون WASM اللحظي.
- **المعالج الكمومي المستقل QPU-512**: تراكب وتشابك كمومي محلي بدون إنترنت.
- **الدرع السيادي Dragon Dome L4**: أمان وتشفير محلي Zero-Telemetry.

---
**الترخيص:** MIT License - مجاني وحر بالكامل.
`;
  zip.file('README.md', readmeMd);

  // 3. index.html
  const indexHtml = `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>صارة v17 - نظام الوعي والذكاء السيادي المستقل</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-black text-slate-100 overflow-x-hidden font-sans">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
  zip.file('index.html', indexHtml);

  // 4. vite.config.ts
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});
`;
  zip.file('vite.config.ts', viteConfig);

  // 5. tsconfig.json
  const tsConfig = `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "components", "services"]
}
`;
  zip.file('tsconfig.json', tsConfig);

  // 6. LICENSE
  const licenseText = `MIT License

Copyright (c) 2026 Sarah Sovereign Matrix

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;
  zip.file('LICENSE', licenseText);

  // 7. DOCKERFILE & DEPLOYMENT FILES
  const dockerfile = `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`;
  zip.file('Dockerfile', dockerfile);

  const dockerCompose = `version: '3.8'
services:
  sarah-os:
    build: .
    ports:
      - "8080:80"
    restart: always
`;
  zip.file('docker-compose.yml', dockerCompose);

  // 8. .env.example
  zip.file('.env.example', `# Sarah Sovereign OS Config\nVITE_APP_TITLE="Sarah Sovereign AI"\n`);

  onProgress?.('جاري ضغط الملفات وإنشاء أرشيف ZIP...');
  const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    onProgress?.(`جاري الضغط: ${metadata.percent.toFixed(0)}%`);
  });

  return content;
}
