import { OctagonAlertIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useEffect } from "react";

type TAlertWarningProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  acceptTitle?: string;
  description?: string;
};
export const AlertWarning = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  acceptTitle = "Chấp nhận",
  description = "Bạn sẽ không thể khôi phục lại hành động này",
}: TAlertWarningProps) => {
  useEffect(() => {
    if (isOpen) {
      // Lock background content by adding pointer-events-none class to the body
      document.body.classList.add("pointer-events-none");
    } else {
      // Unlock background content by removing pointer-events-none class
      document.body.classList.remove("pointer-events-none");
    }

    // Cleanup to remove class when component is unmounted or dialog is closed
    return () => {
      document.body.classList.remove("pointer-events-none");
    };
  }, [isOpen]);
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="w-1/3 rounded-lg bg-white p-6 shadow-lg">
        <AlertDialogHeader>
          <OctagonAlertIcon color="rgb(250,207,36)" width="100%" size="100" />
          <AlertDialogTitle className="text-center text-3xl">
            Cảnh báo
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center font-normal">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction
            className="w-1/2 border-2 border-red-500 bg-white text-red-500 hover:bg-red-500 hover:text-white"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={loading}
          >
            {acceptTitle}
          </AlertDialogAction>
          <AlertDialogCancel
            className="w-1/2"
            disabled={loading}
            onClick={onClose}
          >
            Hủy
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
