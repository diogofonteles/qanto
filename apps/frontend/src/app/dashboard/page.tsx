'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import type { Product, ShoppingList, ComparisonResult } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const tProducts = useTranslations('products');
  const tLists = useTranslations('lists');
  const tComparison = useTranslations('comparison');
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'lists' | 'products' | 'compare'>('lists');

  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [newListName, setNewListName] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const [supermarkets, setSupermarkets] = useState<any[]>([]);
  const [selectedSupermarkets, setSelectedSupermarkets] = useState<string[]>([]);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [recentComparisons, setRecentComparisons] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = api.getStoredUser();
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(storedUser);
    loadLists();
    loadSupermarkets();
    loadRecentComparisons();
  }, []);

  const loadLists = async () => {
    try {
      const data = await api.getMyLists();
      setLists(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loadSupermarkets = async () => {
    try {
      const data = await api.getSupermarkets();
      setSupermarkets(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loadRecentComparisons = async () => {
    try {
      const data = await api.getComparisons(5);
      setRecentComparisons(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    setLoading(true);
    try {
      const newList = await api.createList(newListName);
      setLists([...lists, newList]);
      setNewListName('');
      setSelectedList(newList);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectList = async (list: ShoppingList) => {
    setLoading(true);
    try {
      const fullList = await api.getListById(list.id);
      setSelectedList(fullList);
      setActiveTab('products');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchProducts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await api.getProducts({ search: searchQuery, limit: 20 });
      setProducts(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToList = async () => {
    if (!selectedList || !selectedProduct) return;

    setLoading(true);
    try {
      await api.addItemToList(selectedList.id, selectedProduct.id, quantity);
      const updatedList = await api.getListById(selectedList.id);
      setSelectedList(updatedList);
      setSelectedProduct(null);
      setQuantity(1);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (!selectedList || selectedSupermarkets.length < 2) {
      setError('Please select at least 2 supermarkets to compare');
      return;
    }

    setLoading(true);
    try {
      const result = await api.compareList(selectedList.id, selectedSupermarkets);
      setComparisonResult(result);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">qanto</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <Button variant="outline" onClick={handleLogout}>
              {tCommon('logout')}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'lists' ? 'default' : 'outline'}
            onClick={() => setActiveTab('lists')}
          >
            {t('myLists')}
          </Button>
          <Button
            variant={activeTab === 'products' ? 'default' : 'outline'}
            onClick={() => setActiveTab('products')}
            disabled={!selectedList}
          >
            {t('addProducts')}
          </Button>
          <Button
            variant={activeTab === 'compare' ? 'default' : 'outline'}
            onClick={() => setActiveTab('compare')}
            disabled={!selectedList}
          >
            {t('comparePrices')}
          </Button>
        </div>

        {activeTab === 'lists' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('createNewList')}</CardTitle>
                <CardDescription>{t('createNewListDescription')}</CardDescription>
              </CardHeader>
              <form onSubmit={handleCreateList}>
                <CardContent>
                  <Label htmlFor="listName">{t('listName')}</Label>
                  <Input
                    id="listName"
                    type="text"
                    placeholder={t('listNamePlaceholder')}
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    disabled={loading}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? t('creatingList') : t('createList')}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('myShoppingLists')}</CardTitle>
                <CardDescription>{t('selectListToManage')}</CardDescription>
              </CardHeader>
              <CardContent>
                {lists.length === 0 ? (
                  <p className="text-sm text-gray-500">{t('noListsYet')}</p>
                ) : (
                  <div className="space-y-2">
                    {lists.map((list) => (
                      <div
                        key={list.id}
                        className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                          selectedList?.id === list.id ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => handleSelectList(list)}
                      >
                        <div className="font-medium">{list.name}</div>
                        <div className="text-sm text-gray-500">
                          {list.items?.length || 0} {tLists('items')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'products' && selectedList && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{tProducts('searchProductsTitle')}</CardTitle>
                <CardDescription>{tProducts('findProductsToAdd', { listName: selectedList.name })}</CardDescription>
              </CardHeader>
              <form onSubmit={handleSearchProducts}>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="search">{tProducts('search')}</Label>
                    <Input
                      id="search"
                      type="text"
                      placeholder={tProducts('searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? tProducts('searching') : tProducts('search')}
                  </Button>

                  <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                          selectedProduct?.id === product.id ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          {formatPrice(product.priceCents)}
                          {product.promoPriceCents && (
                            <span className="ml-2 text-green-600">
                              Promo: {formatPrice(product.promoPriceCents)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </form>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{tLists('currentList', { listName: selectedList.name })}</CardTitle>
                <CardDescription>{tLists('itemsInList')}</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedProduct && (
                  <div className="mb-4 p-4 border rounded bg-blue-50">
                    <div className="font-medium mb-2">{tProducts('addToList')}</div>
                    <div className="text-sm mb-2">{selectedProduct.name}</div>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-20"
                      />
                      <Button onClick={handleAddToList} disabled={loading}>
                        {tLists('addProduct')}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {selectedList.items && selectedList.items.length > 0 ? (
                    selectedList.items.map((item: any) => (
                      <div key={item.id} className="p-3 border rounded">
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-sm text-gray-500">
                          {tLists('quantity')}: {item.quantity} × {formatPrice(item.product.priceCents)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">{tLists('noItemsYet')}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'compare' && selectedList && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{tComparison('selectSupermarkets')}</CardTitle>
                <CardDescription>
                  {tComparison('selectSupermarketsDescription', { listName: selectedList.name })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {supermarkets.map((market) => (
                    <div
                      key={market.id}
                      className={`p-4 border rounded cursor-pointer hover:bg-gray-50 ${
                        selectedSupermarkets.includes(market.id)
                          ? 'border-primary bg-primary/5'
                          : ''
                      }`}
                      onClick={() => {
                        if (selectedSupermarkets.includes(market.id)) {
                          setSelectedSupermarkets(
                            selectedSupermarkets.filter((id) => id !== market.id)
                          );
                        } else {
                          setSelectedSupermarkets([...selectedSupermarkets, market.id]);
                        }
                      }}
                    >
                      <div className="font-medium">{market.tradingName || market.companyName}</div>
                      <div className="text-sm text-gray-500">{market.addressCity}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleCompare}
                  disabled={loading || selectedSupermarkets.length < 2}
                >
                  {loading ? tComparison('comparing') : tComparison('compareButton')}
                </Button>
              </CardFooter>
            </Card>

            {comparisonResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Comparison Results</CardTitle>
                  <CardDescription>Best prices for your shopping list</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
                    <div className="text-lg font-bold text-green-800">
                      Cheapest: {comparisonResult.cheapest.supermarketName}
                    </div>
                    <div className="text-2xl font-bold text-green-900">
                      {formatPrice(comparisonResult.cheapest.total)}
                    </div>
                    {comparisonResult.cheapest.savings > 0 && (
                      <div className="text-sm text-green-700">
                        Save {formatPrice(comparisonResult.cheapest.savings)} (
                        {comparisonResult.cheapest.savingsPercentage}%)
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {comparisonResult.results.map((result: any) => (
                      <div key={result.supermarketId} className="border rounded p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-bold">{result.supermarketName}</div>
                            {result.distance && (
                              <div className="text-sm text-gray-500">{result.distance} km away</div>
                            )}
                          </div>
                          <div className="text-xl font-bold">{formatPrice(result.subtotal)}</div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {result.availableCount} available, {result.unavailableCount} unavailable
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
