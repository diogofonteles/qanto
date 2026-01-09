'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CsvUpload } from '@/components/csv-upload';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

export default function SupermarketDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    barcode: '',
    priceCents: '',
    promoPriceCents: '',
    categoryId: '',
    stock: '',
    unit: 'un',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = api.getStoredUser();
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(storedUser);
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await api.getProducts({ limit: 100 });
      setProducts(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productData = {
        ...formData,
        priceCents: parseInt(formData.priceCents),
        promoPriceCents: formData.promoPriceCents ? parseInt(formData.promoPriceCents) : undefined,
        stock: parseInt(formData.stock),
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productData);
      } else {
        await api.createProduct(productData);
      }

      resetForm();
      loadProducts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      brand: product.brand || '',
      barcode: product.barcode || '',
      priceCents: product.priceCents.toString(),
      promoPriceCents: product.promoPriceCents?.toString() || '',
      categoryId: product.categoryId,
      stock: product.stock?.toString() || '0',
      unit: product.unit || 'un',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setLoading(true);
    try {
      await api.deleteProduct(id);
      loadProducts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      brand: '',
      barcode: '',
      priceCents: '',
      promoPriceCents: '',
      categoryId: '',
      stock: '',
      unit: 'un',
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleLogout = () => {
    api.logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">qanto - Supermarket Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
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

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Button onClick={() => setShowForm(!showForm)} className="w-full">
              {showForm ? 'Cancel' : 'Add New Product'}
            </Button>
          </div>
          <CsvUpload />
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
              <CardDescription>Fill in the product details</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode (EAN-13)</Label>
                    <Input
                      id="barcode"
                      type="text"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      disabled={loading}
                      maxLength={13}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      className="w-full border rounded-md px-3 py-2"
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      required
                      disabled={loading}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (in cents) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.priceCents}
                      onChange={(e) => setFormData({ ...formData, priceCents: e.target.value })}
                      required
                      disabled={loading}
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="promoPrice">Promo Price (in cents)</Label>
                    <Input
                      id="promoPrice"
                      type="number"
                      value={formData.promoPriceCents}
                      onChange={(e) => setFormData({ ...formData, promoPriceCents: e.target.value })}
                      disabled={loading}
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock *</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                      disabled={loading}
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <select
                      id="unit"
                      className="w-full border rounded-md px-3 py-2"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      disabled={loading}
                    >
                      <option value="un">Unit</option>
                      <option value="kg">Kilogram</option>
                      <option value="g">Gram</option>
                      <option value="l">Liter</option>
                      <option value="ml">Milliliter</option>
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      className="w-full border rounded-md px-3 py-2"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      disabled={loading}
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} disabled={loading}>
                  Cancel
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>My Products</CardTitle>
            <CardDescription>{products.length} products in your catalog</CardDescription>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <p className="text-sm text-gray-500">No products yet. Add your first product!</p>
            ) : (
              <div className="space-y-2">
                {products.map((product) => (
                  <div key={product.id} className="p-4 border rounded hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          {product.brand && `${product.brand} • `}
                          {product.barcode && `EAN: ${product.barcode} • `}
                          Stock: {product.stock || 0} {product.unit}
                        </div>
                        <div className="text-sm mt-1">
                          <span className="font-medium">{formatPrice(product.priceCents)}</span>
                          {product.promoPriceCents && (
                            <span className="ml-2 text-green-600">
                              Promo: {formatPrice(product.promoPriceCents)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                          disabled={loading}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product.id)}
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
