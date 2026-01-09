'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { User, MapPin, Shield, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('profile');

  // Profile form
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    birthDate: '',
  });

  // Address form
  const [addressData, setAddressData] = useState({
    addressZipcode: '',
    addressStreet: '',
    addressNumber: '',
    addressComplement: '',
    addressNeighborhood: '',
    addressCity: '',
    addressState: '',
    searchRadiusKm: 10,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fetchingAddress, setFetchingAddress] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const token = api.getToken();
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);

          setProfileData({
            name: userData.name || '',
            phone: userData.phone || '',
            birthDate: userData.birthDate ? userData.birthDate.split('T')[0] : '',
          });

          setAddressData({
            addressZipcode: userData.addressZipcode || '',
            addressStreet: userData.addressStreet || '',
            addressNumber: userData.addressNumber || '',
            addressComplement: userData.addressComplement || '',
            addressNeighborhood: userData.addressNeighborhood || '',
            addressCity: userData.addressCity || '',
            addressState: userData.addressState || '',
            searchRadiusKm: userData.searchRadiusKm || 10,
          });
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        router.push('/login');
      }
    };

    loadProfile();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = api.getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const updated = await response.json();
        setUser({ ...user, ...updated });
        setSuccess('Perfil atualizado com sucesso!');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao atualizar perfil');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = api.getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/address`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });

      if (response.ok) {
        const updated = await response.json();
        setUser({ ...user, ...updated });
        setSuccess('Endereço atualizado com sucesso! Coordenadas calculadas automaticamente.');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao atualizar endereço');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar endereço');
    } finally {
      setLoading(false);
    }
  };

  const fetchAddressByCep = async () => {
    const cep = addressData.addressZipcode.replace(/\D/g, '');
    if (cep.length !== 8) return;

    setFetchingAddress(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.ok) {
        const data = await response.json();
        if (!data.erro) {
          setAddressData({
            ...addressData,
            addressStreet: data.logradouro || addressData.addressStreet,
            addressNeighborhood: data.bairro || addressData.addressNeighborhood,
            addressCity: data.localidade || addressData.addressCity,
            addressState: data.uf || addressData.addressState,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching address:', err);
    } finally {
      setFetchingAddress(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  const dashboardLink = user.role === 'consumer' ? '/dashboard' : '/supermarket/dashboard';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href={dashboardLink}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Meu Perfil</h1>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <Badge className="mt-1">{user.role === 'consumer' ? 'Consumidor' : 'Supermercado'}</Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            {user.role === 'consumer' && (
              <TabsTrigger value="address" className="gap-2">
                <MapPin className="h-4 w-4" />
                Endereço
              </TabsTrigger>
            )}
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Segurança
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <form onSubmit={handleProfileSubmit}>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>
                    Atualize suas informações pessoais
                  </CardDescription>
                </CardHeader>
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
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(11) 98765-4321"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  {user.role === 'consumer' && (
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Data de Nascimento</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={profileData.birthDate}
                        onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={user.email} disabled className="bg-gray-100" />
                    <p className="text-sm text-gray-500">O email não pode ser alterado</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Address Tab */}
          {user.role === 'consumer' && (
            <TabsContent value="address">
              <Card>
                <form onSubmit={handleAddressSubmit}>
                  <CardHeader>
                    <CardTitle>Endereço</CardTitle>
                    <CardDescription>
                      Atualize seu endereço para comparações precisas
                    </CardDescription>
                  </CardHeader>
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

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cep">CEP</Label>
                        <Input
                          id="cep"
                          type="text"
                          placeholder="12345-678"
                          value={addressData.addressZipcode}
                          onChange={(e) => setAddressData({ ...addressData, addressZipcode: e.target.value })}
                          onBlur={fetchAddressByCep}
                          disabled={loading || fetchingAddress}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="radius">Raio de Busca (km)</Label>
                        <Input
                          id="radius"
                          type="number"
                          min="1"
                          max="50"
                          value={addressData.searchRadiusKm}
                          onChange={(e) => setAddressData({ ...addressData, searchRadiusKm: parseInt(e.target.value) })}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="street">Rua</Label>
                      <Input
                        id="street"
                        type="text"
                        value={addressData.addressStreet}
                        onChange={(e) => setAddressData({ ...addressData, addressStreet: e.target.value })}
                        disabled={loading || fetchingAddress}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="number">Número</Label>
                        <Input
                          id="number"
                          type="text"
                          value={addressData.addressNumber}
                          onChange={(e) => setAddressData({ ...addressData, addressNumber: e.target.value })}
                          disabled={loading}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="complement">Complemento</Label>
                        <Input
                          id="complement"
                          type="text"
                          placeholder="Apto, bloco, etc"
                          value={addressData.addressComplement}
                          onChange={(e) => setAddressData({ ...addressData, addressComplement: e.target.value })}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        type="text"
                        value={addressData.addressNeighborhood}
                        onChange={(e) => setAddressData({ ...addressData, addressNeighborhood: e.target.value })}
                        disabled={loading || fetchingAddress}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          type="text"
                          value={addressData.addressCity}
                          onChange={(e) => setAddressData({ ...addressData, addressCity: e.target.value })}
                          disabled={loading || fetchingAddress}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          type="text"
                          placeholder="SP"
                          maxLength={2}
                          value={addressData.addressState}
                          onChange={(e) => setAddressData({ ...addressData, addressState: e.target.value.toUpperCase() })}
                          disabled={loading || fetchingAddress}
                          required
                        />
                      </div>
                    </div>

                    {user.addressLat && user.addressLng && (
                      <div className="bg-blue-50 p-3 rounded-md text-sm">
                        <p className="text-blue-700">
                          <strong>Coordenadas atuais:</strong> {user.addressLat.toFixed(6)}, {user.addressLng.toFixed(6)}
                        </p>
                        <p className="text-blue-600 text-xs mt-1">
                          As coordenadas serão recalculadas automaticamente ao salvar o endereço
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={loading || fetchingAddress}>
                      {loading ? 'Salvando...' : fetchingAddress ? 'Buscando endereço...' : 'Salvar Endereço'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          )}

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>
                  Gerencie suas configurações de segurança
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Alterar Senha</h4>
                      <p className="text-sm text-gray-500">
                        Atualize sua senha regularmente para maior segurança
                      </p>
                    </div>
                    <Button variant="outline" disabled>
                      Em breve
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Autenticação em Duas Etapas</h4>
                      <p className="text-sm text-gray-500">
                        Adicione uma camada extra de segurança à sua conta
                      </p>
                    </div>
                    <Button variant="outline" disabled>
                      Em breve
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/50">
                    <div>
                      <h4 className="font-medium text-destructive">Excluir Conta</h4>
                      <p className="text-sm text-gray-500">
                        Exclua permanentemente sua conta e todos os seus dados
                      </p>
                    </div>
                    <Button variant="destructive" disabled>
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
