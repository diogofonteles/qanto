'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold mb-6 text-primary">{tCommon('appName')}</h1>
        <p className="text-2xl text-gray-700 mb-8">
          {t('title')}
        </p>
        <p className="text-lg text-gray-600 mb-12">
          {t('subtitle')}
        </p>

        <div className="flex gap-4 justify-center mb-8">
          <Link href="/login">
            <Button size="lg">{t('loginButton')}</Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline">
              {t('registerConsumerButton')}
            </Button>
          </Link>
        </div>

        <div className="text-sm text-gray-500">
          {t('supermarketQuestion')}{' '}
          <Link href="/register/supermarket" className="text-primary hover:underline font-medium">
            {t('registerSupermarketLink')}
          </Link>
        </div>
      </div>
    </main>
  );
}
