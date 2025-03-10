import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ROUTES } from "@/routes";
import { CookiesService } from "@/services/cookies.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import React from "react";

const Banner = () => {
  const items = [
    {
      title: " Booking to receive medical advice",
      buttonTitle: "Making an appointment",
      link: ROUTES.APPOINTMENT_BOOKING,
      imageUrl: "/assets/images/Home/Banner/carousel-1.png",
      isAuth: true,
    },
    {
      title: "What does your baby look like now ?",
      buttonTitle: "Show my baby",
      imageUrl: "/assets/images/Home/Banner/carousel-2.webp",
      link: ROUTES.CHILDREN,
      isAuth: true,
    },
    {
      title: "Look at how the babies have grown",
      buttonTitle: "Growth Charts",
      imageUrl: "/assets/images/Home/Banner/carousel-3.jpeg",
      link: ROUTES.GROWTH_CHART,
      isAuth: true,
    },
  ];

  const navigate = useNavigate();
  const userId = CookiesService.get();

  const handleNavigate = (isAuth: boolean, link: string) => {
    if (isAuth) {
      if (userId) {
        navigate(link);
      } else {
        toast.error("Please login to access this function");
      }
    } else {
      navigate(link);
    }
  };

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <>
      <Carousel
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="w-full p-10"
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="relative w-full h-96 flex aspect-square items-center justify-center p-0">
                  <img src={item.imageUrl} className="w-full" />
                  <div className="absolute flex flex-col">
                    <div className="flex flex-col justify-center items-center">
                      <p className="text-4xl bg-slate-100/70 font-semibold mb-10 text-center w-96">
                        {item.title}
                      </p>
                      <div
                        onClick={() => handleNavigate(item.isAuth, item.link)}
                        className="bg-sky-800 hover:bg-sky-900 text-emerald-400 p-4 rounded-full font-bold cursor-pointer"
                      >
                        {item.buttonTitle}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-10" />
        <CarouselNext className="mr-10 " />
      </Carousel>
    </>
  );
};

export default Banner;
