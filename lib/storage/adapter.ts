export interface StorageAdapter {
  /** Enregistre un fichier sous la clé donnée et renvoie la clé effective. */
  save(buffer: Buffer, key: string): Promise<string>;
  read(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
}
