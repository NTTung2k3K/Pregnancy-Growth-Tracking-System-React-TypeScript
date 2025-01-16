import { IoSearch } from "react-icons/io5";
import { Input } from "./ui/input";
import { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { Link } from "react-router-dom";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LuTextSearch } from "react-icons/lu";

const SearchContainter = () => {
  const menu = [
    {
      title: "Community",
      items: ["Birth Clubs", "Birth Clubs", "Birth Clubs"],
    },
    {
      title: "Community",
      items: ["Birth Clubs", "Birth Clubs", "Birth Clubs"],
    },
    {
      title: "Community",
      items: ["Birth Clubs", "Birth Clubs", "Birth Clubs"],
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <Sheet>
      <SheetTrigger className="mr-2 hover:bg-slate-100 rounded-full hover:cursor-pointer p-2 bg-transparent border-none">
        <LuTextSearch />
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>
            <img
              src="/src/assets/images/navbar-logo.png"
              className="h-[60px]"
            />
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="How can we help?"
              className="pl-8"
            />
            <IoSearch className="absolute top-3 left-3 " />
          </div>

          <div className="flex flex-col mt-2">
            {menu.length > 0 ? (
              menu.map((item: any, index: any) => (
                <div key={index} className="flex flex-col">
                  <div
                    className="flex justify-between items-center bg-white p-4 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleToggle(index)}
                  >
                    <p className="font-semibold">{item.title}</p>
                    <FaAngleDown className="text-sky-950" />
                  </div>

                  {activeIndex === index &&
                    item.items?.map((subItem: any) => (
                      <Link
                        to={"/"}
                        className="p-4 text-sky-950 hover:text-sky-950 hover:bg-emerald-300"
                      >
                        {subItem}
                      </Link>
                    ))}
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center p-20 text-3xl font-semibold text-slate-500">
                Opps
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SearchContainter;
