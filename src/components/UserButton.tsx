import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/containers/Dashboard/Users/components/IUser";
import { ROUTES } from "@/routes";
import { API_ROUTES } from "@/routes/api";
import { BASE_URL } from "@/services/config";
import { CookiesService } from "@/services/cookies.service";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";

const UserButton = () => {
  const [level, setLevel] = useState("");
  const id = CookiesService.get();
  const [user, setUser] = useState<User>();
  const [isMember, setIsMember] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL + API_ROUTES.DASHBOARD_USER_DETAIL}`,
        {
          params: { Id: id },
        }
      );
      const fetchedUser = {
        ...response.data.resultObj,
      };
      setUser(fetchedUser);
      setLevel(fetchedUser.userMembershipResponses[0].package.packageLevel);
      setIsMember(response.data.resultObj.userMembershipResponses.length > 0);
      setIsExpired(
        new Date(fetchedUser.userMembershipResponses[0].endDate) < new Date()
      );
    } catch (error) {
      console.error("Failed to fetch employee:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    CookiesService.remove();
    window.location.href = `/`;
  };

  const getBadgeColor = (tier: string) => {
    switch (tier) {
      case "Bronze":
        return "bg-[#cd7f32] hover:bg-[#cd7f32]";
      case "Silver":
        return "bg-[#c0c0c0] hover:bg-[#c0c0c0]";
      case "Gold": // Corrected from "Bronze" to "Gold"
        return "bg-[#ffd700] hover:bg-[#ffd700]";
      default:
        return "bg-gray-300 hover:bg-gray-300"; // Fallback color
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-0 border-none rounded-full">
          <img
            src={user?.image ? user.image : "/assets/images/logo.png"}
            className="w-12 h-12 rounded-full "
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            <div className="">
              <p>My account</p>
              <div className="flex justify-center items-center my-2">
                {isMember && !isExpired ? (
                  <Badge className={`${getBadgeColor(level)}`}>
                    {level.toUpperCase()}
                  </Badge>
                ) : (
                  <Badge className={`${getBadgeColor("Bronze")}`}>Bronze</Badge>
                )}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="" />
          <DropdownMenuItem>
            <Link className="text-black font-normal w-full" to={ROUTES.PROFILE}>
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link
              className="text-black font-normal w-full"
              to={ROUTES.MY_GROWTH_CHART}
            >
              My charts
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserButton;
