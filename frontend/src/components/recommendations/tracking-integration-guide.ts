// Enhanced recommendations component with tracking integration

// Insert this in recommendations page around line 500, replacing the existing product list
const enhancedProductListSection = `
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Empfohlene Produkte</span>
                  <Badge variant="outline">{recommendations.totalProducts} Produkte</Badge>
                </CardTitle>
                <CardDescription>
                  {recommendations.personalizedMessage || 
                   'Basierend auf Ihren Antworten haben wir diese Produkte für Sie ausgewählt.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductListWithTracking
                  products={recommendations.recommendations.map((product: any, index: number) => ({
                    ...product,
                    _id: product.id || product._id,
                    images: product.image ? [product.image] : [],
                    partnerUrl: product.partnerShopUrl || product.partnerUrl || \`https://example.com/product/\${product.id}\`,
                    partnerId: product.partnerId || 'demo-partner',
                    price: {
                      amount: product.price,
                      currency: 'EUR',
                    },
                    matchScore: product.matchScore,
                    tier: 'professional',
                    rating: {
                      average: product.rating,
                      count: product.reviewCount,
                    },
                  }))}
                  sessionId={sessionId}
                  showTracking={showTrackingDebug}
                />
              </CardContent>
            </Card>
          </div>
`;

// Add this debugging component at the bottom of the page
const debugTrackingComponent = `
        {/* Tracking Analytics Preview */}
        <TrackingAnalyticsPreview
          visible={showTrackingDebug}
          stats={trackingStats}
        />
        
        {/* Debug Toggle */}
        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={() => setShowTrackingDebug(!showTrackingDebug)}
            className="fixed top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded text-sm z-50"
          >
            {showTrackingDebug ? 'Hide' : 'Show'} Tracking
          </button>
        )}
`;

export { debugTrackingComponent, enhancedProductListSection };
