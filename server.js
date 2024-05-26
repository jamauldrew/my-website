import fs from 'node:fs/promises';
import express from 'express';
import chokidar from 'chokidar';
import path from 'path';
import fsExtra from 'fs-extra';

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : '';
const ssrManifest = isProduction
  ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
  : undefined;

// Create http server
const app = express();

// Add Vite or respective production middlewares
let vite;
if (!isProduction) {
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;
  app.use(compression());
  app.use(base, sirv('./dist/client', { extensions: [] }));
}

// Setup file watcher for development mode
const srcDir = './uploads';
const destDir = './dist/client/uploads';
// Function to copy files
    const copyFile = async (srcPath, destPath) => {
      try {
        await fsExtra.ensureDir(path.dirname(destPath)); // Ensure the directory exists
        const data = await fs.readFile(srcPath);
        await fs.writeFile(destPath, data);
        console.log(`File copied to ${destPath}`);
      } catch (err) {
        console.error('Error copying file:', err);
      }
    };

    if (isProduction) {
      try {
        await fsExtra.copy(srcDir, destDir, { overwrite: true });
        console.log('All uploads have been copied to dist/client/uploads');
      } catch (err) {
        console.error('Error copying uploads:', err);
      }
    }
else {
  // Development: Watch for new or changed files and copy them individually
  const watcher = chokidar.watch(srcDir, { persistent: true });
  watcher.on('add', async (filePath) => {
    console.log(`File ${filePath} has been added.`);
    const destPath = path.join(destDir, path.basename(filePath));
    await copyFile(filePath, destPath);
  }).on('change', async (filePath) => {
    console.log(`File ${filePath} has been changed.`);
    const destPath = path.join(destDir, path.basename(filePath));
    await copyFile(filePath, destPath);
  });
}

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '');

    let template;
    let render;
    if (!isProduction) {
      template = await fs.readFile('./index.html', 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render;
    } else {
      template = templateHtml;
      render = (await import('./dist/server/entry-server.js')).render;
    }

    const rendered = await render(url, ssrManifest);

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '');

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

// Example API endpoint
app.get('/api/data', async (_req, res) => {
  // Example response for demonstrating API setup
  res.json({ message: 'This is your API response' });
});

// Serve files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
