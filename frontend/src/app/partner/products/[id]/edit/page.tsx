'use client';

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Plus, Save, Trash2, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  features: string[];
  partnerShopName: string;
  partnerShopUrl: string;
  suitableFor: {
    vehicleTypes: string[];
    vehicleBrands: string[];
    paintTypes: string[];
    paintColors: string[];
  };
  solves: {
    problems: string[];
    applications: string[];
    careAreas: string[];
  };
  usage: {
    experienceLevel: string[];
    frequency: string[];
    seasonality: string[];
  };
  specifications: {
    volume: string;
    concentration: string;
    packaging: string;
    ingredients: string[];
    compatibleSurfaces: string[];
  };
  tags: string[];
  isActive: boolean;
  inStock: boolean;
}

const categories = [
  'Lackreinigung',
  'Innenraumreinigung',
  'Felgenpflege',
  'Reifen & Felgen',
  'Schutzprodukte',
  'Polituren & Wachse',
  'Werkzeuge & Zubehör',
  'Spezialprodukte',
  'Detailing-Tools',
  'Pflegesets',
];

const vehicleTypes = [
  'PKW',
  'SUV',
  'Limousine',
  'Transporter',
  'Motorrad',
  'Wohnmobil',
  'ALL',
];
const paintTypes = [
  'Metallic',
  'Uni',
  'Perleffekt',
  'Matt',
  'Folierung',
  'ALL',
];
const problems = [
  'Wasserflecken',
  'Kalkflecken',
  'Kratzer',
  'Hologramme',
  'Verwitterung',
  'Verschmutzung',
  'Oxidation',
  'Insektenreste',
  'Teerflecken',
  'Vogelkot',
  'Baumharz',
  'Rostflecken',
];
const applications = [
  'Handwäsche',
  '2-Eimer-Methode',
  'Sprühanwendung',
  'Maschinenpolitur',
  'Handpolitur',
  'Foam-Lance',
  'Drucksprüher',
  'Mikrofasertuch',
];
const careAreas = [
  'Außenlack',
  'Innenraum',
  'Felgen',
  'Reifen',
  'Glas',
  'Chrom',
  'Plastik',
];
const experienceLevels = ['Anfänger', 'Fortgeschritten', 'Profi'];
const seasonality = ['Frühling', 'Sommer', 'Herbst', 'Winter', 'ALL'];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newFeature, setNewFeature] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newTag, setNewTag] = useState('');

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/partner/products/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setProduct(data.data.product);
        } else {
          throw new Error(data.error || 'Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        toast({
          title: 'Fehler',
          description: 'Produkt konnte nicht geladen werden',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, toast]);

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    if (product) {
      setProduct((prev) => ({ ...prev!, [field]: value }));
    }
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    if (product) {
      setProduct((prev) => ({
        ...prev!,
        [section]: {
          ...(prev![section as keyof Product] as any),
          [field]: value,
        },
      }));
    }
  };

  const handleArrayToggle = (section: string, field: string, value: string) => {
    if (product) {
      setProduct((prev) => {
        const currentArray =
          ((prev![section as keyof Product] as any)?.[field] as string[]) || [];
        const newArray = currentArray.includes(value)
          ? currentArray.filter((item: string) => item !== value)
          : [...currentArray, value];

        return {
          ...prev!,
          [section]: {
            ...(prev![section as keyof Product] as any),
            [field]: newArray,
          },
        };
      });
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && product) {
      setProduct((prev) => ({
        ...prev!,
        features: [...prev!.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    if (product) {
      setProduct((prev) => ({
        ...prev!,
        features: prev!.features.filter((_, i) => i !== index),
      }));
    }
  };

  const addImage = () => {
    if (
      newImage.trim() &&
      product &&
      !product.images.includes(newImage.trim())
    ) {
      setProduct((prev) => ({
        ...prev!,
        images: [...prev!.images, newImage.trim()],
      }));
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    if (product) {
      setProduct((prev) => ({
        ...prev!,
        images: prev!.images.filter((_, i) => i !== index),
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && product && !product.tags.includes(newTag.trim())) {
      setProduct((prev) => ({
        ...prev!,
        tags: [...prev!.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    if (product) {
      setProduct((prev) => ({
        ...prev!,
        tags: prev!.tags.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setSaving(true);

    try {
      const response = await fetch(`/api/partner/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(product),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Erfolg',
          description: 'Produkt wurde erfolgreich aktualisiert',
        });
        router.push('/partner/products');
      } else {
        throw new Error(data.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Fehler',
        description: 'Produkt konnte nicht aktualisiert werden',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !product ||
      !confirm('Sind Sie sicher, dass Sie dieses Produkt löschen möchten?')
    )
      return;

    setDeleting(true);

    try {
      const response = await fetch(`/api/partner/products/${product._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Erfolg',
          description: 'Produkt wurde erfolgreich gelöscht',
        });
        router.push('/partner/products');
      } else {
        throw new Error(data.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Fehler',
        description: 'Produkt konnte nicht gelöscht werden',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Produkt wird geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200">
          <CardContent className="p-8 text-center">
            <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Produkt nicht gefunden
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              onClick={() => router.push('/partner/products')}
              variant="outline"
            >
              Zurück zur Übersicht
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Produkt bearbeiten
            </h1>
            <p className="text-gray-600 mt-1">{product.name}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? 'Lösche...' : 'Löschen'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Status Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={product.isActive}
                  onCheckedChange={(checked) =>
                    handleInputChange('isActive', checked)
                  }
                />
                <Label htmlFor="isActive">Aktiv</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={product.inStock}
                  onCheckedChange={(checked) =>
                    handleInputChange('inStock', checked)
                  }
                />
                <Label htmlFor="inStock">Auf Lager</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rest of the form - similar to new product page but with existing values */}
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Grundinformationen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Produktname *</Label>
                <Input
                  id="name"
                  value={product.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="brand">Marke *</Label>
                <Input
                  id="brand"
                  value={product.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Beschreibung *</Label>
              <Textarea
                id="description"
                value={product.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Kategorie *</Label>
                <Select
                  value={product.category}
                  onValueChange={(value) =>
                    handleInputChange('category', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategorie wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subcategory">Unterkategorie</Label>
                <Input
                  id="subcategory"
                  value={product.subcategory || ''}
                  onChange={(e) =>
                    handleInputChange('subcategory', e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preis (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={product.price}
                  onChange={(e) =>
                    handleInputChange('price', parseFloat(e.target.value))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="originalPrice">Originalpreis (€)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  value={product.originalPrice || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'originalPrice',
                      e.target.value ? parseFloat(e.target.value) : 0
                    )
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shop Information */}
        <Card>
          <CardHeader>
            <CardTitle>Shop-Informationen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="partnerShopName">Shop-Name *</Label>
                <Input
                  id="partnerShopName"
                  value={product.partnerShopName}
                  onChange={(e) =>
                    handleInputChange('partnerShopName', e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="partnerShopUrl">Shop-URL *</Label>
                <Input
                  id="partnerShopUrl"
                  type="url"
                  value={product.partnerShopUrl}
                  onChange={(e) =>
                    handleInputChange('partnerShopUrl', e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Produktbilder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Bild-URL eingeben"
                type="url"
              />
              <Button
                type="button"
                onClick={addImage}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Hinzufügen
              </Button>
            </div>

            {product.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Produktbild ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          '/images/placeholder-product.jpg';
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vehicle Compatibility */}
        <Card>
          <CardHeader>
            <CardTitle>Fahrzeug-Kompatibilität</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Fahrzeugtypen</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {vehicleTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`vehicle-${type}`}
                      checked={product.suitableFor.vehicleTypes.includes(type)}
                      onCheckedChange={() =>
                        handleArrayToggle('suitableFor', 'vehicleTypes', type)
                      }
                    />
                    <Label htmlFor={`vehicle-${type}`} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Lacktypen</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {paintTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`paint-${type}`}
                      checked={product.suitableFor.paintTypes.includes(type)}
                      onCheckedChange={() =>
                        handleArrayToggle('suitableFor', 'paintTypes', type)
                      }
                    />
                    <Label htmlFor={`paint-${type}`} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Produkteigenschaften</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Features</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="z.B. Langanhaltender Schutz"
                />
                <Button type="button" onClick={addFeature}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {product.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {feature}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeFeature(index)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="z.B. premium, langzeit"
                />
                <Button type="button" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(index)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Abbrechen
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Wird gespeichert...' : 'Änderungen speichern'}
          </Button>
        </div>
      </form>
    </div>
  );
}
