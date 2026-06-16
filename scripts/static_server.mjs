import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const port = Number(process.argv[2] || 4000);
const root = join(process.cwd(), "_site");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

function resolvePath(url) {
  const cleanPath = decodeURIComponent(new URL(url, `http://127.0.0.1:${port}`).pathname);
  const requested = normalize(join(root, cleanPath));
  if (!requested.startsWith(root)) return null;
  if (existsSync(requested) && statSync(requested).isDirectory()) {
    return join(requested, "index.html");
  }
  return requested;
}

createServer((request, response) => {
  const filePath = resolvePath(request.url || "/");
  if (!filePath || !existsSync(filePath) || statSync(filePath).isDirectory()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, { "content-type": types[extname(filePath)] || "application/octet-stream" });
  createReadStream(filePath).pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`Career Builder Lab preview: http://127.0.0.1:${port}/`);
});
