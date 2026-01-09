'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCEP } from '@/lib/utils';

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations('auth.register');
  const tCommon = useTranslations('common');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    addressZipCode: '',
    addressStreet: '',
    addressNumber: '',
    addressComplement: '',
    addressNeighborhood: '',
    addressCity: '',
    addressState: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  const handleCepBlur = async () => {
    const cep = formData.addressZipCode.replace(/\D/g, '');
    if (cep.length !== 8) return;

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setError('CEP not found');
        return;
      }

      setFormData({
        ...formData,
        addressStreet: data.logradouro || '',
        addressNeighborhood: data.bairro || '',
        addressCity: data.localidade || '',
        addressState: data.uf || '',
      });
      setError('');
    } catch (err) {
      setError('Failed to fetch address');
    } finally {
      setLoadingCep(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.register(formData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{tCommon('appName')}</CardTitle>
          <CardDescription className="text-center">
            {t('title')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">{t('fullName')}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t('fullNamePlaceholder')}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('phone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t('phonePlaceholder')}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('passwordPlaceholder')}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                  minLength={8}
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-4">{t('address')}</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">{t('zipCode')}</Label>
                  <Input
                    id="zipCode"
                    type="text"
                    placeholder={t('zipCodePlaceholder')}
                    value={formatCEP(formData.addressZipCode)}
                    onChange={(e) => setFormData({ ...formData, addressZipCode: e.target.value })}
                    onBlur={handleCepBlur}
                    required
                    disabled={loading || loadingCep}
                    maxLength={9}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="street">{t('street')}</Label>
                  <Input
                    id="street"
                    type="text"
                    placeholder={t('streetPlaceholder')}
                    value={formData.addressStreet}
                    onChange={(e) => setFormData({ ...formData, addressStreet: e.target.value })}
                    required
                    disabled={loading || loadingCep}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number">{t('number')}</Label>
                  <Input
                    id="number"
                    type="text"
                    placeholder={t('numberPlaceholder')}
                    value={formData.addressNumber}
                    onChange={(e) => setFormData({ ...formData, addressNumber: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="complement">{t('complement')}</Label>
                  <Input
                    id="complement"
                    type="text"
                    placeholder={t('complementPlaceholder')}
                    value={formData.addressComplement}
                    onChange={(e) => setFormData({ ...formData, addressComplement: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood">{t('neighborhood')}</Label>
                  <Input
                    id="neighborhood"
                    type="text"
                    placeholder={t('neighborhoodPlaceholder')}
                    value={formData.addressNeighborhood}
                    onChange={(e) => setFormData({ ...formData, addressNeighborhood: e.target.value })}
                    required
                    disabled={loading || loadingCep}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">{t('city')}</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder={t('cityPlaceholder')}
                    value={formData.addressCity}
                    onChange={(e) => setFormData({ ...formData, addressCity: e.target.value })}
                    required
                    disabled={loading || loadingCep}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">{t('state')}</Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder={t('statePlaceholder')}
                    value={formData.addressState}
                    onChange={(e) => setFormData({ ...formData, addressState: e.target.value })}
                    required
                    disabled={loading || loadingCep}
                    maxLength={2}
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading || loadingCep}>
              {loading ? t('creatingAccount') : t('createAccountButton')}
            </Button>

            <div className="text-sm text-center text-muted-foreground">
              {t('alreadyHaveAccount')}{' '}
              <Link href="/login" className="text-primary hover:underline">
                {t('loginLink')}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
