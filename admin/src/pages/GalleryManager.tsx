import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Typography, Button, Select, MenuItem, ImageList, ImageListItem, ImageListItemBar, Divider } from '@mui/material';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function GalleryManager() {
  const [universities, setUniversities] = useState<Array<{ slug: string; name: string }>>([]);
  const [slug, setSlug] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [preview, setPreview] = useState<string[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/universities`).then(r => {
      const list = (r.data.universities || []) as any[];
      const options = list.map(u => ({ slug: u.slug, name: u.name }));
      setUniversities(options);
      if (options.length > 0) setSlug(options[0].slug);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!slug) return;
    axios.get(`${API_URL}/universities/${slug}`).then(r => {
      const u = r.data.university || {};
      const urls = Array.isArray(u.gallery_urls) ? u.gallery_urls : [];
      setPreview(urls);
      setSelected({});
    }).catch(() => {});
  }, [slug]);

  const upload = async () => {
    if (!slug || !files || files.length === 0) return;
    setUploading(true);
    setMessage('');
    try {
      const fd = new FormData();
      Array.from(files).forEach(f => fd.append('images', f));
      const res = await axios.post(`${API_URL}/admin/universities/${slug}/gallery`, fd);
      const u = res.data.university || {};
      const urls = Array.isArray(u.gallery) ? u.gallery.map((g: any) => g.url).filter(Boolean) : [];
      setPreview(urls);
      setMessage('Gallery updated');
      setFiles(null);
    } catch {
      setMessage('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const toggle = (url: string) => setSelected(s => ({ ...s, [url]: !s[url] }));

  const removeSelected = async () => {
    const urls = Object.keys(selected).filter(u => selected[u]);
    if (urls.length === 0) return;
    setUploading(true);
    setMessage('');
    try {
      const res = await axios.delete(`${API_URL}/admin/universities/${slug}/gallery`, { data: { urls } });
      const u = res.data.university || {};
      const next = Array.isArray(u.gallery) ? u.gallery.map((g: any) => g.url).filter(Boolean) : [];
      setPreview(next);
      setSelected({});
      setMessage('Removed selected images');
    } catch {
      setMessage('Delete failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700}>University Gallery</Typography>
      <Grid container spacing={2} sx={{ mt: 2 }} alignItems="center">
        <Grid item>
          <Typography component="label">University</Typography>
        </Grid>
        <Grid item>
          <Select value={slug} onChange={e => setSlug(String(e.target.value))} size="small" sx={{ minWidth: 260 }}>
            {universities.map(u => (<MenuItem key={u.slug} value={u.slug}>{u.name}</MenuItem>))}
          </Select>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={e => setFiles(e.target.files)} />
        </Grid>
        <Grid item>
          <Button onClick={upload} disabled={uploading} variant="contained">{uploading ? 'Uploading…' : 'Upload Images'}</Button>
        </Grid>
        <Grid item>
          <Button onClick={() => setSelected(Object.fromEntries(preview.map(u => [u, true])))} variant="outlined">Select All</Button>
        </Grid>
        <Grid item>
          <Button onClick={() => setSelected({})} variant="outlined">Clear Selection</Button>
        </Grid>
        <Grid item>
          <Button onClick={removeSelected} disabled={uploading} variant="contained" color="error">Delete Selected</Button>
        </Grid>
        {message && (
          <Grid item>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>{message}</Typography>
          </Grid>
        )}
      </Grid>
      <Box sx={{ mt: 3, maxHeight: 480, overflowY: 'auto' }}>
        <ImageList variant="masonry" cols={3} gap={12}>
          {preview.map((u) => (
            <ImageListItem key={u} onClick={() => toggle(u)} style={{ cursor: 'pointer' }}>
              <Box sx={{ borderRadius: 2, overflow: 'hidden', outline: selected[u] ? '2px solid #ef4444' : 'none' }}>
                <Box sx={{ aspectRatio: '4 / 3', bgcolor: 'grey.100' }}>
                  <img src={u} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              </Box>
              <ImageListItemBar position="below" title={<Typography variant="caption">Gallery</Typography>} />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </Box>
  );
}
