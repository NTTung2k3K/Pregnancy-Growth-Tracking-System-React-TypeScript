import { Link } from "react-router-dom";
import "./index.css";

const NotFoundContainer = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-[#92a4ad] bg-[#416475]">
      <h1>Page Not Found</h1>
      <p className="zoom-area">
        We're sorry, the page you were looking for isn't found here. The link
        you followed may either be broken or no longer exists. Please try again,
        or take a look at our.
      </p>
      <section className="error-container">
        <span>4</span>
        <span>
          <span className="screen-reader-text">0</span>
        </span>
        <span>4</span>
      </section>
      <div className="link-container">
        <Link to={"/"} className="more-link">
          Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundContainer;
