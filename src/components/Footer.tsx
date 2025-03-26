import { ROUTES } from "@/routes";
import { Calculator, Calendar, Search } from "lucide-react";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-[#F3F2F2] w-full flex px-60 py-10 justify-around">
      <div className="w-[500px]">
        <Link to={"/"} className="hover:cursor-pointer">
          <img
            src="/assets/images/navbar-logo.png"
            className="h-[200px] my-4 rounded-lg"
          />
        </Link>
        <p>
          BabyCenter is committed to providing the most helpful and trustworthy
          pregnancy and parenting information in the world. Our content is
          doctor approved and evidence based, and our community is moderated,
          lively, and welcoming. With thousands of award-winning articles and
          community groups, you can track your pregnancy and baby's growth, get
          answers to your toughest questions, and connect with moms, dads, and
          expectant parents just like you.
        </p>
      </div>
      <div className="flex flex-col leading-8">
        <p className="font-bold text-sky-950">Contact</p>
        <div className="flex items-center">
          <FaLocationDot className="mr-4" />
          <p>FPT University</p>
        </div>
        <div className="flex items-center">
          <FaPhoneAlt className="mr-4" />
          <p>(+84) 123123123</p>
        </div>
        <div className="flex items-center">
          <MdEmail className="mr-4" />
          <p>tungk@123</p>
        </div>
      </div>
      <div className="flex flex-col leading-8">
        <p className="font-bold text-sky-950">Tools</p>
        <Link
          to={ROUTES.DUE_DATE_CALCULATOR}
          className="text-sky-950 flex items-center"
        >
          <Calendar className="mr-4" />
          Due Date Calculator
        </Link>
        <Link
          to={ROUTES.NAME_GENERATOR}
          className="text-sky-950 flex items-center"
        >
          <Search className="mr-4" />
          Nickname Finder
        </Link>
        <Link
          to={ROUTES.COST_CALCULATOR}
          className="text-sky-950 flex items-center"
        >
          <Calculator className="mr-4" />
          Baby Cost Calculator
        </Link>
      </div>
    </div>
  );
};

export default Footer;
