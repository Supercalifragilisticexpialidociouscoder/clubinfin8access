import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function MemberVerification() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [member, setMember] = useState<any>(null);
  const [existingPermission, setExistingPermission] = useState<any>(null);
  const [hodName, setHodName] = useState<string>('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [purpose, setPurpose] = useState('');
  const [remark, setRemark] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch these from the backend API
    // For local mock demonstration, we'll simulate the data if backend isn't running
    const fetchDetails = async () => {
      try {
        const memberRes = await fetch(`http://localhost:8787/api/members/${id}`);
        if (memberRes.ok) {
          const m = await memberRes.json();
          setMember(m);
        } else {
          // Mock data for demo purposes if backend isn't up
          setMember({
            id: 'm1',
            name: 'Alice Smith',
            roll_number: '2021CSE101',
            department: 'Computer Science',
            year: 3,
            section: 'A',
            club_name: 'Tech Club',
            position: 'President',
            status: 'active',
            photo_url: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
          });
        }

        const permRes = await fetch(`http://localhost:8787/api/permissions/today/${id}`);
        if (permRes.ok) {
          const data = await permRes.json();
          setExistingPermission(data.permission);
          setHodName(data.hod_name);
        } else {
          // Mock no permission
          setExistingPermission(null);
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleGrant = async (status: 'granted' | 'rejected') => {
    if (!purpose) {
      alert("Purpose is required");
      return;
    }
    setSubmitting(true);
    
    try {
      // Mock API call
      // const res = await fetch('http://localhost:8787/api/permissions', { ... })
      
      // Simulate success
      setTimeout(() => {
        setExistingPermission({
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0],
          purpose,
          remark,
          status,
          hod_id: user?.id
        });
        setHodName(user?.name || 'You');
        setSubmitting(false);
      }, 500);
      
    } catch (err) {
      alert("Failed to submit");
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!member) return <div className="p-8 text-center text-red-500">Member Not Found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-lg space-y-6">
        
        {/* Verification Status Header */}
        <div className="flex flex-col items-center justify-center space-y-2 rounded-xl bg-white p-6 shadow-sm">
          {member.status === 'active' ? (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {member.status === 'active' ? 'Verified Member' : 'Inactive Member'}
          </h1>
        </div>

        {/* Member Details Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              {member.photo_url ? (
                <img src={member.photo_url} alt={member.name} className="h-16 w-16 rounded-full object-cover shadow-sm" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xl font-bold text-gray-500">
                  {member.name.charAt(0)}
                </div>
              )}
              <div>
                <CardTitle>{member.name}</CardTitle>
                <p className="text-sm text-gray-500">{member.roll_number}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-500">Department</p>
              <p>{member.department}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Year / Section</p>
              <p>Year {member.year} - {member.section}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Club</p>
              <p>{member.club_name}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Position</p>
              <p>{member.position}</p>
            </div>
          </CardContent>
        </Card>

        {/* Permission Logic */}
        {existingPermission ? (
          <Card className="border-blue-100 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-blue-700">Permission Already Granted Today</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-blue-900">
              <p><strong>Status:</strong> {existingPermission.status === 'granted' ? '✅ Granted' : '❌ Rejected'}</p>
              <p><strong>Date:</strong> {existingPermission.date} {existingPermission.time}</p>
              <p><strong>Approved By:</strong> {hodName}</p>
              <p><strong>Purpose:</strong> {existingPermission.purpose}</p>
              {existingPermission.remark && <p><strong>Remark:</strong> {existingPermission.remark}</p>}
            </CardContent>
          </Card>
        ) : user?.role === 'hod' ? (
          <Card>
            <CardHeader>
              <CardTitle>Grant Permission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Purpose *</label>
                <Input 
                  placeholder="e.g. Club Meeting, Event Prep" 
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Remark (Optional)</label>
                <Input 
                  placeholder="Additional notes"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex space-x-3">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700" 
                onClick={() => handleGrant('granted')}
                disabled={submitting}
              >
                Approve
              </Button>
              <Button 
                variant="destructive"
                className="w-full" 
                onClick={() => handleGrant('rejected')}
                disabled={submitting}
              >
                Reject
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="rounded-lg bg-yellow-50 p-4 text-center text-sm text-yellow-800">
            Please log in as an HOD to grant permissions.
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>Go to Login</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
