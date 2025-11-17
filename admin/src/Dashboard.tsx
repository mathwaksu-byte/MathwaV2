import { Card, CardContent, CardHeader } from '@mui/material';
import { Title } from 'react-admin';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    totalUniversities: 0,
    recentApplications: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/stats/admin/dashboard`);
        setStats(response.data.stats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <Title title="MATHWA Admin Dashboard" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', padding: '1rem' }}>
        <Card>
          <CardHeader title="Total Applications" />
          <CardContent>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1976d2' }}>
              {stats.totalApplications}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Pending Applications" />
          <CardContent>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ed6c02' }}>
              {stats.pendingApplications}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Approved Applications" />
          <CardContent>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2e7d32' }}>
              {stats.approvedApplications}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Partner Universities" />
          <CardContent>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9c27b0' }}>
              {stats.totalUniversities}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Last 7 Days" />
          <CardContent>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0288d1' }}>
              {stats.recentApplications}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>New Applications</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
