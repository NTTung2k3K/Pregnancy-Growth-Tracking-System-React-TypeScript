import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";

const Banner = () => {
  const items = [
    {
      title: "What does your baby look like now ?",
      buttonTitle: "Show my baby",
      imageUrl: "/src/assets/images/Home/Banner/carousel-1.webp",
    },
    {
      title: "Baby Center Registry Builder",
      buttonTitle: "Get started",
      imageUrl: "/src/assets/images/Home/Banner/carousel-2.webp",
    },
    {
      title: "BabyCenter Course",
      buttonTitle: "Sign me up",
      imageUrl: "/src/assets/images/Home/Banner/carousel-3.jpeg",
    },
  ];

  return (
    <>
      <Carousel className="w-full p-10">
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="relative w-full h-96 flex aspect-square items-center justify-center p-0">
                  <img src={item.imageUrl} className="" />
                  <div className="absolute flex flex-col">
                    <div className="flex flex-col justify-center items-center">
                      <p className="text-4xl bg-slate-100/70 font-semibold mb-10 text-center w-96">
                        {item.title}
                      </p>
                      <Link
                        to={"/huan"}
                        className="bg-sky-800 hover:bg-sky-900 text-emerald-400 p-4 rounded-full font-bold"
                      >
                        {item.buttonTitle}
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-10" />
        <CarouselNext className="mr-10" />
      </Carousel>
    </>
  );
};

export default Banner;
