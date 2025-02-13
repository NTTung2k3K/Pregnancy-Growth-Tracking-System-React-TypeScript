const Topbar = () => {
  const onClick = () => {
    console.log("click");
  };

  return (
    <div
      onClick={onClick}
      className="fixed w-full bg-topbar bg-cover h-[45px] flex justify-center items-center text-white font-semibold cursor-pointer z-50"
    >
      <span className="underline mr-1">Join now</span>
      to personalize BabyCenter for your pregnancy
    </div>
  );
};

export default Topbar;
