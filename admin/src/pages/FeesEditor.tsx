import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Typography, Button, Select, MenuItem, TextField } from '@mui/material';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

type Fee = { year: number; tuition: number; hostel: number; misc: number; currency: string };

export default function FeesEditor() {
  const [universities, setUniversities] = useState<Array<{ slug: string; name: string }>>([]);
  const [slug, setSlug] = useState('');
  const [fees, setFees] = useState<Fee[]>([
    { year: 1, tuition: 0, hostel: 0, misc: 0, currency: 'INR' },
    { year: 2, tuition: 0, hostel: 0, misc: 0, currency: 'INR' },
    { year: 3, tuition: 0, hostel: 0, misc: 0, currency: 'INR' },
    { year: 4, tuition: 0, hostel: 0, misc: 0, currency: 'INR' },
    { year: 5, tuition: 0, hostel: 0, misc: 0, currency: 'INR' },
    { year: 6, tuition: 0, hostel: 0, misc: 0, currency: 'INR' }
  ]);
  const [saving, setSaving] = useState(false);
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
    setMessage('');
    axios.get(`${API_URL}/universities/${slug}`).then(r => {
      const loaded: Fee[] = Array.isArray(r.data.fees) ? r.data.fees : [];
      if (loaded.length > 0) {
        loaded.sort((a, b) => a.year - b.year);
        setFees(loaded.map(f => ({ ...f, currency: f.currency || 'INR' })) as Fee[]);
        setMessage('Loaded saved fees');
      }
    }).catch(() => {});
  }, [slug]);

  const updateFee = (idx: number, key: keyof Fee, val: string) => {
    const next = fees.slice();
    if (key === 'currency') (next[idx] as any)[key] = val;
    else (next[idx] as any)[key] = Number(val);
    setFees(next);
  };

  const addYear = () => {
    const year = (fees[fees.length - 1]?.year || 0) + 1;
    const currency = fees[fees.length - 1]?.currency || 'INR';
    setFees([...fees, { year, tuition: 0, hostel: 0, misc: 0, currency }]);
  };

  const deleteYear = async (year: number) => {
    if (!slug) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await axios.delete(`${API_URL}/universities/${slug}/fees`, { data: { year } });
      const loaded: Fee[] = Array.isArray(res.data.fees) ? res.data.fees : [];
      loaded.sort((a, b) => a.year - b.year);
      setFees(loaded.map(f => ({ ...f, currency: f.currency || 'INR' })) as Fee[]);
      setMessage('Deleted year');
    } catch {
      setMessage('Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  const clearAll = async () => {
    if (!slug) return;
    setSaving(true);
    setMessage('');
    try {
      await axios.delete(`${API_URL}/universities/${slug}/fees`, { data: { all: true } });
      setFees([]);
      setMessage('Cleared all fees');
    } catch {
      setMessage('Failed to clear');
    } finally {
      setSaving(false);
    }
  };

  const save = async () => {
    if (!slug) return;
    setSaving(true);
    setMessage('');
    try {
      await axios.post(`${API_URL}/universities/${slug}/fees`, { fees, replace: true });
      setMessage('Fees saved');
    } catch {
      setMessage('Failed to save fees');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700}>University Fees</Typography>
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
      <Box sx={{ mt: 3, overflowX: 'auto' }}>
        <Grid container spacing={1}>
          {fees.map((f, idx) => (
            <Grid item xs={12} key={idx}>
              <Grid container spacing={1} alignItems="center">
                <Grid item><Typography>Year {f.year}</Typography></Grid>
                <Grid item><TextField type="number" value={f.tuition} onChange={e => updateFee(idx, 'tuition', e.target.value)} label="Tuition" size="small" /></Grid>
                <Grid item><TextField type="number" value={f.hostel} onChange={e => updateFee(idx, 'hostel', e.target.value)} label="Hostel" size="small" /></Grid>
                <Grid item><TextField type="number" value={f.misc} onChange={e => updateFee(idx, 'misc', e.target.value)} label="Misc" size="small" /></Grid>
                <Grid item><TextField value={f.currency} onChange={e => updateFee(idx, 'currency', e.target.value)} label="Currency" size="small" /></Grid>
                <Grid item><Button variant="outlined" color="error" onClick={() => deleteYear(f.year)}>Delete</Button></Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Button onClick={addYear} sx={{ mt: 2 }} variant="outlined">Add Year</Button>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Button onClick={save} disabled={saving} variant="contained">{saving ? 'Saving…' : 'Save Fees'}</Button>
        <Button onClick={clearAll} disabled={saving} sx={{ ml: 2 }} variant="contained" color="error">Clear All</Button>
        {message && <Typography sx={{ ml: 2 }} variant="body2">{message}</Typography>}
      </Box>
    </Box>
  );
}
