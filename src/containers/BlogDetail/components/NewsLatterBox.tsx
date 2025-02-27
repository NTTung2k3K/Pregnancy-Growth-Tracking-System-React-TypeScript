import { User } from "@/containers/Dashboard/Users/components/IUser";
import { formatDate } from "@/lib/text";
import { ROUTES } from "@/routes";
import { API_ROUTES } from "@/routes/api";
import { BASE_URL } from "@/services/config";
import { CookiesService } from "@/services/cookies.service";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NewsLatterBox = () => {
  const userId = CookiesService.get();
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [isMember, setIsMember] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL + API_ROUTES.DASHBOARD_USER_DETAIL}`,
        {
          params: { Id: userId },
        }
      );
      const fetchedUser = {
        ...response.data.resultObj,
      };
      setIsExpired(
        new Date(fetchedUser.userMembershipResponses[0].endDate) < new Date()
      );
      setIsMember(response.data.resultObj.userMembershipResponses.length > 0);
      setUser(fetchedUser);
    } catch (error) {
      console.error("Failed to fetch employee:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const getColor = (tier: string) => {
    switch (tier) {
      case "Bronze":
        return "text-[#cd7f32] hover:text-[#cd7f32]";
      case "Silver":
        return "text-[#c0c0c0] hover:text-[#c0c0c0]";
      case "Gold": // Corrected from "Bronze" to "Gold"
        return "text-[#ffd700] hover:text-[#ffd700]";
      default:
        return "text-gray-300 hover:text-gray-300"; // Fallback color
    }
  };

  return (
    <div
      className="wow fadeInUp shadow-three dark:bg-gray-dark relative z-10 rounded-sm bg-[#F3F2F2] p-8 sm:p-11 lg:p-8 xl:p-11"
      data-wow-delay=".2s"
    >
      <h3 className="mb-4 text-2xl font-bold leading-tight text-sky-900 dark:text-white">
        Subscribe to receive effective tools
      </h3>
      <p className="mb-4 border-b border-body-color border-opacity-25 pb-11 text-base leading-relaxed text-body-color dark:border-white dark:border-opacity-25">
        We provide advanced features to ensure comprehensive monitoring of fetal
        development.
      </p>
      <div>
        {userId && (
          <p className="text-center my-4 text-lg text-emerald-400 font-bold">
            You are currently using{" "}
            <span
              className={
                isMember && !isExpired
                  ? getColor(
                      user?.userMembershipResponses[0]?.package.packageLevel ||
                        ""
                    )
                  : "text-[#cd7f32] hover:text-[#cd7f32]"
              }
            >
              {isMember && !isExpired
                ? user?.userMembershipResponses[0]?.package.packageName
                : "Bronze"}
            </span>
            {isMember && !isExpired && (
              <>
                , expired at :{" "}
                {formatDate(user?.userMembershipResponses[0]?.endDate || "")}
              </>
            )}
          </p>
        )}
        {(!isMember || isExpired) && (
          <Link
            className=" mt-10 shadow-submit dark:shadow-submit-dark mb-5 flex w-full cursor-pointer items-center justify-center rounded-sm bg-sky-800 px-9 py-4 text-base font-medium text-emerald-400 duration-300 hover:bg-sky-900"
            to={ROUTES.MEMBERSHIP}
          >
            Subscribe
          </Link>
        )}
      </div>
    </div>
  );
};

export default NewsLatterBox;
