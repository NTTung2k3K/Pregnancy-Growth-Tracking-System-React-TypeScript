import axios from "axios";
import { BASE_URL, configHeaders } from "@/services/config";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash, UserPen } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes";
export default function ActionRow({ id }: { id: number }) {
  const handleDelete = async (id: string) => {
    const confirmLeave = window.confirm(" Do you really want to delete?");
    if (!confirmLeave) return;

    try {
      const res = await axios.delete(`${BASE_URL}/membershippackages/delete`, {
        params: { Id: id },
        headers: configHeaders(),
      });

      if (res.data.statusCode === 200) {
        toast.success("Deleted successfully");
        setTimeout(() => {
          window.location.href = `/dashboard/membership-packages`;
        }, 1000); // Đợi một chút để thông báo hiển thị
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Failed to delete employee:", error);
      toast.error("Please login again to refresh token");
    }
  };

  return (
    <>
      {/* <AlertWarning
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDelete}
        loading={isLoading}
      /> */}
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
            to={`${ROUTES.DASHBOARD_MEMBERSHIPPACKAGE_UPDATE.replace(
              ":id",
              id.toString()
            )}`}
          >
            <DropdownMenuItem className="cursor-pointer">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
          </Link>
          <Link
            className="text-sky-800"
            to={`${ROUTES.DASHBOARD_MEMBERSHIPPACKAGE_DETAIL.replace(
              ":id",
              id.toString()
            )}`}
          >
            <DropdownMenuItem className="cursor-pointer">
              <UserPen className="h-4 w-4 mr-2" />
              Detail
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            className="cursor-pointer font-semibold"
            onClick={() => handleDelete(id.toString())}
          >
            <Trash className="h-4 w-4 mr-2" />
            <p>Delete</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
