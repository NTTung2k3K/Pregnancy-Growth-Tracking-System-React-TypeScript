import { FaSearch } from "react-icons/fa";
import NewsLatterBox from "./NewsLatterBox";
import RelatedPost from "./RelatedPost";
import TagButton from "./TagButton";
import { Link } from "react-router-dom";

const BlogDetailSidebar = () => {
  return (
    <>
      {" "}
      <div className="w-full px-4 lg:w-4/12">
        <div className="shadow-three dark:bg-gray-dark mb-10 mt-12 rounded-sm bg-white p-6 dark:shadow-none lg:mt-0">
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="Search here..."
              className="border-stroke dark:text-body-color-dark dark:shadow-two mr-4 w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
            />
            <button
              aria-label="search button"
              className="flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-sm bg-sky-700 text-emerald-400"
            >
              <FaSearch />
            </button>
          </div>
        </div>
        <div className="shadow-three dark:bg-gray-dark mb-10 rounded-sm bg-[#F3F2F2] dark:shadow-none">
          <h3 className="border-b border-body-color border-opacity-10 px-8 py-4 text-lg font-semibold text-sky-900 dark:border-white dark:border-opacity-10 dark:text-white">
            Related Posts
          </h3>
          <ul className="p-8">
            {Array.from({ length: 3 }).map((_) => (
              <li className="mb-6 border-b border-body-color border-opacity-10 pb-6 dark:border-white dark:border-opacity-10">
                <RelatedPost
                  title="Best way to boost your online sales."
                  image="/assets/images/Home/BlogDetail/post-01.webp"
                  slug="#"
                  date="12 Feb 2025"
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="shadow-three dark:bg-gray-dark mb-10 rounded-sm bg-[#F3F2F2] dark:shadow-none">
          <h3 className="border-b border-body-color border-opacity-10 px-8 py-4 text-lg font-semibold text-sky-900 dark:border-white dark:border-opacity-10 dark:text-white">
            Popular Category
          </h3>
          <ul className="px-8 py-6">
            {Array.from({ length: 5 }).map((_) => (
              <li>
                <Link
                  to="#0"
                  className="mb-3 inline-block text-base font-medium text-sky-900/60 hover:text-primary"
                >
                  Tailwind Templates
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="shadow-three dark:bg-gray-dark mb-10 rounded-sm bg-[#F3F2F2] dark:shadow-none">
          <h3 className="border-b border-body-color border-opacity-10 px-8 py-4 text-lg font-semibold text-black dark:border-white dark:border-opacity-10 dark:text-white">
            Popular Tags
          </h3>
          <div className="flex flex-wrap px-8 py-6">
            {Array.from({ length: 5 }).map((_) => (
              <TagButton text="Themes" />
            ))}
          </div>
        </div>

        <NewsLatterBox />
      </div>
    </>
  );
};

export default BlogDetailSidebar;
