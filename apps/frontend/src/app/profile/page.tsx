'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const storedUser = api.getStoredUser();
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(storedUser);
    setFormData({
      name: storedUser.name || '',
      phone: storedUser.phone || '',
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const updated = await api.updateProfile(formData);
      setUser(updated);
      setSuccess('Profile updated successfully!');

      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updated));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">qanto</h1>
          <div className="flex items-center gap-4">
            <Link href={user.role === 'consumer' ? '/dashboard' : '/supermarket/dashboard'}>
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>View and edit your profile information</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md">
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={user.email} disabled className="bg-gray-100" />
                <p className="text-sm text-gray-500">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Input type="text" value={user.role} disabled className="bg-gray-100" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={loading}
                  required
                />
              </div>

              {user.role === 'consumer' && user.addressCity && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-2">Address</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{user.addressStreet}, {user.addressNumber}</p>
                    {user.addressComplement && <p>{user.addressComplement}</p>}
                    <p>{user.addressNeighborhood}</p>
                    <p>{user.addressCity}, {user.addressState} - {user.addressZipCode}</p>
                  </div>
                </div>
              )}

              {user.role === 'supermarket' && user.companyName && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-2">Company Information</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Company Name:</strong> {user.companyName}</p>
                    {user.tradingName && <p><strong>Trading Name:</strong> {user.tradingName}</p>}
                    {user.cnpj && <p><strong>CNPJ:</strong> {user.cnpj}</p>}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
