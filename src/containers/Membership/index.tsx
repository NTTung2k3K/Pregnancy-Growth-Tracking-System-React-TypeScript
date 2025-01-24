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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembershipPackages = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await https.get(API_ROUTES.MEMBERSHIP);

        setPackages(response.data.resultObj.items || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch membership packages");
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipPackages();
  }, []);

  const handleSelect = (pkgId: string) => {
    const selectedPackage = packages.find(pkg => pkg.id === pkgId);
    if (selectedPackage) {
      navigate(`/payment/${pkgId}`, { state: { pkg: selectedPackage, pkgId } });
    }
  };

  if (loading) return <div>Loading membership packages...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Choose Your Membership Plan
        </h1>
        <p className="text-gray-600 mt-4">
          Find the plan that fits your needs. Flexible and affordable options
          for everyone.
        </p>
        <div className="grid gap-8 mt-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => {
            const formattedPrice = pkg.price
              ? `${Math.round(pkg.price).toLocaleString()} VND`
              : `${Math.round(pkg.originalPrice).toLocaleString()} VND`;

            return (
              <div
                key={pkg.id}
                className="rounded-2xl border border-gray-200 shadow-sm bg-white"
              >
                <div className="p-6 sm:px-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-t-2xl text-white">
                  <h2 className="text-xl font-bold">
                    {pkg.packageName}
                  </h2>
                  <div className="mt-2 text-3xl font-bold">
                    {formattedPrice} <span className="text-sm">for {pkg.duration} days</span>
                  </div>
                </div>

                <div className="p-6 sm:px-8">
                  <p className="text-lg font-medium text-gray-900 sm:text-xl">
                    Package Detail:
                  </p>
                  <ul className="mt-2 text-gray-700">
                    <li>
                      <strong>Level:</strong> {pkg.packageLevel || "Not specified"}
                    </li>
                    <li>
                      <strong>Description:</strong> {pkg.description || "No description available"}
                    </li>
                    {pkg.imageUrl && (
                      <li className="mt-4">
                        <img
                          src={pkg.imageUrl}
                          alt={pkg.packageName}
                          className="h-32 w-full object-cover rounded-lg"
                        />
                      </li>
                    )}
                  </ul>
                </div>

                <div className="p-6 sm:px-8 bg-white">
                  <button
                    className="mt-6 block w-full rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-center text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                    onClick={() => handleSelect(pkg.id)}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MembershipContainer;
