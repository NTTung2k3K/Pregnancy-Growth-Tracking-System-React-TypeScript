import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PanelCarousel from "./PanelCarousel";
import { Link } from "react-router-dom";

interface PanelProps {
  title: string;
  iconUrl: string;
  category: string;
  seeAllLink: string;
  isOpened: boolean;
}

interface Keyword {
  title: string;
  isActive: boolean;
}

const Panel = ({
  title,
  iconUrl,
  category,
  seeAllLink,
  isOpened,
}: PanelProps) => {
  const [keywords, setKeywords] = useState<Keyword[]>([
    { title: "All", isActive: true },
    { title: "Fertility", isActive: false },
    { title: "How to Get Pregnant", isActive: false },
  ]);

  const handleKeywordClick = (index: number) => {
    setKeywords((prevKeywords) =>
      prevKeywords.map((keyword, i) => ({
        ...keyword,
        isActive: i === index,
      }))
    );
  };

  return (
    <>
      <Accordion
        type="single"
        collapsible
        {...(isOpened ? { defaultValue: "item-1" } : {})}
        className="w-full my-2"
      >
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="rounded-none bg-white hover:no-underline">
            <div className="flex items-center">
              <img className="w-14" src={iconUrl} alt="" />
              <p className="text-2xl font-semibold text-sky-900 ml-6">
                {title}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white pb-2 px-4">
            <div className="flex flex-col">
              <div className="flex mb-10">
                {keywords.map((keyword, index) => (
                  <div
                    key={index}
                    onClick={() => handleKeywordClick(index)}
                    className={`cursor-pointer border-2 rounded-full py-2 px-4 mx-2 font-semibold ${
                      keyword.isActive
                        ? "bg-emerald-400 text-sky-900 border-sky-900"
                        : "bg-white text-sky-900 border-sky-900"
                    }`}
                  >
                    {keyword.title}
                  </div>
                ))}
              </div>
              <PanelCarousel
                keyword={keywords.find((k) => k.isActive)?.title || ""}
              />
              <div className="flex justify-center items-center">
                <Link
                  to={seeAllLink}
                  className="bg-slate-200 py-4 px-8 text-xl text-sky-900 font-semibold border border-sky-900 rounded-full mb-10"
                >
                  See all
                </Link>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default Panel;
