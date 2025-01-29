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

const UserButton = () => {
  const id = CookiesService.get();

  const [user, setUser] = useState<User>();

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
        role: response.data.resultObj.role?.name || null,
      };
      setUser(fetchedUser);
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-0 border-none rounded-full">
          <img
            src={user?.image ? user.image : "/assets/images/logo.png"}
            className="w-10 h-10 rounded-full "
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link
              className="text-black font-normal w-full"
              to={ROUTES.APPOINTMENTS}
            >
              Appointments
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link className="text-black font-normal w-full" to={ROUTES.PROFILE}>
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserButton;
