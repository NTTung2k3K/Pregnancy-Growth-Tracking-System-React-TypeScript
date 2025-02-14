// PanelCarousel.tsx
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem as CarouselItemComponent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { truncate } from "@/lib/text";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "@/services/config";

interface PanelCarouselProps {
  category: number; // blogtypeid dưới dạng số
}

interface BlogItem {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  blogTypeId: number;
}

const PanelCarousel = ({ category }: PanelCarouselProps) => {
  const [items, setItems] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (category) {
          queryParams.append("blogtypeid", category.toString());
        }
        const response = await fetch(
          `${BASE_URL}/blog/all-user-pagination?${queryParams.toString()}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const json = await response.json();
        const data: BlogItem[] = json.resultObj.items;
        setItems(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [category]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (items.length === 0) return <div>No blogs found.</div>;

  return (
    <Carousel opts={{ align: "start" }} className="w-full px-10 mb-10 mt-10">
      <CarouselContent className="space-x-4">
        {items.map((item) => (
          <CarouselItemComponent
            key={item.id}
            className="md:basis-1/2 lg:basis-1/4"
          >
            <Link
              to={`/blog-detail/${item.id}`}
              className="block transform transition-all hover:scale-105"
            >
              <Card className="shadow-lg hover:shadow-2xl transition-shadow rounded-xl overflow-hidden">
                <img
                  className="w-full h-48 object-cover"
                  src={item.thumbnail}
                  alt={item.title}
                />
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-sky-900 mb-2">
                    {truncate(item.title || "", 47)}
                  </h3>
                  <p className="text-gray-600">
                    {truncate(item.description || "", 70)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </CarouselItemComponent>
        ))}
      </CarouselContent>
      <CarouselPrevious className="ml-10" />
      <CarouselNext className="mr-10" />
    </Carousel>
  );
};

export default PanelCarousel;
