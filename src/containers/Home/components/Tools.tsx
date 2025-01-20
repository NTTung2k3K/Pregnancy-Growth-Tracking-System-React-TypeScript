import { Link } from "react-router-dom";

const Tools = () => {
  const items = [
    {
      imageUrl: "/assets/images/Home/Tools/ovulation-calculator.webp",
      title: "Ovulation Calculator",
    },
    {
      imageUrl: "/assets/images/Home/Tools/date-calculator.webp",
      title: "Due Date Calculator",
    },
    {
      imageUrl: "/assets/images/Home/Tools/gender.png",
      title: "Gender Predictor",
    },
    {
      imageUrl: "/assets/images/Home/Tools/baby-names-finder.jpg",
      title: "Baby Names Finder",
    },
    {
      imageUrl:
        "/assets/images/Home/Tools/pregnancy-weight-gain-calculator.jpg",
      title: "Pregnancy Weight Gain Calculator",
    },
    {
      imageUrl: "/assets/images/Home/Tools/birth-plan-worksheet.webp",
      title: "Birth Plan Worksheet",
    },
    {
      imageUrl: "/assets/images/Home/Tools/ovulation-calculator.webp",
      title: "Ovulation Calculator",
    },
    {
      imageUrl: "/assets/images/Home/Tools/date-calculator.webp",
      title: "Due Date Calculator",
    },
    {
      imageUrl: "/assets/images/Home/Tools/gender.png",
      title: "Gender Predictor",
    },
    {
      imageUrl: "/assets/images/Home/Tools/baby-names-finder.jpg",
      title: "Baby Names Finder",
    },
    {
      imageUrl:
        "/assets/images/Home/Tools/pregnancy-weight-gain-calculator.jpg",
      title: "Pregnancy Weight Gain Calculator",
    },
    {
      imageUrl: "/assets/images/Home/Tools/birth-plan-worksheet.webp",
      title: "Birth Plan Worksheet",
    },
    {
      imageUrl: "/assets/images/Home/Tools/birth-plan-worksheet.webp",
      title: "Birth Plan Worksheet",
    },
    {
      imageUrl: "/assets/images/Home/Tools/birth-plan-worksheet.webp",
      title: "Birth Plan Worksheet",
    },
  ];

  return (
    <div className="w-full grid grid-cols-6 gap-4 mt-10">
      {items.map((item, index) => (
        <Link
          key={index}
          to={"/"}
          className="flex flex-col items-center justify-center"
        >
          <img className="w-32 mb-2" src={item.imageUrl} alt="" />
          <p className="h-12 text-center">{item.title}</p>
        </Link>
      ))}
    </div>
  );
};

export default Tools;
