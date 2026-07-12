import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function CoordinatorDashboard() {
  const { user, logout } = useAuth();
  const [qrUrl, setQrUrl] = useState('');
  const [memberId, setMemberId] = useState('m1');

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = `${window.location.origin}/member/${memberId}`;
        const dataUrl = await QRCode.toDataURL(url, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });
        setQrUrl(dataUrl);
      } catch (err) {
        console.error(err);
      }
    };
    generateQR();
  }, [memberId]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-lg space-y-6">
        <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-xl font-bold">Welcome, {user?.name}</h1>
            <p className="text-sm text-gray-500">Coordinator, {user?.club_id}</p>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generate Member QR</CardTitle>
            <CardDescription>Members will use this QR for permission scanning.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Member ID</label>
              <Input 
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                placeholder="Enter member ID"
              />
            </div>
            
            <div className="mt-6 flex flex-col items-center space-y-4 rounded-lg border bg-gray-50 p-4">
              {qrUrl ? (
                <>
                  <img src={qrUrl} alt="Member QR Code" className="rounded-lg shadow-sm" />
                  <p className="text-xs font-mono text-gray-500 break-all">{window.location.origin}/member/{memberId}</p>
                  <Button className="w-full" onClick={() => {
                    const a = document.createElement('a');
                    a.href = qrUrl;
                    a.download = `member-${memberId}-qr.png`;
                    a.click();
                  }}>
                    Download QR Code
                  </Button>
                </>
              ) : (
                <div className="h-64 w-64 animate-pulse rounded-lg bg-gray-200"></div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
