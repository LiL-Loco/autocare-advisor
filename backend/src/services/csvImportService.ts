import { ObjectId } from 'mongodb';
import { IProduct } from '../models/Product';
import ProductService from './productService';
// @ts-ignore
import csv from 'csv-parser';
import { Readable } from 'stream';

export interface CSVRowData {
  name: string;
  brand: string;
  category: string;
  price: string;
  description?: string;
  imageUrls?: string;
  availability?: string;
  partnerShopName: string;
  partnerShopUrl?: string;
  specifications?: string;
  tags?: string;
}

export interface ImportResult {
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    row: number;
    data: CSVRowData;
    error: string;
  }>;
  importedProducts: IProduct[];
}

export interface ImportProgress {
  processed: number;
  total: number;
  percentage: number;
  currentRow?: CSVRowData;
  errors: Array<{
    row: number;
    error: string;
  }>;
}

export default class CSVImportService {
  private productService: typeof ProductService;

  constructor() {
    this.productService = ProductService;
  }

  async importFromCSV(
    csvData: Buffer | string,
    partnerId: string,
    progressCallback?: (progress: ImportProgress) => void
  ): Promise<ImportResult> {
    const result: ImportResult = {
      totalRows: 0,
      successCount: 0,
      errorCount: 0,
      errors: [],
      importedProducts: [],
    };

    const rows: CSVRowData[] = [];

    try {
      // Parse CSV data
      await new Promise<void>((resolve, reject) => {
        const stream = Readable.from(csvData.toString());

        stream
          .pipe(
            csv({
              mapHeaders: ({ header }: { header: string }) =>
                header.toLowerCase().trim().replace(/\s+/g, '_'),
            })
          )
          .on('data', (row: any) => {
            rows.push(this.normalizeCSVRow(row));
          })
          .on('end', () => {
            result.totalRows = rows.length;
            resolve();
          })
          .on('error', (error: Error) => {
            reject(new Error(`CSV parsing failed: ${error.message}`));
          });
      });

      // Process each row
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNumber = i + 1;

        try {
          // Validate required fields
          const validationError = this.validateCSVRow(row);
          if (validationError) {
            result.errors.push({
              row: rowNumber,
              data: row,
              error: validationError,
            });
            result.errorCount++;
            continue;
          }

          // Convert CSV row to product data
          const productData = await this.convertCSVRowToProduct(row, partnerId);

          // Create product
          const product = await this.productService.createProduct(
            productData,
            partnerId
          );
          result.importedProducts.push(product);
          result.successCount++;

          // Report progress
          if (progressCallback) {
            progressCallback({
              processed: i + 1,
              total: rows.length,
              percentage: Math.round(((i + 1) / rows.length) * 100),
              currentRow: row,
              errors: result.errors.slice(-5), // Last 5 errors
            });
          }
        } catch (error: any) {
          result.errors.push({
            row: rowNumber,
            data: row,
            error: error.message || 'Unknown error occurred',
          });
          result.errorCount++;
        }
      }
    } catch (error: any) {
      throw new Error(`CSV import failed: ${error.message}`);
    }

    return result;
  }

  private normalizeCSVRow(row: any): CSVRowData {
    return {
      name: this.cleanString(row.name || row.product_name || row.title),
      brand: this.cleanString(row.brand || row.manufacturer),
      category: this.cleanString(row.category || row.type),
      price: this.cleanString(row.price || row.cost),
      description: this.cleanString(row.description),
      imageUrls: this.cleanString(row.image_urls || row.images),
      availability: this.cleanString(
        row.availability || row.status || row.stock_status
      ),
      partnerShopName: this.cleanString(
        row.partner_shop_name || row.shop_name || row.store_name
      ),
      partnerShopUrl: this.cleanString(row.partner_shop_url || row.shop_url),
      specifications: this.cleanString(row.specifications || row.specs),
      tags: this.cleanString(row.tags || row.keywords),
    };
  }

  private cleanString(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value).trim();
  }

  private validateCSVRow(row: CSVRowData): string | null {
    if (!row.name) return 'Product name is required';
    if (!row.brand) return 'Brand is required';
    if (!row.category) return 'Category is required';
    if (!row.price) return 'Price is required';
    if (!row.partnerShopName) return 'Partner shop name is required';

    // Validate price format
    const price = parseFloat(row.price.replace(/[€$,]/g, ''));
    if (isNaN(price) || price < 0) {
      return 'Invalid price format';
    }

    // Validate category
    const validCategories = [
      'exterior_care',
      'interior_care',
      'engine_care',
      'tire_care',
      'glass_care',
      'detailing_tools',
      'accessories',
      'other',
    ];
    const normalizedCategory = row.category.toLowerCase().replace(/\s+/g, '_');
    if (!validCategories.includes(normalizedCategory)) {
      return `Invalid category. Must be one of: ${validCategories.join(', ')}`;
    }

    return null;
  }

  private async convertCSVRowToProduct(
    row: CSVRowData,
    partnerId: string
  ): Promise<any> {
    const price = parseFloat(row.price.replace(/[€$,]/g, ''));
    const normalizedCategory = row.category.toLowerCase().replace(/\s+/g, '_');

    // Parse image URLs
    const imageUrls = row.imageUrls
      ? row.imageUrls
          .split(',')
          .map((url) => url.trim())
          .filter((url) => url)
      : [];

    // Parse specifications
    let specifications = {};
    if (row.specifications) {
      try {
        // Try JSON format first
        specifications = JSON.parse(row.specifications);
      } catch {
        // Fall back to key:value pairs separated by semicolons
        const specs = row.specifications.split(';');
        specifications = specs.reduce((acc: any, spec: string) => {
          const [key, value] = spec.split(':').map((s) => s.trim());
          if (key && value) {
            acc[key] = value;
          }
          return acc;
        }, {});
      }
    }

    // Parse tags
    const tags = row.tags
      ? row.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : [];

    // Determine availability
    let availability = 'available';
    if (row.availability) {
      const avail = row.availability.toLowerCase();
      if (avail.includes('out') || avail.includes('sold')) {
        availability = 'out_of_stock';
      } else if (avail.includes('limited') || avail.includes('low')) {
        availability = 'limited_stock';
      } else if (avail.includes('discontinued')) {
        availability = 'discontinued';
      }
    }

    return {
      name: row.name,
      brand: row.brand,
      category: normalizedCategory,
      price,
      description: row.description || `${row.name} by ${row.brand}`,
      imageUrls,
      availability,
      partnerId: new ObjectId(partnerId),
      partnerShopName: row.partnerShopName,
      partnerShopUrl: row.partnerShopUrl || '',
      specifications,
      tags,
      isActive: true,
      inStock:
        availability !== 'out_of_stock' && availability !== 'discontinued',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async generateSampleCSV(): Promise<string> {
    const sampleData = [
      {
        name: 'Premium Car Wax',
        brand: 'AutoShine',
        category: 'exterior_care',
        price: '29.99',
        description:
          'High-quality carnauba wax for ultimate shine and protection',
        image_urls: 'https://example.com/img1.jpg,https://example.com/img2.jpg',
        availability: 'available',
        partner_shop_name: 'Car Care Pro',
        partner_shop_url: 'https://carcarepro.com',
        specifications: 'type:liquid;coverage:10 sq meters;durability:6 months',
        tags: 'wax,shine,protection,carnauba',
      },
      {
        name: 'Leather Cleaner & Conditioner',
        brand: 'LeatherLux',
        category: 'interior_care',
        price: '24.50',
        description:
          'Professional leather care solution for automotive interiors',
        image_urls: 'https://example.com/leather1.jpg',
        availability: 'limited_stock',
        partner_shop_name: 'Interior Masters',
        partner_shop_url: 'https://interiormasters.com',
        specifications:
          'volume:500ml;ph_neutral:true;safe_for:all leather types',
        tags: 'leather,cleaner,conditioner,interior',
      },
      {
        name: 'Engine Degreaser',
        brand: 'PowerClean',
        category: 'engine_care',
        price: '18.75',
        description:
          'Heavy-duty engine degreaser removes oil and grime effectively',
        image_urls: '',
        availability: 'available',
        partner_shop_name: 'Engine Care Experts',
        partner_shop_url: '',
        specifications: 'type:spray;biodegradable:yes;concentrate:ready to use',
        tags: 'engine,degreaser,cleaning,maintenance',
      },
    ];

    const header = Object.keys(sampleData[0]).join(',');
    const rows = sampleData.map((row) =>
      Object.values(row)
        .map((value) => `"${value}"`)
        .join(',')
    );

    return [header, ...rows].join('\n');
  }

  validateCSVFormat(csvData: Buffer | string): {
    isValid: boolean;
    errors: string[];
    requiredHeaders: string[];
    foundHeaders: string[];
  } {
    const result = {
      isValid: true,
      errors: [] as string[],
      requiredHeaders: [
        'name',
        'brand',
        'category',
        'price',
        'partner_shop_name',
      ],
      foundHeaders: [] as string[],
    };

    try {
      const lines = csvData.toString().split('\n');
      if (lines.length < 2) {
        result.isValid = false;
        result.errors.push(
          'CSV file must contain at least a header and one data row'
        );
        return result;
      }

      const headerLine = lines[0].trim();
      const headers = headerLine
        .split(',')
        .map((h) =>
          h.replace(/"/g, '').toLowerCase().trim().replace(/\s+/g, '_')
        );

      result.foundHeaders = headers;

      // Check for required headers
      for (const required of result.requiredHeaders) {
        if (!headers.some((h) => h.includes(required))) {
          result.isValid = false;
          result.errors.push(`Missing required column: ${required}`);
        }
      }

      // Check for data rows
      const dataRows = lines.slice(1).filter((line) => line.trim());
      if (dataRows.length === 0) {
        result.isValid = false;
        result.errors.push('CSV file contains no data rows');
      }
    } catch (error: any) {
      result.isValid = false;
      result.errors.push(`CSV validation failed: ${error.message}`);
    }

    return result;
  }
}
