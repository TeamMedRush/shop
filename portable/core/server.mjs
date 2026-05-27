import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { access } from 'node:fs/promises';

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.ttf': 'font/ttf',
};

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function startServer(distDir, port, isDev = false) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    let filePath = join(distDir, url.pathname === '/' ? 'index.html' : url.pathname);
    
    if (!(await fileExists(filePath))) {
      filePath = join(distDir, 'index.html');
    }

    const content = await readFile(filePath);
    const ext = extname(filePath);
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] ?? 'application/octet-stream',
      'Cache-Control': isDev ? 'no-cache' : 'public, max-age=600'
    });
    res.end(content);
  });

  return new Promise((resolve) => {
    server.listen(port, () => {
      resolve(server);
    });
  });
}
