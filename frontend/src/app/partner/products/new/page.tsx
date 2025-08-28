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
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProductFormData {
  name: string;
  description: string;
  brand: string;
  category: string;
  subcategory: string;
  price: string;
  originalPrice: string;
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

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    brand: '',
    category: '',
    subcategory: '',
    price: '',
    originalPrice: '',
    images: [],
    features: [],
    partnerShopName: '',
    partnerShopUrl: '',
    suitableFor: {
      vehicleTypes: ['ALL'],
      vehicleBrands: ['ALL'],
      paintTypes: ['ALL'],
      paintColors: ['ALL'],
    },
    solves: {
      problems: [],
      applications: [],
      careAreas: [],
    },
    usage: {
      experienceLevel: ['Anfänger'],
      frequency: ['Wöchentlich'],
      seasonality: ['ALL'],
    },
    specifications: {
      volume: '',
      concentration: '',
      packaging: '',
      ingredients: [],
      compatibleSurfaces: [],
    },
    tags: [],
  });

  const [loading, setLoading] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof ProductFormData] as any),
        [field]: value,
      },
    }));
  };

  const handleArrayToggle = (section: string, field: string, value: string) => {
    setFormData((prev) => {
      // Type guard to ensure the section exists and is an object with array properties
      const sectionData = prev[section as keyof ProductFormData];
      if (
        typeof sectionData !== 'object' ||
        sectionData === null ||
        Array.isArray(sectionData)
      ) {
        return prev;
      }

      const currentArray = ((sectionData as any)[field] as string[]) || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];

      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: newArray,
        },
      };
    });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }));
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/partner/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice
            ? parseFloat(formData.originalPrice)
            : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Erfolg',
          description: 'Produkt wurde erfolgreich erstellt',
        });
        router.push('/partner/products');
      } else {
        throw new Error(data.error || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: 'Fehler',
        description: 'Produkt konnte nicht erstellt werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
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
            Neues Produkt erstellen
          </h1>
          <p className="text-gray-600 mt-1">
            Fügen Sie ein neues Produkt zu Ihrem Katalog hinzu
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
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
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="z.B. Premium Carnauba Wachs"
                  required
                />
              </div>
              <div>
                <Label htmlFor="brand">Marke *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder="z.B. Chemical Guys"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Beschreibung *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                placeholder="Detaillierte Produktbeschreibung..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Kategorie *</Label>
                <Select
                  value={formData.category}
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
                  value={formData.subcategory}
                  onChange={(e) =>
                    handleInputChange('subcategory', e.target.value)
                  }
                  placeholder="z.B. Autowachs, Sprühwachs"
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
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="29.99"
                  required
                />
              </div>
              <div>
                <Label htmlFor="originalPrice">Originalpreis (€)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    handleInputChange('originalPrice', e.target.value)
                  }
                  placeholder="39.99"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partner Information */}
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
                  value={formData.partnerShopName}
                  onChange={(e) =>
                    handleInputChange('partnerShopName', e.target.value)
                  }
                  placeholder="Mein Detailing Shop"
                  required
                />
              </div>
              <div>
                <Label htmlFor="partnerShopUrl">Shop-URL *</Label>
                <Input
                  id="partnerShopUrl"
                  type="url"
                  value={formData.partnerShopUrl}
                  onChange={(e) =>
                    handleInputChange('partnerShopUrl', e.target.value)
                  }
                  placeholder="https://mein-shop.de/produkt"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Produktbilder *</CardTitle>
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

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
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
            <CardTitle>Fahrzeug-Kompatibilität *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Fahrzeugtypen</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {vehicleTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`vehicle-${type}`}
                      checked={formData.suitableFor.vehicleTypes.includes(type)}
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
                      checked={formData.suitableFor.paintTypes.includes(type)}
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

        {/* Problem Solving */}
        <Card>
          <CardHeader>
            <CardTitle>Problemlösung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Löst folgende Probleme</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {problems.map((problem) => (
                  <div key={problem} className="flex items-center space-x-2">
                    <Checkbox
                      id={`problem-${problem}`}
                      checked={formData.solves.problems.includes(problem)}
                      onCheckedChange={() =>
                        handleArrayToggle('solves', 'problems', problem)
                      }
                    />
                    <Label htmlFor={`problem-${problem}`} className="text-sm">
                      {problem}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Anwendungsarten</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {applications.map((app) => (
                  <div key={app} className="flex items-center space-x-2">
                    <Checkbox
                      id={`app-${app}`}
                      checked={formData.solves.applications.includes(app)}
                      onCheckedChange={() =>
                        handleArrayToggle('solves', 'applications', app)
                      }
                    />
                    <Label htmlFor={`app-${app}`} className="text-sm">
                      {app}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Pflegebereiche</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {careAreas.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={`area-${area}`}
                      checked={formData.solves.careAreas.includes(area)}
                      onCheckedChange={() =>
                        handleArrayToggle('solves', 'careAreas', area)
                      }
                    />
                    <Label htmlFor={`area-${area}`} className="text-sm">
                      {area}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Context */}
        <Card>
          <CardHeader>
            <CardTitle>Anwendungskontext</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Erfahrungsgrad</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {experienceLevels.map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                      id={`exp-${level}`}
                      checked={formData.usage.experienceLevel.includes(level)}
                      onCheckedChange={() =>
                        handleArrayToggle('usage', 'experienceLevel', level)
                      }
                    />
                    <Label htmlFor={`exp-${level}`} className="text-sm">
                      {level}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Saisonalität</Label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                {seasonality.map((season) => (
                  <div key={season} className="flex items-center space-x-2">
                    <Checkbox
                      id={`season-${season}`}
                      checked={formData.usage.seasonality.includes(season)}
                      onCheckedChange={() =>
                        handleArrayToggle('usage', 'seasonality', season)
                      }
                    />
                    <Label htmlFor={`season-${season}`} className="text-sm">
                      {season}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Features */}
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
              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.features.map((feature, index) => (
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="volume">Volumen</Label>
                <Input
                  id="volume"
                  value={formData.specifications.volume}
                  onChange={(e) =>
                    handleNestedChange(
                      'specifications',
                      'volume',
                      e.target.value
                    )
                  }
                  placeholder="z.B. 500ml, 1L"
                />
              </div>
              <div>
                <Label htmlFor="concentration">Konzentration</Label>
                <Input
                  id="concentration"
                  value={formData.specifications.concentration}
                  onChange={(e) =>
                    handleNestedChange(
                      'specifications',
                      'concentration',
                      e.target.value
                    )
                  }
                  placeholder="z.B. 1:10, Ready-to-use"
                />
              </div>
              <div>
                <Label htmlFor="packaging">Verpackung</Label>
                <Input
                  id="packaging"
                  value={formData.specifications.packaging}
                  onChange={(e) =>
                    handleNestedChange(
                      'specifications',
                      'packaging',
                      e.target.value
                    )
                  }
                  placeholder="z.B. Spray, Bottle"
                />
              </div>
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
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
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
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? 'Wird erstellt...' : 'Produkt erstellen'}
          </Button>
        </div>
      </form>
    </div>
  );
}
