// utils/supabaseStorage.ts
import * as FileSystem from 'expo-file-system';
import supabase from './supabase';

const BUCKET = 'files';

/**
 * Convierte una uri local (expo) a un Blob usable por supabase-js en React Native.
 * @param uri local file uri
 */
async function uriToBlob(uri: string): Promise<Blob> {
  // expo env: fetch can read file URIs
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
}

/**
 * Sube una imagen a Supabase Storage y devuelve la ruta (path) dentro del bucket.
 * @param localUri uri local (file://)
 * @param destPath ruta de destino dentro del bucket (ej: products/123-foto.jpg)
 */
export async function uploadImageToSupabase(localUri: string, destPath: string) {
  try {
    const blob = await uriToBlob(localUri);

    // Supabase JS SDK upload usa File | Blob para RN
    const { error, data } = await supabase.storage.from(BUCKET).upload(destPath, blob, {
      cacheControl: '3600',
      upsert: true,
      contentType: blob.type || 'image/jpeg',
    });

    if (error) throw error;
    return data?.path || destPath;
  } catch (err) {
    throw err;
  }
}

/**
 * Obtiene la URL pública de un path almacenado en el bucket
 * Si tu bucket está privado, usa createSignedUrl en su lugar.
 */
export function getPublicUrl(path: string) {
  if (!path) return null;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Borra un archivo del bucket
 */
export async function removeFile(path: string) {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
  return true;
}
