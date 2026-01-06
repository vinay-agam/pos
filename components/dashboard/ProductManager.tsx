'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { useShop } from '@/hooks/useShop';
import { addProduct, updateProduct, deleteProduct } from '@/lib/shop-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { 
  createPhotoFrameTemplate, 
  createPhotoPrintTemplate, 
  createCustomizedGiftTemplate,
  getDefaultFramePrices,
  getDefaultPrintPrices
} from '@/lib/products';
import { formatPrice } from '@/lib/products';
import { SizeSelector } from '@/components/common/SizeSelector';

export function ProductManager() {
  const { shopData, shopId, refreshShopData } = useShop();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  if (!shopData || !shopId) {
    return <div>Loading...</div>;
  }

  const handleCreateFromTemplate = async (type: 'photo-frame' | 'photo-print' | 'customized-gift') => {
    const name = prompt('Enter product name:');
    if (!name) return;

    let template;
    if (type === 'photo-frame') {
      template = createPhotoFrameTemplate(name, getDefaultFramePrices());
    } else if (type === 'photo-print') {
      template = createPhotoPrintTemplate(name, getDefaultPrintPrices());
    } else {
      const price = parseFloat(prompt('Enter base price:') || '0');
      template = createCustomizedGiftTemplate(name, price);
    }

    try {
      addProduct(shopId, template);
      refreshShopData();
    } catch (error) {
      alert('Failed to create product');
      console.error(error);
    }
  };

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(shopId, productId);
      refreshShopData();
    }
  };

  const handleToggleActive = (product: Product) => {
    updateProduct(shopId, product.id, { isActive: !product.isActive });
    refreshShopData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Custom Product</DialogTitle>
                <DialogDescription>Add a new product to your catalog</DialogDescription>
              </DialogHeader>
              <ProductForm
                shopId={shopId}
                onSuccess={() => {
                  setIsDialogOpen(false);
                  refreshShopData();
                }}
              />
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={() => handleCreateFromTemplate('photo-frame')}>
            Add Photo Frame Template
          </Button>
          <Button variant="outline" onClick={() => handleCreateFromTemplate('photo-print')}>
            Add Photo Print Template
          </Button>
          <Button variant="outline" onClick={() => handleCreateFromTemplate('customized-gift')}>
            Add Customized Gift Template
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {shopData.products.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No products yet. Create your first product!
            </CardContent>
          </Card>
        ) : (
          shopData.products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {product.name}
                      {!product.isActive && <Badge variant="secondary">Inactive</Badge>}
                      <Badge>{product.category}</Badge>
                    </CardTitle>
                    {product.description && (
                      <CardDescription className="mt-1">{product.description}</CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(product)}
                    >
                      {product.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {product.sizes.length > 0 ? (
                  <div>
                    <p className="text-sm font-medium mb-2">Sizes & Prices:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {product.sizes.map((size) => (
                        <div key={size.id} className="p-2 border rounded">
                          <p className="font-medium">{size.name}</p>
                          <p className="text-sm text-gray-600">
                            {formatPrice(size.price, shopData.settings.currency)}
                          </p>
                          {size.stock !== undefined && (
                            <p className="text-xs text-gray-500">Stock: {size.stock}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium">Price:</p>
                    <p className="text-lg font-bold">
                      {formatPrice(product.basePrice || 0, shopData.settings.currency)}
                    </p>
                    {product.stock !== undefined && (
                      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Update product details</DialogDescription>
            </DialogHeader>
            <ProductForm
              shopId={shopId}
              product={editingProduct}
              onSuccess={() => {
                setEditingProduct(null);
                refreshShopData();
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function ProductForm({ 
  shopId, 
  product, 
  onSuccess 
}: { 
  shopId: string; 
  product?: Product; 
  onSuccess: () => void;
}) {
  const { shopData } = useShop();
  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState<'photo-frame' | 'photo-print' | 'customized-gift' | 'custom'>(product?.category || 'custom');
  const [description, setDescription] = useState(product?.description || '');
  const [basePrice, setBasePrice] = useState(product?.basePrice?.toString() || '');
  const [sizes, setSizes] = useState(product?.sizes || []);

  const handleAddSize = () => {
    const sizeName = prompt('Enter size name (e.g., 4x6):');
    if (!sizeName) return;
    const price = parseFloat(prompt('Enter price:') || '0');
    
    setSizes([...sizes, {
      id: `size-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      name: sizeName,
      price,
    }]);
  };

  const handleRemoveSize = (sizeId: string) => {
    setSizes(sizes.filter(s => s.id !== sizeId));
  };

  const handleUpdateSizePrice = (sizeId: string, price: number) => {
    setSizes(sizes.map(s => s.id === sizeId ? { ...s, price } : s));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Product name is required');
      return;
    }

    const productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
      name,
      category,
      description: description || undefined,
      sizes: category !== 'customized-gift' && category !== 'custom' ? sizes : [],
      basePrice: category === 'customized-gift' || category === 'custom' ? parseFloat(basePrice) || 0 : undefined,
      isActive: product?.isActive ?? true,
    };

    try {
      if (product) {
        updateProduct(shopId, product.id, productData);
      } else {
        addProduct(shopId, productData);
      }
      onSuccess();
    } catch (error) {
      alert('Failed to save product');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select value={category} onValueChange={(value: any) => setCategory(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="photo-frame">Photo Frame</SelectItem>
            <SelectItem value="photo-print">Photo Print</SelectItem>
            <SelectItem value="customized-gift">Customized Gift</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {(category === 'photo-frame' || category === 'photo-print') && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Sizes & Prices</Label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddSize}>
              <Plus className="h-4 w-4 mr-1" />
              Add Size
            </Button>
          </div>
          {sizes.length === 0 ? (
            <p className="text-sm text-gray-500">No sizes added</p>
          ) : (
            <div className="space-y-2">
              {sizes.map((size) => (
                <div key={size.id} className="flex gap-2 items-center p-2 border rounded">
                  <Input
                    value={size.name}
                    readOnly
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    value={size.price}
                    onChange={(e) => handleUpdateSizePrice(size.id, parseFloat(e.target.value) || 0)}
                    className="w-32"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveSize(size.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {(category === 'customized-gift' || category === 'custom') && (
        <div className="space-y-2">
          <Label htmlFor="basePrice">Base Price *</Label>
          <Input
            id="basePrice"
            type="number"
            step="0.01"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            required
          />
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit">Save Product</Button>
      </div>
    </form>
  );
}

