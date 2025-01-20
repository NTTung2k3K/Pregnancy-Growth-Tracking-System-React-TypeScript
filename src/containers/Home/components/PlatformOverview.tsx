const PlatformOverview = () => {
  const items = [
    {
      data: "32+ million",
      description: "users every month",
      imgUrl: "/assets/images/Home/PlatformOverview/user-group.png",
    },
    {
      data: "40+",
      description: "medical advisors",
      imgUrl: "/assets/images/Home/PlatformOverview/medical-advisors.jpg",
    },
    {
      data: "2,500+",
      description: "expert-reviewed articles",
      imgUrl:
        "/assets/images/Home/PlatformOverview/expert-reviewed-articles.png",
    },
  ];

  return (
    <div className="flex items-center bg-emerald-200 p-4">
      <p className="text-2xl font-semibold text-sky-900 w-72 text-center">
        BabyCenter is your parenting partner.
      </p>
      <div className="flex justify-around items-center">
        {items.map((item,index) => (
          <div key={index} className="w-64 flex items-center bg-white border border-emerald-300 p-2 rounded-lg mx-6">
            <img src={item.imgUrl} className="h-12 mr-10" />
            <div className="">
              <p className="text-xl font-semibold text-sky-900">{item.data}</p>
              <p className="text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformOverview;
