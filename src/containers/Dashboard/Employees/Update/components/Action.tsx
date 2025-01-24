import { ConfirmModal } from "@/components/ConfirmModal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
//import { useState } from "react";

interface ActionsProps {
  id: string;
}

export const Actions = ({ /*id*/ }: ActionsProps) => {
  //const [isLoading, setIsLoading] = useState(false);

  //const onClick = async () => {
    // try {
    //   setIsLoading(true);
    //   if (isPublished) {
    //     await axios.patch(
    //       `/api/courses/${courseId}/unpublish`
    //     );
    //     toast.success("Course unpublished");
    //   } else {
    //     await axios.patch(
    //       `/api/courses/${courseId}/publish`
    //     );
    //     toast.success("Course published");
    //     confetti.onOpen()
    //   }
    //   router.refresh();
    // } catch {
    //   toast.error("Something went wrong");
    // } finally {
    //   setIsLoading(false);
    // }
  //};

  const onDelete = async () => {
    // try {
    //   setIsLoading(true);
    //   await axios.delete(`/api/courses/${courseId}`);
    //   toast.success("Course deleted");
    //   router.refresh();
    //   router.push(`/teacher/courses`);
    // } catch {
    //   toast.error("Something went wrong");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmModal onConfirm={onDelete}>
        <Button size="lg" className="bg-sky-900 text-emerald-400">
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
