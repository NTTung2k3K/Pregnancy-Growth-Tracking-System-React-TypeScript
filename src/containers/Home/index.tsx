import AdvisoryBoard from "./components/AdvisoryBoard";
import Banner from "./components/Banner";
import Panel from "./components/Panel";
import PlatformOverview from "./components/PlatformOverview";
import PregnancyTimeline from "./components/PregnancyTimeline";
import Tools from "./components/Tools";

const HomeContainer = () => {
 
  return (
    <div className="flex flex-col  mt-10 mb-40 px-32">
      <PlatformOverview />
      <div className="flex flex-col bg-[#F3F2F2] p-4">
        <Banner />
        <p className="text-center text-3xl font-bold text-sky-900">
          My pregnancy week by week
        </p>
        <PregnancyTimeline />
        <div className="flex flex-col items-center justify-center bg-white p-10 mb-10 ">
          <p className="text-center text-3xl font-bold text-sky-900">
            Popular tools
          </p>
          <Tools />
        </div>
        <Panel
          title={"Getting Pernancy"}
          iconUrl={"/assets/images/Home/Panel/pregnancy-test-icon.png"}
          category={"huan"}
          seeAllLink={"/blog/getting-pregnant"}
          isOpened={false}
        />
        <Panel
          title={"Pernancy"}
          iconUrl={"/assets/images/Home/Panel/getting-pregnant-icon.png"}
          category={"huan"}
          seeAllLink={"/blog/pregnancy"}
          isOpened={true}
        />
        <Panel
          title={"Baby"}
          iconUrl={"/assets/images/Home/Panel/baby-icon.png"}
          category={"huan"}
          seeAllLink={"/blog/baby"}
          isOpened={true}
        />
        <Panel
          title={"Toddler"}
          iconUrl={"/assets/images/Home/Panel/toddler-icon.png"}
          category={"huan"}
          seeAllLink={"/blog/toddler"}
          isOpened={false}
        />
        <Panel
          title={"Child"}
          iconUrl={"/assets/images/Home/Panel/child-icon.png"}
          category={"huan"}
          seeAllLink={"/blog/child"}
          isOpened={false}
        />
        <AdvisoryBoard />
      </div>
    </div>
  );
};

export default HomeContainer;
