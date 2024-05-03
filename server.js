import fs from 'node:fs/promises'
import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
import chokidar from 'chokidar';

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''
const ssrManifest = isProduction
  ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
  : undefined

// Create http server
const app = express()

// Add Vite or respective production middlewares
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    let template
    let render
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    const rendered = await render(url, ssrManifest)

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})

const maulapp = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');
const distDir = path.join(__dirname, 'dist', 'uploads');

// Ensure the destination directory exists
async function ensureDir(dirPath) {
  try {
    await fs.access(dirPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`Directory ${dirPath} was created.`);
    } else {
      throw error;
    }
  }
}

// Set up file watcher
chokidar.watch(uploadsDir).on('add', async (filePath) => {
  console.log(`File ${filePath} has been added`);
  const relativePath = path.relative(uploadsDir, filePath);
  const destPath = isProduction ? path.join(productionUploadsDir, relativePath) : filePath;
  if (isProduction) {
    await ensureDir(path.dirname(destPath));
    fs.copyFile(filePath, destPath)
      .then(() => console.log(`Copied ${filePath} to ${destPath}`))
      .catch((_err) => console.error(`Error copying file ${filePath} to ${destPath}: ${_err}`));
  }
});

// API endpoint to list .obj files with their corresponding .mtl files
maulapp.get('/api/models', async (_req, res) => {
  try {
    // Ensure that we're reading from the correct directory based on whether the app is in production mode
    const targetDir = isProduction ? distDir : uploadsDir;
    const files = await fs.readdir(targetDir);
    const models = files.filter(file => file.endsWith('.obj')).map(objFile => {
      const baseName = objFile.replace('.obj', '');
      const mtlFile = files.find(file => file === `${baseName}.mtl`);
      return { objFile, mtlFile: mtlFile || null }; // Include null if .mtl file is missing
    });

    res.json(models);
  } catch (error) {
    console.error('Error reading directory:', error);
    res.status(500).send('Server error while reading files');
  }
});
