// Upload routes for files and images

import { Router } from 'itty-router';
import { jsonResponse } from '../utils/cors';
import { requireAdmin } from '../utils/auth';
import { uploadFile, deleteFile } from '../utils/storage';

export function uploadRoutes(router: Router) {
  // Upload image (admin only)
  router.post('/api/upload', async (request: any) => {
    const authResult = await requireAdmin(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const contentType = request.headers.get('content-type') || '';
      
      if (!contentType.includes('multipart/form-data')) {
        return jsonResponse({ error: 'Content-Type must be multipart/form-data' }, 400);
      }

      const formData = await request.formData();
      const file = formData.get('file');
      const bucket = formData.get('bucket') || 'gallery';

      if (!file) {
        return jsonResponse({ error: 'No file provided' }, 400);
      }

      // Validate bucket name
      const validBuckets = ['gallery', 'university_images', 'documents'];
      if (!validBuckets.includes(bucket as string)) {
        return jsonResponse({ error: 'Invalid bucket name' }, 400);
      }

      // Upload file
      const result = await uploadFile(
        await (file as File).arrayBuffer(),
        (file as File).name,
        bucket as 'gallery' | 'university_images' | 'documents',
        request.env
      );

      if (result instanceof Response) {
        return result;
      }

      return jsonResponse({ 
        success: true,
        url: result.url,
        path: result.path
      }, 201);
    } catch (error) {
      return jsonResponse({ error: 'Failed to upload file' }, 500);
    }
  });

  // Delete file (admin only)
  router.delete('/api/upload/:bucket/:path', async (request: any) => {
    const authResult = await requireAdmin(request, request.env);
    if (authResult instanceof Response) return authResult;

    try {
      const { bucket, path } = request.params;

      // Validate bucket name
      const validBuckets = ['gallery', 'university_images', 'documents'];
      if (!validBuckets.includes(bucket)) {
        return jsonResponse({ error: 'Invalid bucket name' }, 400);
      }

      const result = await deleteFile(
        path,
        bucket as 'gallery' | 'university_images' | 'documents',
        request.env
      );

      if (result instanceof Response) {
        return result;
      }

      return jsonResponse({ 
        success: true,
        message: 'File deleted successfully'
      });
    } catch (error) {
      return jsonResponse({ error: 'Failed to delete file' }, 500);
    }
  });
}
