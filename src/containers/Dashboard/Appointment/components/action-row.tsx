import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pen, UserPen } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes";
import { FaUserDoctor } from "react-icons/fa6";
export default function ActionRow({
  id,
  status,
}: {
  id: number;
  status: string;
}) {
  const isAdmin = localStorage.getItem("role") === "Admin";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-4 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="text-sky-800 pointer-events-auto"
        >
          {(status == "Confirmed" || status == "InProgress") && (
            <Link
              className="text-sky-800"
              to={`${ROUTES.DASHBOARD_APPOINTMENT_UPDATE.replace(
                ":id",
                id.toString()
              )}`}
            >
              {isAdmin && (
                <DropdownMenuItem className="cursor-pointer">
                  <Pen className="h-4 w-4 mr-2" />
                  Change Doctor
                </DropdownMenuItem>
              )}
            </Link>
          )}

          <Link
            className="text-sky-800"
            to={`${ROUTES.DASHBOARD_APPOINTMENT_DETAIL.replace(
              ":id",
              id.toString()
            )}`}
          >
            <DropdownMenuItem className="cursor-pointer">
              <UserPen className="h-4 w-4 mr-2" />
              Detail
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
