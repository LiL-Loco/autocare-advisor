// Mock MongoDB connection for development
// This replaces the missing @/lib/mongodb import

interface MockDatabase {
  collection: (name: string) => MockCollection;
}

interface MockCollection {
  find: (query?: any) => MockCursor;
  findOne: (query: any) => Promise<any>;
  insertOne: (doc: any) => Promise<{ insertedId: string }>;
  insertMany: (docs: any[]) => Promise<{ insertedIds: string[] }>;
  updateOne: (query: any, update: any) => Promise<{ modifiedCount: number }>;
  deleteOne: (query: any) => Promise<{ deletedCount: number }>;
  countDocuments: (query?: any) => Promise<number>;
}

interface MockCursor {
  toArray: () => Promise<any[]>;
  limit: (n: number) => MockCursor;
  sort: (sort: any) => MockCursor;
  skip: (n: number) => MockCursor;
}

// Mock data storage
const mockData: { [key: string]: any[] } = {
  campaigns: [
    {
      _id: '507f1f77bcf86cd799439011',
      name: 'Willkommens-Serie für neue Partner',
      subject: 'Willkommen bei AutoCare Advisor!',
      status: 'sent',
      audienceId: 'new_partners',
      createdAt: new Date('2024-01-15'),
      sentAt: new Date('2024-01-16'),
      stats: {
        sent: 45,
        delivered: 42,
        opened: 18,
        clicked: 5,
        converted: 2,
      },
    },
    {
      _id: '507f1f77bcf86cd799439012',
      name: 'Monatliche Produkt-Updates',
      subject: 'Neue Autopflegeprodukte im Januar',
      status: 'running',
      audienceId: 'active_partners',
      createdAt: new Date('2024-01-20'),
      sentAt: new Date('2024-01-21'),
      stats: {
        sent: 123,
        delivered: 118,
        opened: 67,
        clicked: 23,
        converted: 8,
      },
    },
    {
      _id: '507f1f77bcf86cd799439013',
      name: 'Reaktivierungs-Kampagne',
      subject: 'Wir vermissen Sie! Spezielle Angebote für Sie',
      status: 'draft',
      audienceId: 'inactive_partners',
      createdAt: new Date('2024-01-25'),
      stats: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
      },
    },
  ],
  audiences: [
    {
      _id: 'new_partners',
      name: 'Neue Partner',
      description:
        'Partner, die sich in den letzten 30 Tagen registriert haben',
      count: 89,
      criteria: {
        registrationDate: {
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      createdAt: new Date('2024-01-01'),
    },
    {
      _id: 'active_partners',
      name: 'Aktive Partner',
      description:
        'Partner mit mindestens einer Bestellung in den letzten 60 Tagen',
      count: 234,
      criteria: {
        lastOrderDate: {
          $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        },
      },
      createdAt: new Date('2024-01-01'),
    },
    {
      _id: 'premium_partners',
      name: 'Premium Partner',
      description: 'Partner mit Premium-Status',
      count: 156,
      criteria: {
        tier: 'premium',
      },
      createdAt: new Date('2024-01-01'),
    },
    {
      _id: 'inactive_partners',
      name: 'Inaktive Partner',
      description: 'Partner ohne Bestellung in den letzten 90 Tagen',
      count: 67,
      criteria: {
        lastOrderDate: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
      },
      createdAt: new Date('2024-01-01'),
    },
  ],
  emailLogs: [
    {
      _id: '507f1f77bcf86cd799439021',
      campaignId: '507f1f77bcf86cd799439011',
      recipientId: 'partner_001',
      email: 'partner1@example.com',
      status: 'delivered',
      sentAt: new Date('2024-01-16T10:00:00Z'),
      deliveredAt: new Date('2024-01-16T10:05:00Z'),
      metadata: {
        device: 'desktop',
        browser: 'Chrome',
        location: 'Germany',
      },
    },
    {
      _id: '507f1f77bcf86cd799439022',
      campaignId: '507f1f77bcf86cd799439011',
      recipientId: 'partner_002',
      email: 'partner2@example.com',
      status: 'opened',
      sentAt: new Date('2024-01-16T10:00:00Z'),
      deliveredAt: new Date('2024-01-16T10:05:00Z'),
      openedAt: new Date('2024-01-16T14:30:00Z'),
      metadata: {
        device: 'mobile',
        browser: 'Safari',
        location: 'Austria',
      },
    },
  ],
};

class MockCursorImpl implements MockCursor {
  constructor(private data: any[]) {}

  async toArray(): Promise<any[]> {
    return [...this.data];
  }

  limit(n: number): MockCursor {
    return new MockCursorImpl(this.data.slice(0, n));
  }

  sort(sortObj: any): MockCursor {
    const sortedData = [...this.data].sort((a, b) => {
      for (const [field, direction] of Object.entries(sortObj)) {
        const aVal = a[field];
        const bVal = b[field];

        if (aVal < bVal) return direction === 1 ? -1 : 1;
        if (aVal > bVal) return direction === 1 ? 1 : -1;
      }
      return 0;
    });

    return new MockCursorImpl(sortedData);
  }

  skip(n: number): MockCursor {
    return new MockCursorImpl(this.data.slice(n));
  }
}

class MockCollectionImpl implements MockCollection {
  constructor(private collectionName: string) {}

  find(query: any = {}): MockCursor {
    const data = mockData[this.collectionName] || [];
    // Simple query filtering - in real MongoDB this would be much more sophisticated
    const filteredData = data.filter((doc) => {
      if (Object.keys(query).length === 0) return true;

      return Object.entries(query).every(([key, value]) => {
        return doc[key] === value;
      });
    });

    return new MockCursorImpl(filteredData);
  }

  async findOne(query: any): Promise<any> {
    const data = mockData[this.collectionName] || [];
    return (
      data.find((doc) => {
        return Object.entries(query).every(([key, value]) => {
          return doc[key] === value;
        });
      }) || null
    );
  }

  async insertOne(doc: any): Promise<{ insertedId: string }> {
    const newId = new Date().getTime().toString();
    const newDoc = { ...doc, _id: newId };

    if (!mockData[this.collectionName]) {
      mockData[this.collectionName] = [];
    }

    mockData[this.collectionName].push(newDoc);

    return { insertedId: newId };
  }

  async insertMany(docs: any[]): Promise<{ insertedIds: string[] }> {
    const insertedIds: string[] = [];

    if (!mockData[this.collectionName]) {
      mockData[this.collectionName] = [];
    }

    for (const doc of docs) {
      const newId = new Date().getTime().toString() + Math.random();
      const newDoc = { ...doc, _id: newId };
      mockData[this.collectionName].push(newDoc);
      insertedIds.push(newId);
    }

    return { insertedIds };
  }

  async updateOne(query: any, update: any): Promise<{ modifiedCount: number }> {
    const data = mockData[this.collectionName] || [];
    const docIndex = data.findIndex((doc) => {
      return Object.entries(query).every(([key, value]) => {
        return doc[key] === value;
      });
    });

    if (docIndex >= 0) {
      // Simple $set operation
      if (update.$set) {
        Object.assign(data[docIndex], update.$set);
      }
      return { modifiedCount: 1 };
    }

    return { modifiedCount: 0 };
  }

  async deleteOne(query: any): Promise<{ deletedCount: number }> {
    const data = mockData[this.collectionName] || [];
    const docIndex = data.findIndex((doc) => {
      return Object.entries(query).every(([key, value]) => {
        return doc[key] === value;
      });
    });

    if (docIndex >= 0) {
      data.splice(docIndex, 1);
      return { deletedCount: 1 };
    }

    return { deletedCount: 0 };
  }

  async countDocuments(query: any = {}): Promise<number> {
    const data = mockData[this.collectionName] || [];

    if (Object.keys(query).length === 0) {
      return data.length;
    }

    const filteredData = data.filter((doc) => {
      return Object.entries(query).every(([key, value]) => {
        return doc[key] === value;
      });
    });

    return filteredData.length;
  }
}

class MockDatabaseImpl implements MockDatabase {
  collection(name: string): MockCollection {
    return new MockCollectionImpl(name);
  }
}

// Mock connectMongoDB function
export async function connectMongoDB(): Promise<MockDatabase> {
  // Simulate connection delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return new MockDatabaseImpl();
}

export default connectMongoDB;
