import { Link } from "react-router-dom";

const AdvisoryBoard = () => {
  const items = [
    {
      id: "1",
      name: "Layan Alrahmani, M.D.",
      career: "ob-gyn, MFM",
      imageUrl:
        "/assets/images/Home/AdvisoryBoard/MAB-Layan-Alrahmani-photo.jpg",
    },
    {
      id: "1",
      name: "Cheryl Axelrod, M.D.",
      career: "ob-gyn",
      imageUrl: "/assets/images/Home/AdvisoryBoard/CherylMD2019-300px.jpg",
    },
    {
      id: "1",
      name: "Chandani DeZure, M.D., FAAP",
      career: "pediatric hospitalist",
      imageUrl:
        "/assets/images/Home/AdvisoryBoard/chandani-dezure-profile-picture-sep-2022.jpg",
    },
    {
      id: "1",
      name: "Shawnté James, M.D.",
      career: "neonatal and pediatric hospitalist",
      imageUrl: "/assets/images/Home/AdvisoryBoard/dr-shawnte-james.jpg",
    },
    {
      id: "1",
      name: "Liz Donner, M.D.",
      career: "pediatric hospitalist",
      imageUrl: "/assets/images/Home/AdvisoryBoard/LizDonner.png",
    },
    {
      id: "1",
      name: "Zakiyah Williams, MPH, IBCLC",
      career: "lactation consultant",
      imageUrl:
        "/assets/images/Home/AdvisoryBoard/expert-bio-zakiyah-williams.jpg",
    },
  ];

  return (
    <div className="bg-white mt-10 flex flex-col justify-center items-center">
      <p className="text-sky-900 text-3xl font-bold py-2 mt-4">
        Our Medical Advisory Board
      </p>
      <p className="w-[600px] text-center text-lg py-2">
        Meet our medical advisors — highly respected experts who ensure our
        content is complete and accurate.
      </p>
      <div className="grid grid-cols-2">
        {items.map((item, index) => (
          <Link
            key={index}
            to={item.id}
            className="flex items-center my-4 mx-20 text-black"
          >
            <img
              className="w-20 rounded-full mr-4"
              src={item.imageUrl}
              alt=""
            />
            <div className="flex flex-col">
              <p className="text-sky-900 text-xl font-semibold">{item.name}</p>
              <p>{item.career}</p>
            </div>
          </Link>
        ))}
      </div>

      <Link
        to={"/"}
        className="bg-slate-200 py-4 px-8 text-xl text-sky-900 font-semibold border border-sky-900 rounded-full mb-10"
      >
        See all
      </Link>
    </div>
  );
};

export default AdvisoryBoard;
