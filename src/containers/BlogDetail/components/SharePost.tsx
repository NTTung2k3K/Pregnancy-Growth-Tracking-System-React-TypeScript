import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const SharePost = () => {
  return (
    <>
      <Link
        to="#0"
        aria-label="social-share"
        className="bg-sky-700 dark:bg-gray-dark mb-3 inline-flex h-9 w-9 items-center justify-center rounded-sm text-emerald-400 duration-300 hover:bg-sky-800  dark:hover:bg-sky-800 sm:ml-3"
      >
        <FaLinkedin />
      </Link>
      <Link
        to="#0"
        aria-label="social-share"
        className="bg-sky-700 dark:bg-gray-dark mb-3 ml-3 inline-flex h-9 w-9 items-center justify-center rounded-sm text-emerald-400 duration-300 hover:bg-sky-800  dark:hover:bg-sky-800"
      >
        <FaFacebookF />
      </Link>
      <Link
        to="#0"
        aria-label="social-share"
        className="bg-sky-700 dark:bg-gray-dark mb-3 ml-3 inline-flex h-9 w-9 items-center justify-center rounded-sm text-emerald-400 duration-300 hover:bg-sky-800  dark:hover:bg-sky-800"
      >
        <FaInstagram />
      </Link>
    </>
  );
};

export default SharePost;
