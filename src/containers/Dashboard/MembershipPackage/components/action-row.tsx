import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes";
import { AlertWarning } from "@/components/ui/alert-warning";
export default function ActionRow({ id }: { id: number }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (isDialogOpen) {
      document.body.classList.add("pointer-events-none");
    } else {
      document.body.classList.remove("pointer-events-none");
    }

    return () => {
      document.body.classList.remove("pointer-events-none");
    };
  }, [isDialogOpen]);
  const handleDelete2 = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`${BASE_URL}/membershippackages`, {
        params: { Id: id },
        headers: configHeaders(),
      });
      toast.success("Deleted successfully");
      window.location.href = `/dashboard/membership-packages`;
    } catch (error) {
      console.error("Failed to delete MembershipPackage:", error);
      toast.error("Please login again to refresh token");
    } finally {
      setIsDialogOpen(false);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    event.preventDefault();
    const confirmLeave = window.confirm(" Do you really want to delete?");
    if (!confirmLeave) return;

    try {
      const res = await axios.delete(`${BASE_URL}/membershippackages/delete`, {
        params: { Id: id },
        headers: configHeaders(),
      });
      // navigate("/dashboard/membership-packages");
      console.log(res);

      if (res.data.status === 200) {
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
              id
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
              id
            )}`}
          >
            <DropdownMenuItem className="cursor-pointer">
              <UserPen className="h-4 w-4 mr-2" />
              Detail
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            className="cursor-pointer font-semibold"
            onClick={() => handleDelete(id)}
          >
            <Trash className="h-4 w-4 mr-2" />
            <p>Delete</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
