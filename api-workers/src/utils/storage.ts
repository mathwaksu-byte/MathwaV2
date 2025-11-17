// Supabase Storage utilities for file uploads
// Handles uploads to gallery, university_images, and documents buckets

import { createClient } from '@supabase/supabase-js';
import { jsonResponse } from './cors';

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Upload file to Supabase Storage
 * @param file - File data as ArrayBuffer or Blob
 * @param fileName - Name of the file
 * @param bucketName - Storage bucket name (gallery, university_images, documents)
 * @param env - Environment variables
 * @returns Public URL of uploaded file
 */
export async function uploadFile(
  file: ArrayBuffer | Blob,
  fileName: string,
  bucketName: 'gallery' | 'university_images' | 'documents',
  env: any
): Promise<UploadResult | Response> {
  try {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
    
    // Generate unique filename
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}`;
    
    // Upload file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(uniqueFileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      return jsonResponse({ error: error.message }, 500);
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);
    
    return {
      url: urlData.publicUrl,
      path: data.path
    };
  } catch (error) {
    return jsonResponse({ error: 'Failed to upload file' }, 500);
  }
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(
  filePath: string,
  bucketName: 'gallery' | 'university_images' | 'documents',
  env: any
): Promise<boolean | Response> {
  try {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) {
      return jsonResponse({ error: error.message }, 500);
    }
    
    return true;
  } catch (error) {
    return jsonResponse({ error: 'Failed to delete file' }, 500);
  }
}

/**
 * List files in a bucket
 */
export async function listFiles(
  bucketName: 'gallery' | 'university_images' | 'documents',
  env: any,
  folder?: string
) {
  try {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folder);
    
    if (error) {
      return jsonResponse({ error: error.message }, 500);
    }
    
    return data;
  } catch (error) {
    return jsonResponse({ error: 'Failed to list files' }, 500);
  }
}
