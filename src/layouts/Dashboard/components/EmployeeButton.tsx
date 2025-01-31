import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/routes";
import {
  CookiesEmployee2Service,
  CookiesEmployeeService,
} from "@/services/cookies.service";
import { Link } from "react-router-dom";

const EmployeeButton = () => {
  const logout = () => {
    CookiesEmployeeService.remove();
    CookiesEmployee2Service.remove();

    window.location.href = ROUTES.EMPLOYEE_LOGIN;
  };

  const isLogged = CookiesEmployeeService.get();

  return (
    <>
      {isLogged ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="p-0 border-none rounded-full">
            <img src="/assets/images/logo.png" className="h-10 rounded-full" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to={ROUTES.EMPLOYEE_LOGIN} className="">
          <Button>Login</Button>
        </Link>
      )}
    </>
  );
};

export default EmployeeButton;
