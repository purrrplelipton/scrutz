import { Icon } from "@iconify-icon/react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  buttonText: string;
  onButtonClick: () => void;
}

export function SuccessDialog({
  open,
  onOpenChange,
  title,
  buttonText,
  onButtonClick,
}: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader className="items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center">
            <Icon
              icon="material-symbols:check"
              className="text-4xl text-white"
            />
          </div>
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button onClick={onButtonClick}>{buttonText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
