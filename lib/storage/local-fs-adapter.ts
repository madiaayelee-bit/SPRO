import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import type { StorageAdapter } from "./adapter";

const ROOT = path.join(process.cwd(), "uploads");

function resolveSafe(key: string) {
  const full = path.join(ROOT, key);
  if (!full.startsWith(ROOT)) {
    throw new Error("Chemin de fichier invalide");
  }
  return full;
}

export class LocalFsStorageAdapter implements StorageAdapter {
  async save(buffer: Buffer, key: string) {
    const full = resolveSafe(key);
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, buffer);
    return key;
  }

  async read(key: string) {
    return readFile(resolveSafe(key));
  }

  async delete(key: string) {
    await unlink(resolveSafe(key));
  }
}

export const storage: StorageAdapter = new LocalFsStorageAdapter();
