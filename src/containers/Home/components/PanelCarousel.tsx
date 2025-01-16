import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { truncate } from "@/utils";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface PanelCarouselProps {
  keyword: string;
}

interface CarouselItem {
  title: string;
  description: string;
  imgUrl: string;
  keyword?: string;
}

const PanelCarousel = ({ keyword }: PanelCarouselProps) => {
  const data : CarouselItem[] = [
    {
      title: "How to cope with the emotional toll of infertility",
      description: "Reviewed By Sipra Laddha, perinatal psychiatrist",
      imgUrl: "/src/assets/images/Home/PanelCarousel/carousel-1.jpg",
      keyword: "Fertility",
    },
    {
      title: "How to cope with the emotional toll of infertility",
      description: "Reviewed By Sipra Laddha, perinatal psychiatrist ",
      imgUrl: "/src/assets/images/Home/PanelCarousel/carousel-1.jpg",
      keyword: "Fertility",
    },
    {
      title: "How to cope with the emotional toll of infertility",
      description: "Reviewed By Sipra Laddha, perinatal psychiatrist ",
      imgUrl: "/src/assets/images/Home/PanelCarousel/carousel-1.jpg",
    },
    {
      title: "How to cope with the emotional toll of infertility",
      description: "Reviewed By Sipra Laddha, perinatal psychiatrist ",
      imgUrl: "/src/assets/images/Home/PanelCarousel/carousel-1.jpg",
    },
    {
      title: "How to cope with the emotional toll of infertility",
      description: "Reviewed By Sipra Laddha, perinatal psychiatrist ",
      imgUrl: "/src/assets/images/Home/PanelCarousel/carousel-1.jpg",
    },
  ];

  const [items, setItems] = useState<CarouselItem[]>([]);

  useEffect(() => {
    if (keyword === "All") {
      setItems(data); // Set all items if keyword is "All"
    } else {
      setItems(data.filter((item) => item.keyword === keyword)); // Filter items by keyword
    }
  }, [keyword]);

  return (
    <>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full px-10 mb-10"
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
              <Link to={"/"} className="p-1">
                <Card>
                  <CardContent className="w-full h-80 flex aspect-square p-0 border-r-4 border-b-4 border-r-emerald-300 border-b-emerald-300 rounded-xl">
                    <div className="flex flex-col">
                      <img
                        className="rounded-t-lg h-44 object-cover"
                        src={item.imgUrl}
                        alt=""
                      />
                      <div className="p-4 leading-6">
                        <p className="text-lg text-sky-900 font-semibold">
                          {truncate(item.title, 47)}
                        </p>
                        <p>{truncate(item.description, 70)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-10" />
        <CarouselNext className="mr-10" />
      </Carousel>
    </>
  );
};

export default PanelCarousel;
