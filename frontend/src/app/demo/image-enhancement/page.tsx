'use client';

import { useState } from 'react';
import BatchProcessingDashboard from '../../../components/admin/BatchProcessingDashboard';
import LazyImage, {
  LazyImageGallery,
} from '../../../components/common/LazyImage';

// Mock data für Demo
const mockImages = [
  {
    id: '1',
    src: '/api/images/sample1.jpg',
    webpSrc: '/api/images/sample1.webp',
    alt: 'Motoröl Premium 5W-30',
    caption: 'Hochleistungs-Motoröl für moderne Fahrzeuge',
  },
  {
    id: '2',
    src: '/api/images/sample2.jpg',
    webpSrc: '/api/images/sample2.webp',
    alt: 'Bremsflüssigkeit DOT4',
    caption: 'Hochwertige Bremsflüssigkeit für optimale Bremsleistung',
  },
  {
    id: '3',
    src: '/api/images/sample3.jpg',
    webpSrc: '/api/images/sample3.webp',
    alt: 'Kühlerfrostschutz',
    caption: 'Ganzjährig wirksamer Frostschutz für alle Fahrzeuge',
  },
  {
    id: '4',
    src: '/api/images/sample4.jpg',
    webpSrc: '/api/images/sample4.webp',
    alt: 'Getriebeöl ATF',
    caption: 'Automatikgetriebeöl für sanfte Schaltungen',
  },
  {
    id: '5',
    src: '/api/images/sample5.jpg',
    webpSrc: '/api/images/sample5.webp',
    alt: 'Reinigungsschaum',
    caption: 'Professioneller Reinigungsschaum für Innenräume',
  },
  {
    id: '6',
    src: '/api/images/sample6.jpg',
    webpSrc: '/api/images/sample6.webp',
    alt: 'Felgenreiniger',
    caption: 'Kraftvoller Felgenreiniger gegen hartnäckigen Schmutz',
  },
];

export default function ImageEnhancementDemo() {
  const [showBatchDashboard, setShowBatchDashboard] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const handleImageClick = (image: any, index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Image Enhancement Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            WebP Conversion • Lazy Loading • Batch Processing
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowBatchDashboard(!showBatchDashboard)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showBatchDashboard ? 'Hide' : 'Show'} Batch Processing
            </button>
          </div>
        </div>

        {/* Batch Processing Dashboard */}
        {showBatchDashboard && (
          <div className="mb-8">
            <BatchProcessingDashboard
              onClose={() => setShowBatchDashboard(false)}
              className="shadow-lg"
            />
          </div>
        )}

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-2xl mb-3">🖼️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              WebP Conversion
            </h3>
            <p className="text-gray-600">
              Automatische WebP-Konvertierung für moderne Browser mit Fallback
              zu JPEG/PNG
            </p>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 text-xs text-green-600">
                WebP-Indikator aktiviert
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Lazy Loading
            </h3>
            <p className="text-gray-600">
              Bilder werden nur geladen wenn sie im Viewport sichtbar werden -
              verbessert Performance
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-2xl mb-3">🚀</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Batch Processing
            </h3>
            <p className="text-gray-600">
              Redis-basiertes Queue-System für Bulk-Bildverarbeitung mit
              Fortschrittsanzeige
            </p>
          </div>
        </div>

        {/* Single Image Examples */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Single Image Loading
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Priority Loading (sofort geladen)
              </h3>
              <LazyImage
                src={mockImages[0].src}
                webpSrc={mockImages[0].webpSrc}
                alt={mockImages[0].alt}
                priority={true}
                className="rounded-lg border border-gray-200"
                width={300}
                height={200}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Lazy Loading (beim Scrollen)
              </h3>
              <LazyImage
                src={mockImages[1].src}
                webpSrc={mockImages[1].webpSrc}
                alt={mockImages[1].alt}
                className="rounded-lg border border-gray-200"
                width={300}
                height={200}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Mit Blur-Placeholder
              </h3>
              <LazyImage
                src={mockImages[2].src}
                webpSrc={mockImages[2].webpSrc}
                alt={mockImages[2].alt}
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGBkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                className="rounded-lg border border-gray-200"
                width={300}
                height={200}
              />
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Lazy Loading Gallery
          </h2>
          <p className="text-gray-600 mb-6">
            Die ersten 2 Bilder werden sofort geladen (priority), der Rest wird
            lazy geladen wenn sichtbar.
          </p>
          <LazyImageGallery
            images={mockImages}
            columns={3}
            gap={16}
            priority={2}
            onImageClick={handleImageClick}
            imageClassName="hover:shadow-lg transition-shadow duration-200"
          />
        </div>

        {/* Performance Tips */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            💡 Performance Tipps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-blue-800 mb-2">WebP Vorteile:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 25-35% kleinere Dateigröße</li>
                <li>• Bessere Kompression als JPEG</li>
                <li>• Automatischer Fallback für alte Browser</li>
                <li>• Transparenz-Unterstützung</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Lazy Loading:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Reduziert initiale Ladezeit</li>
                <li>• Spart Bandbreite</li>
                <li>• Verbessert Core Web Vitals</li>
                <li>• Smooth Fade-in Animation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Add spacer to demonstrate lazy loading */}
        <div
          style={{ height: '150vh' }}
          className="bg-gradient-to-b from-gray-50 to-white"
        ></div>

        {/* More images below the fold */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Lazy Loading Test (Below the Fold)
          </h2>
          <p className="text-gray-600 mb-6">
            Diese Bilder werden erst geladen wenn sie in den Viewport scrollen.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockImages.slice(2).map((image, index) => (
              <LazyImage
                key={image.id}
                src={image.src}
                webpSrc={image.webpSrc}
                alt={image.alt}
                className="rounded-lg border border-gray-200"
                width={200}
                height={150}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-full">
            <LazyImage
              src={mockImages[selectedImageIndex].src}
              webpSrc={mockImages[selectedImageIndex].webpSrc}
              alt={mockImages[selectedImageIndex].alt}
              className="rounded-lg"
              priority={true}
              width={800}
              height={600}
            />
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="absolute bottom-4 left-4 right-4 text-white bg-black bg-opacity-50 rounded-lg p-3">
              <h3 className="font-medium">
                {mockImages[selectedImageIndex].alt}
              </h3>
              <p className="text-sm opacity-90">
                {mockImages[selectedImageIndex].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
