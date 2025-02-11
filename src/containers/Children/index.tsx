import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, truncate } from "@/lib/text";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CookiesService } from "@/services/cookies.service";
import { Child } from "../Dashboard/Children/components/IChild";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import axios from "axios";
import { ROUTES } from "@/routes";

const ChildrenGridContainer = () => {
  const id = CookiesService.get();
  const [children, setChildren] = useState<Child[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [showAll, setShowAll] = useState(false);

  const fetchChildren = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL + API_ROUTES.CHILD_BY_USER_ID}`,
        {
          params: { Id: id },
        }
      );
      setChildren(response.data.resultObj);
    } catch (error) {
      console.error("Failed to fetch employee:", error);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  if (children?.length === 0) {
    return (
      <>
        <div className="relative  h-96 flex aspect-square items-center justify-center my-10">
          <img
            width={500}
            src={"/assets/images/Home/Banner/carousel-3.jpeg"}
            className="rounded-lg"
          />
          <div className="absolute flex flex-col">
            <div className="flex flex-col justify-center items-center">
              <p className="text-4xl bg-slate-100/70 font-semibold mb-10 text-center w-96">
                No children were found
              </p>
              <Link
                to={`${ROUTES.CHILDREN_CREATE}`}
                className="bg-sky-800 hover:bg-sky-900 text-emerald-400 p-4 rounded-full font-bold"
              >
                Add new children
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const toggleShowMore = () => {
    if (showAll) {
      setVisibleCount(4); // Reset to the initial count
    } else {
      setVisibleCount(children.length); // Show all items
    }
    setShowAll(!showAll); // Toggle the showAll state
  };

  return (
    <div className="flex flex-col items-center justify-center my-10 px-32">
      <h1 className="text-3xl font-bold text-center text-sky-900">
        Your Children
      </h1>
      <Link
        to={`${ROUTES.CHILDREN_CREATE}`}
        className="mt-10 bg-sky-800 hover:bg-sky-900 text-emerald-400 p-4 rounded-full font-bold"
      >
        Add new child
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {children.slice(0, visibleCount).map((item, index) => (
          <Link
            to={`${ROUTES.CHILDREN_DETAIL.replace(":id", String(item.id))}`}
            className="p-1"
            key={index}
          >
            <Card>
              <CardContent className="w-full h-80 flex aspect-square p-0 border-r-4 border-b-4 border-r-emerald-300 border-b-emerald-300 rounded-xl">
                <div className="w-full flex flex-col">
                  <img
                    className="rounded-t-lg h-44 object-cover"
                    src={item.photoUrl || ""}
                    alt=""
                  />
                  <div className="p-4">
                    <p className="text-2xl text-sky-900 font-bold text-center mb-4">
                      {truncate(item.name, 47)}
                    </p>
                    <p className="text-sm">{formatDate(item.dueDate!)}</p>
                    <p className="text-sm">Blood Type: {item.bloodType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {children && children.length > 4 && (
        <Button
          className="w-36 bg-white text-emerald-400 border-2 border-emerald-400 rounded-full p-6 my-10 text-xl hover:bg-white hover:border-emerald-400 hover:text-emerald-400"
          onClick={toggleShowMore}
        >
          {showAll ? "Show Less" : "Show More"}
        </Button>
      )}
    </div>
  );
};

export default ChildrenGridContainer;
