import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserPen } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes";
export default function ActionRow({ id }: { id: number }) {
  // const handleDelete = async (id: string) => {
  //   const confirmLeave = window.confirm(" Do you really want to delete?");
  //   if (!confirmLeave) return;

  //   try {
  //     await axios.delete(`${BASE_URL}/membershippackages/delete`, {
  //       params: { Id: id },
  //       headers: configHeaders(),
  //     });
  //     navigate("/dashboard/membership-packages");
  //     window.location.href = `/dashboard/membership-packages`;
  //     toast.success("Deleted successfully");
  //   } catch (error) {
  //     console.error("Failed to delete employee:", error);
  //     toast.error("Please login again to refresh token");
  //   }
  // };

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
            to={`${ROUTES.DASHBOARD_PAYMENT_DETAIL.replace(
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
