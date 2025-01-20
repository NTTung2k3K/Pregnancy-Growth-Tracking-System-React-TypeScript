import React from 'react';

// Define TypeScript interface for static membership package data
interface MembershipPackage {
  id: string;
  packageName: string;
  description?: string;
  originalPrice: number;
  duration: number;
  status?: number;
  packageLevel?: number;
  imageUrl?: string;
  discount?: number;
  price?: number;
}

const MembershipContainer: React.FC = () => {
  // Static data - replace with API data later
  const packages: MembershipPackage[] = [
    {
      id: '1',
      packageName: 'Basic',
      description: 'Ideal for individuals looking to get started.',
      originalPrice: 10.0,
      price: 8.0,
      duration: 30,
      packageLevel: 0,
      imageUrl: 'https://via.placeholder.com/400x300',
    },
    {
      id: '2',
      packageName: 'Pro',
      description: 'Perfect for small teams needing more features.',
      originalPrice: 30.0,
      price: 25.0,
      duration: 90,
      packageLevel: 1,
      imageUrl: 'https://via.placeholder.com/400x300',
    },
    {
      id: '3',
      packageName: 'Enterprise',
      description: 'Best for large teams or enterprises with advanced needs.',
      originalPrice: 100.0,
      price: 80.0,
      duration: 365,
      packageLevel: 0,
      imageUrl: 'https://via.placeholder.com/400x300',
    },
  ];

  return (
    <div className="bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800">Choose Your Membership Plan</h1>
        <p className="text-gray-600 mt-4">
          Find the plan that fits your needs. Flexible and affordable options for everyone.
        </p>

        {/* Membership Packages Grid */}
        <div className="grid gap-8 mt-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-lg border ${
                pkg.packageLevel === 1 ? 'border-blue-500' : 'border-gray-200'
              } bg-white shadow-lg p-6 flex flex-col`}
            >
              {pkg.packageLevel === 1 && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              )}

              {pkg.imageUrl && (
                <img
                  src={pkg.imageUrl}
                  alt={pkg.packageName}
                  className="h-32 w-full object-cover rounded-lg"
                />
              )}

              <h2 className="text-xl font-semibold text-gray-800 mt-4">{pkg.packageName}</h2>
              <p className="text-gray-600 mt-2">{pkg.description}</p>
              <p className="text-4xl font-bold mt-4">
                {pkg.price ? `$${pkg.price.toFixed(2)}` : `$${pkg.originalPrice.toFixed(2)}`}
              </p>
              {pkg.discount && (
                <p className="text-sm text-gray-500 line-through">
                  Original: ${pkg.originalPrice.toFixed(2)}
                </p>
              )}
              <p className="text-gray-600 mt-2">Duration: {pkg.duration} days</p>

              {/* Button (Replace with link or action in the future) */}
              <button
                className={`mt-auto text-white font-semibold py-2 px-4 rounded ${
                  pkg.packageLevel === 1
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-gray-800 hover:bg-gray-900'
                }`}
              >
                {pkg.packageLevel === 1 ? 'Choose Plan' : 'Learn More'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembershipContainer;