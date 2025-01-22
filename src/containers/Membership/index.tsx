import React, { useEffect, useState } from 'react';
import { API_ROUTES } from "@/routes/api";
import { https } from '@/services/config';
import { useNavigate } from 'react-router-dom';

interface MembershipPackage {
  id: string;
  packageName: string;
  description?: string;
  originalPrice: number;
  duration: number;
  status?: number;
  packageLevel?: string; 
  imageUrl?: string;
  discount?: number;
  price?: number;
}

const MembershipContainer: React.FC = () => {
  const [packages, setPackages] = useState<MembershipPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId] = useState<string>("1"); // Thay thế bằng logic lấy UserID thực tế
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembershipPackages = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await https.get(API_ROUTES.MEMBERSHIP, {
          params: { pageNumber: 1, pageSize: 10 },
        });

        setPackages(response.data.resultObj.items || []);
      } catch (err) {
        console.error("Error fetching data:", err); 
        setError('Failed to fetch membership packages');
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipPackages();
  }, []);

  const handleSelect = async (pkgId: string) => {
    try {
      const response = await https.post(API_ROUTES.BUYPACKAGE, {
        packageId: pkgId,
        userId,
      });
      const redirectUrl = response.data.resultObj.redirectUrlVnPay;

      navigate(`/payment/${pkgId}`, { state: { redirectUrl } });
    } catch (err) {
      console.error("Error buying package:", err);
      setError("Failed to initiate payment. Please try again.");
    }
  };

  if (loading) return <div>Loading membership packages...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800">Choose Your Membership Plan</h1>
        <p className="text-gray-600 mt-4">
          Find the plan that fits your needs. Flexible and affordable options for everyone.
        </p>
        <div className="grid gap-8 mt-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {packages.length === 0 ? (
            <div>No membership packages available</div>
          ) : (
            packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-lg border ${
                  pkg.packageLevel === 'Gold' ? 'border-yellow-500' : 'border-gray-200'
                } bg-white shadow-lg p-6 flex flex-col`}
              >
                {pkg.packageLevel === 'Gold' && (
                  <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
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
                <p className="text-4xl font-bold mt-4">
                  {pkg.price ? `$${pkg.price.toFixed(2)}` : `$${pkg.originalPrice.toFixed(2)}`}
                </p>
                {pkg.discount && (
                  <p className="text-sm text-gray-500 line-through">
                    Original: ${pkg.originalPrice.toFixed(2)}
                  </p>
                )}
                <p className="text-gray-600 mt-2">Duration: {pkg.duration} days</p>
                <button
                  onClick={() => handleSelect(pkg.id)}
                  className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Select
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MembershipContainer;
