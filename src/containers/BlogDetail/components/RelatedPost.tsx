import { formatDate } from "@/lib/text";
import { Link } from "react-router-dom";

const RelatedPost = ({
  image,
  slug,
  title,
  date,
}: {
  image: string;
  slug: string;
  title: string;
  date: string;
}) => {
  return (
    <div className="flex items-center lg:block xl:flex">
      <div className="mr-5 lg:mb-3 xl:mb-0">
        <div className="relative h-[60px] w-[70px] overflow-hidden rounded-md sm:h-[75px] sm:w-[85px]">
          <img src={image} alt={title} />
        </div>
      </div>
      <div className="w-full">
        <h5>
          <Link
            to={slug}
            className="mb-[6px] block text-base font-medium leading-snug text-sky-900 hover:text-primary dark:text-white dark:hover:text-primary"
          >
            {title}
          </Link>
        </h5>
        <p className="text-xs font-medium text-body-color">
          {formatDate(date)}
        </p>
      </div>
    </div>
  );
};

export default RelatedPost;
