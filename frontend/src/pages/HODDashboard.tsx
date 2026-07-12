import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';

export default function HODDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const scannerRef = useRef<HTMLDivElement>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    let html5QrcodeScanner: Html5QrcodeScanner;
    
    if (scanning && scannerRef.current) {
      html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
      
      html5QrcodeScanner.render((decodedText) => {
        // Stop scanning after success
        html5QrcodeScanner.clear();
        setScanning(false);
        
        // Ensure it's a URL
        try {
          const url = new URL(decodedText);
          if (url.pathname.startsWith('/member/')) {
            navigate(url.pathname);
          } else {
            alert('Invalid QR code format for ClubPass');
          }
        } catch (e) {
          // Fallback if the QR just has the ID
          navigate(`/member/${decodedText}`);
        }
      }, (error) => {
        // handle scan failure, usually better to ignore and keep scanning
      });
    }

    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(e => console.error(e));
      }
    };
  }, [scanning, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-lg space-y-6">
        <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-xl font-bold">Welcome, {user?.name}</h1>
            <p className="text-sm text-gray-500">HOD, {user?.department} Dept</p>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Scan Member QR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            {scanning ? (
              <div id="reader" ref={scannerRef} className="mx-auto w-full max-w-sm overflow-hidden rounded-lg border"></div>
            ) : (
              <Button onClick={() => setScanning(true)} className="w-full h-32 flex flex-col gap-2">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Tap to Scan QR Code
              </Button>
            )}
            
            {scanning && (
              <Button variant="outline" className="w-full mt-4" onClick={() => setScanning(false)}>
                Cancel Scanning
              </Button>
            )}
            
            <p className="text-xs text-gray-500 mt-4">
              Or for demo purposes, enter a member URL directly.
            </p>
            <Button variant="secondary" className="w-full" onClick={() => navigate('/member/m1')}>
              Demo: Open Mock Member (m1)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
