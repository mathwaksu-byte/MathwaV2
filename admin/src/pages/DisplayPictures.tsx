import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Typography, Button, Card, CardHeader, CardContent, Select, MenuItem } from '@mui/material';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function DisplayPictures() {
  const [universities, setUniversities] = useState<Array<{ slug: string; name: string }>>([]);
  const [slug, setSlug] = useState('');
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<{ hero?: string; logo?: string }>({});
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [messageHero, setMessageHero] = useState('');
  const [messageLogo, setMessageLogo] = useState('');

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
      setPreview({ hero: u.hero_image_url, logo: u.logo_url });
    }).catch(() => {});
  }, [slug]);

  const uploadHero = async () => {
    if (!slug || !heroFile) return;
    setUploadingHero(true);
    setMessageHero('');
    try {
      const fd = new FormData();
      fd.append('file', heroFile);
      const res = await axios.post(`${API_URL}/admin/universities/${slug}/dp?type=hero`, fd);
      const u = res.data.university || {};
      setPreview({ hero: u.hero_image_url, logo: u.logo_url });
      setMessageHero('Hero updated');
      setHeroFile(null);
    } catch {
      setMessageHero('Upload failed');
    } finally {
      setUploadingHero(false);
    }
  };

  const uploadLogo = async () => {
    if (!slug || !logoFile) return;
    setUploadingLogo(true);
    setMessageLogo('');
    try {
      const fd = new FormData();
      fd.append('file', logoFile);
      const res = await axios.post(`${API_URL}/admin/universities/${slug}/dp?type=logo`, fd);
      const u = res.data.university || {};
      setPreview({ hero: u.hero_image_url, logo: u.logo_url });
      setMessageLogo('Logo updated');
      setLogoFile(null);
    } catch {
      setMessageLogo('Upload failed');
    } finally {
      setUploadingLogo(false);
    }
  };

  const clearHero = async () => {
    if (!slug) return;
    setUploadingHero(true);
    setMessageHero('');
    try {
      const res = await axios.delete(`${API_URL}/admin/universities/${slug}/dp?type=hero`);
      const u = res.data.university || {};
      setPreview({ hero: u.hero_image_url, logo: u.logo_url });
      setMessageHero('Cleared');
    } catch {
      setMessageHero('Clear failed');
    } finally {
      setUploadingHero(false);
    }
  };

  const clearLogo = async () => {
    if (!slug) return;
    setUploadingLogo(true);
    setMessageLogo('');
    try {
      const res = await axios.delete(`${API_URL}/admin/universities/${slug}/dp?type=logo`);
      const u = res.data.university || {};
      setPreview({ hero: u.hero_image_url, logo: u.logo_url });
      setMessageLogo('Cleared');
    } catch {
      setMessageLogo('Clear failed');
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700}>University Display Pictures</Typography>
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
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Hero Image" />
            <CardContent>
              <Box sx={{ aspectRatio: '16 / 9', borderRadius: 2, overflow: 'hidden', bgcolor: 'grey.100' }}>
                {preview.hero && <img src={preview.hero} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => setHeroFile(e.target.files?.[0] || null)} />
                <Button onClick={uploadHero} disabled={uploadingHero} variant="contained">{uploadingHero ? 'Uploading…' : 'Upload'}</Button>
                <Button onClick={clearHero} disabled={uploadingHero} variant="contained" color="error">Clear</Button>
                {messageHero && <Typography variant="body2" sx={{ opacity: 0.8 }}>{messageHero}</Typography>}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Logo" />
            <CardContent>
              <Box sx={{ aspectRatio: '1 / 1', borderRadius: 2, overflow: 'hidden', bgcolor: 'grey.100' }}>
                {preview.logo && <img src={preview.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />}
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => setLogoFile(e.target.files?.[0] || null)} />
                <Button onClick={uploadLogo} disabled={uploadingLogo} variant="contained">{uploadingLogo ? 'Uploading…' : 'Upload'}</Button>
                <Button onClick={clearLogo} disabled={uploadingLogo} variant="contained" color="error">Clear</Button>
                {messageLogo && <Typography variant="body2" sx={{ opacity: 0.8 }}>{messageLogo}</Typography>}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
