import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { textConvert, truncate } from "@/lib/text";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";

interface BlogItem {
  title: string;
  description: string;
  imgUrl: string;
  keyword?: string;
}

const BlogGridContainer = () => {
  const { type } = useParams();
  const [visibleCount, setVisibleCount] = useState(4); // Number of items to show initially
  const [showAll, setShowAll] = useState(false); // Toggle between "Show More" and "Show Less"

  const data: BlogItem[] = [
    {
      title: "How to cope with the emotional toll of infertility",
      description: "Reviewed By Sipra Laddha, perinatal psychiatrist",
      imgUrl: "/assets/images/Home/PanelCarousel/carousel-1.jpg",
      keyword: "Fertility",
    },
    {
      title: "How to cope with the emotional toll of infertility",
      description: "Reviewed By Sipra Laddha, perinatal psychiatrist ",
      imgUrl: "/assets/images/Home/PanelCarousel/carousel-1.jpg",
      keyword: "Fertility",
    },
    {
      title: "How to cope with the emotional toll of infertility",
      description: "Reviewed By Sipra Laddha, perinatal psychiatrist ",
      imgUrl: "/assets/images/Home/PanelCarousel/carousel-1.jpg",
    },
    {
      title: "How to cope with the emotional toll of infertility",
      description: "Reviewed By Sipra Laddha, perinatal psychiatrist ",
      imgUrl: "/assets/images/Home/PanelCarousel/carousel-1.jpg",
    },
    {
      title: "How to cope with the emotional toll of infertility",
      description: "Reviewed By Sipra Laddha, perinatal psychiatrist ",
      imgUrl: "/assets/images/Home/PanelCarousel/carousel-1.jpg",
    },
  ];

  const toggleShowMore = () => {
    if (showAll) {
      setVisibleCount(4); // Reset to the initial count
    } else {
      setVisibleCount(data.length); // Show all items
    }
    setShowAll(!showAll); // Toggle the showAll state
  };

  return (
    <div className="flex flex-col items-center justify-center my-10 px-32">
      <h1 className="text-3xl font-bold text-center text-sky-900">
        {type ? textConvert(type) : "Default Title"}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {data.slice(0, visibleCount).map((item, index) => (
          <Link to={"/blog-detail/123"} className="p-1" key={index}>
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
        ))}
      </div>
      <Button
        className="w-36 bg-white text-emerald-400 border-2 border-emerald-400 rounded-full p-6 my-10 text-xl hover:bg-white hover:border-emerald-400 hover:text-emerald-400"
        onClick={toggleShowMore}
      >
        {showAll ? "Show Less" : "Show More"}
      </Button>
    </div>
  );
};

export default BlogGridContainer;
