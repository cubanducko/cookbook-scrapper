import path from "path";
import { fileURLToPath } from "url";

export function getDirname() {
  const __filename = fileURLToPath(import.meta.url);
  return path.dirname(__filename);
}
