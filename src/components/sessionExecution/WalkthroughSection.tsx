import { PropsWithChildren } from "react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

export function WalkthroughSection({ children }: PropsWithChildren) {
  return (
    <div className="border-2 border-white">
      {children}
    </div>
  );
}

export function Walkthrough({ children }: PropsWithChildren) {
  return (
    <div>
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogHeader>
            {children}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

export function WalkthroughInstructionsDescription({ children }: PropsWithChildren) {
  return (
    <AlertDialogDescription className="flex flex-col gap-2">
      {children}
    </AlertDialogDescription>
  );
}
export function WalkthroughInstructionsTitle({ children }: PropsWithChildren) {
  return (
    <AlertDialogTitle>
      {children}
    </AlertDialogTitle>
  );
}
