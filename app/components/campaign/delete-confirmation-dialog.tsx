import { Icon } from "@iconify-icon/react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignName: string | null;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  campaignName,
  onConfirm,
  isPending,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-center text-xl">
            Stop Campaign
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Are You sure you want to delete &ldquo;{campaignName}&rdquo;
            campaign?
            <br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            variant="destructive"
          >
            {isPending ? (
              <Icon icon="svg-spinners:ring-resize" />
            ) : (
              "Delete Campaign"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
