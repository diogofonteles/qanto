'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, TrendingUp, Tag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  promoPriceCents: number | null;
  imageUrl: string | null;
  isFeatured: boolean;
  category?: {
    name: string;
  };
  supermarket: {
    tradingName: string;
  };
}

export default function HomePage() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [promoProducts, setPromoProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featuredRes, promoRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?featured=true&limit=6`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?onPromotion=true&limit=6`),
        ]);

        if (featuredRes.ok) {
          const featuredData = await featuredRes.json();
          setFeaturedProducts(featuredData.items || []);
        }

        if (promoRes.ok) {
          const promoData = await promoRes.json();
          setPromoProducts(promoData.items || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const calculateDiscount = (regular: number, promo: number) => {
    return Math.round(((regular - promo) / regular) * 100);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{tCommon('appName')}</h1>
          <p className="text-xl md:text-2xl mb-4 text-blue-100">
            {t('title')}
          </p>
          <p className="text-lg mb-8 text-blue-200 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="gap-2">
                <ShoppingCart className="h-5 w-5" />
                {t('registerConsumerButton')}
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700">
                {t('loginButton')}
              </Button>
            </Link>
          </div>

          <div className="mt-6 text-sm text-blue-200">
            {t('supermarketQuestion')}{' '}
            <Link href="/register/supermarket" className="text-white hover:underline font-medium">
              {t('registerSupermarketLink')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <ShoppingCart className="h-12 w-12 text-blue-600 mb-2" />
                <h3 className="text-xl font-semibold">Compare Preços</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Compare os preços da sua lista de compras em diversos supermercados da região.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-green-600 mb-2" />
                <h3 className="text-xl font-semibold">Economize Mais</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Descubra onde fazer suas compras e economize até 30% no total.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Tag className="h-12 w-12 text-orange-600 mb-2" />
                <h3 className="text-xl font-semibold">Promoções</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Veja as melhores promoções e produtos em destaque dos supermercados.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <Star className="h-8 w-8 text-yellow-500" />
            <h2 className="text-3xl font-bold">Produtos em Destaque</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  {product.imageUrl && (
                    <div className="relative h-48 bg-gray-100 rounded-md mb-4">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <Badge className="absolute top-2 right-2 bg-yellow-500">
                        <Star className="h-3 w-3 mr-1" />
                        Destaque
                      </Badge>
                    </div>
                  )}
                  <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.supermarket.tradingName}</p>
                </CardHeader>
                <CardContent>
                  {product.category && (
                    <Badge variant="outline" className="mb-2">{product.category.name}</Badge>
                  )}
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div>
                    {product.promoPriceCents ? (
                      <>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.priceCents)}
                        </span>
                        <p className="text-2xl font-bold text-green-600">
                          {formatPrice(product.promoPriceCents)}
                        </p>
                      </>
                    ) : (
                      <p className="text-2xl font-bold text-blue-600">
                        {formatPrice(product.priceCents)}
                      </p>
                    )}
                  </div>
                  <Link href="/register">
                    <Button size="sm">Ver mais</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Promotional Products */}
      {promoProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <Tag className="h-8 w-8 text-red-500" />
              <h2 className="text-3xl font-bold">Ofertas Imperdíveis</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promoProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    {product.imageUrl && (
                      <div className="relative h-48 bg-gray-100 rounded-md mb-4">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                        {product.promoPriceCents && (
                          <Badge className="absolute top-2 right-2 bg-red-500">
                            -{calculateDiscount(product.priceCents, product.promoPriceCents)}%
                          </Badge>
                        )}
                      </div>
                    )}
                    <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.supermarket.tradingName}</p>
                  </CardHeader>
                  <CardContent>
                    {product.category && (
                      <Badge variant="outline" className="mb-2">{product.category.name}</Badge>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.priceCents)}
                      </span>
                      <p className="text-2xl font-bold text-red-600">
                        {product.promoPriceCents && formatPrice(product.promoPriceCents)}
                      </p>
                    </div>
                    <Link href="/register">
                      <Button size="sm" variant="destructive">Ver oferta</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Loading State */}
      {loading && (
        <section className="py-16 container mx-auto px-4">
          <div className="text-center text-gray-500">
            <p>Carregando produtos...</p>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para economizar?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Cadastre-se gratuitamente e comece a comparar preços agora mesmo!
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="gap-2">
              <ShoppingCart className="h-5 w-5" />
              Criar Conta Grátis
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
