'use client'

import { useState } from 'react'
// Fix Heroicons imports - some icon names have changed
import { 
  TruckIcon as CarIcon, 
  CogIcon, 
  SparklesIcon 
} from '@heroicons/react/24/outline'

export default function HomePage() {
  const [formData, setFormData] = useState({
    carModel: '',
    carYear: '',
    carType: 'sedan',
    issueDescription: '',
    budget: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      console.log('Recommendations:', data)
    } catch (error) {
      console.error('Error getting recommendations:', error)
    }
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            🚗 AutoCare Advisor
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get personalized car care product recommendations based on your vehicle and specific needs
          </p>
          <div className="flex justify-center space-x-8 mt-12">
            <div className="text-center">
              <CarIcon className="h-12 w-12 mx-auto mb-2" />
              <p>Any Vehicle</p>
            </div>
            <div className="text-center">
              <CogIcon className="h-12 w-12 mx-auto mb-2" />
              <p>Rule-Based Engine</p>
            </div>
            <div className="text-center">
              <SparklesIcon className="h-12 w-12 mx-auto mb-2" />
              <p>Smart Recommendations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendation Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-8">
            Get Your Recommendations
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Car Model
              </label>
              <input
                type="text"
                value={formData.carModel}
                onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Toyota Camry, BMW 3 Series"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <input
                type="number"
                value={formData.carYear}
                onChange={(e) => setFormData({ ...formData, carYear: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2020"
                min="1990"
                max="2025"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type
              </label>
              <select
                value={formData.carType}
                onChange={(e) => setFormData({ ...formData, carType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="hatchback">Hatchback</option>
                <option value="truck">Truck</option>
                <option value="coupe">Coupe</option>
                <option value="convertible">Convertible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What issue or maintenance do you need help with?
              </label>
              <textarea
                value={formData.issueDescription}
                onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="e.g., My car needs a deep clean, the paint looks dull, I want to maintain the interior..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range
              </label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select your budget</option>
                <option value="under-25">Under $25</option>
                <option value="25-50">$25 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="200-plus">$200+</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Get My Recommendations 🚀
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
