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
  category: number;   // Đã sửa: từ string thành number
  seeAllLink: string;
  isOpened: boolean;
}

const Panel = ({
  title,
  iconUrl,
  category,
  seeAllLink,
  isOpened,
}: PanelProps) => {
  return (
    <Accordion
      type="single"
      collapsible
      {...(isOpened ? { defaultValue: "item-1" } : {})}
      className="w-full my-2"
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="rounded-none bg-white hover:no-underline">
          <div className="flex items-center">
            <img className="w-14" src={iconUrl} alt={title} />
            <p className="text-2xl font-semibold text-sky-900 ml-6">
              {title}
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="bg-white pb-2 px-4">
          <div className="flex flex-col">
            {/* Truyền prop category kiểu number xuống PanelCarousel */}
            <PanelCarousel category={category} />
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
  );
};

export default Panel;