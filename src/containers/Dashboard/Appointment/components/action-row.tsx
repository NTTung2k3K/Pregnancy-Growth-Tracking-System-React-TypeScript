import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, UserPen } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes";
export default function ActionRow({ id }: { id: number }) {
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
          <Link
            className="text-sky-800"
            to={`${ROUTES.DASHBOARD_APPOINTMENT_UPDATE.replace(":id", id)}`}
          >
            <DropdownMenuItem className="cursor-pointer">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
          </Link>
          <Link
            className="text-sky-800"
            to={`${ROUTES.DASHBOARD_APPOINTMENT_DETAIL.replace(":id", id)}`}
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
