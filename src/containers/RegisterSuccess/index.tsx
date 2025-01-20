import { Link } from "react-router-dom";
import "./index.css";

const RegisterSuccessContainer = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-[#92a4ad] bg-[#416475]">
      <p className=" text-3xl font-semibold text-center text-emerald-400">
        Congratulations on successfully registering an account on BabyCare.
      </p>
      <img className="w-96 h-60 my-10 rounded-xl" src="/assets/images/LogoBabyCare.jpg" />
      <p className="zoom-area">
        Once your account is verified you can log in to your account and explore
        the great features we have to offer. If you have any questions, please
        contact our customer support.
      </p>
      <div className="link-container">
        <Link to={"/"} className="more-link">
          Home
        </Link>
      </div>
    </div>
  );
};

export default RegisterSuccessContainer;
