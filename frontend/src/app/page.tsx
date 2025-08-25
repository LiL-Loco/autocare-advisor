'use client';

import {
  TruckIcon as CarIcon,
  ChevronRightIcon,
  CogIcon,
  SparklesIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold mb-6 tracking-tight">
            🚗 AutoCare Advisor
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Get personalized car care product recommendations with our
            intelligent questionnaire. Find the perfect products for your
            vehicle in just 3-4 minutes.
          </p>

          <div className="mb-12">
            <button
              onClick={() => router.push('/questionnaire')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-2"
            >
              Start Your Car Care Journey
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-center space-x-12 mt-16">
            <div className="text-center group">
              <div className="bg-white/10 rounded-full p-4 mb-4 mx-auto w-20 h-20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <CarIcon className="h-10 w-10" />
              </div>
              <p className="text-lg font-medium">Any Vehicle</p>
              <p className="text-blue-200 text-sm">All makes & models</p>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 rounded-full p-4 mb-4 mx-auto w-20 h-20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <CogIcon className="h-10 w-10" />
              </div>
              <p className="text-lg font-medium">Smart Engine</p>
              <p className="text-blue-200 text-sm">Rule-based matching</p>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 rounded-full p-4 mb-4 mx-auto w-20 h-20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <SparklesIcon className="h-10 w-10" />
              </div>
              <p className="text-lg font-medium">Personalized</p>
              <p className="text-blue-200 text-sm">Tailored to your needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Answer Questions</h3>
              <p className="text-gray-600">
                Tell us about your vehicle, usage patterns, and car care goals
                through our simple questionnaire.
              </p>
            </div>

            <div className="text-center bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Matched</h3>
              <p className="text-gray-600">
                Our intelligent system analyzes your responses and matches you
                with the perfect products.
              </p>
            </div>

            <div className="text-center bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Shop & Save</h3>
              <p className="text-gray-600">
                Review detailed recommendations with explanations and shop from
                trusted partner stores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Why Choose AutoCare Advisor?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold mb-2">Precision Matching</h3>
              <p className="text-gray-600 text-sm">
                Advanced rule-based engine considers your specific vehicle and
                needs
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold mb-2">Fast Results</h3>
              <p className="text-gray-600 text-sm">
                Get personalized recommendations in under 5 minutes
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-lg font-semibold mb-2">Trusted Partners</h3>
              <p className="text-gray-600 text-sm">
                Shop from verified automotive product retailers
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-lg font-semibold mb-2">Mobile Friendly</h3>
              <p className="text-gray-600 text-sm">
                Works perfectly on all devices and screen sizes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">
            Trusted by Car Enthusiasts
          </h2>

          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="ml-2 text-gray-600">4.9/5 Average Rating</span>
            </div>
            <div className="text-gray-600">
              <span className="font-semibold text-blue-600">10,000+</span>{' '}
              Recommendations Generated
            </div>
            <div className="text-gray-600">
              <span className="font-semibold text-blue-600">500+</span> Partner
              Products
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => router.push('/questionnaire')}
              className="bg-blue-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-2"
            >
              Get My Personalized Recommendations
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
