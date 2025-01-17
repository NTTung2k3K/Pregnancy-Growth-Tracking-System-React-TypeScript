import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";

const PregnancyTimeline = () => {
  const items = [
    {
      imageUrl: "/assets/images/Home/PregnancyTimeline/apple-icon.png",
    },
    {
      imageUrl: "/assets/images/Home/PregnancyTimeline/orange-icon.png",
    },
    {
      imageUrl: "/assets/images/Home/PregnancyTimeline/grapefruit-icon.png",
    },
    {
      imageUrl: "/assets/images/Home/PregnancyTimeline/lemon-icon.png",
    },
    {
      imageUrl: "/assets/images/Home/PregnancyTimeline/lime-icon.png",
    },
    {
      imageUrl: "/assets/images/Home/PregnancyTimeline/pomelo-icon.png",
    },
    {
      imageUrl: "/assets/images/Home/PregnancyTimeline/strawberry-icon.png",
    },
  ];

  return (
    <Carousel className="w-full p-10 mb-10">
      <CarouselContent className="-ml-1">
        {items.map((item, index) => (
          <CarouselItem key={index} className="pl-1 md:basis-1/3 lg:basis-1/5">
            <Link to={"/"} className="p-1">
              <Card>
                <CardContent className=" w-full h-10 flex aspect-square items-center justify-between p-6 py-12 border-2 border-sky-700 rounded-md">
                  <div className="flex flex-col">
                    <p className="text-sky-900 text-2xl font-bold">
                      {index + 2}
                    </p>
                    <p>weeks pregnant</p>
                  </div>
                  <div className="w-20">
                    <img className="w-16" src={item.imageUrl} alt="" />
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
  );
};

export default PregnancyTimeline;
