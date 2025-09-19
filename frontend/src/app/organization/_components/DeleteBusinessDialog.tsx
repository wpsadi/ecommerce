import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Business } from "../_types";

export default function DeleteBusinessDialog({
  business,
}: {
  business: Business;
}) {
  const [_open, _setOpen] = useState(false);
  const [_isLoading, _setIsLoading] = useState(false);

  // const handleDelete = async () => {
  //   setIsLoading(true);
  //   // TODO: Wire up delete logic
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     setOpen(false);
  //     alert("Business deleted (not implemented)");
  //   }, 1000);
  // };
  const router = useRouter();

  const deleteRoute = () => {
    router.push(`/businesses/${business.id}/delete`);
  };

  return (
    <>
      <Button
        variant="destructive"
        size="icon"
        onClick={() => {
          // setOpen(true)
          deleteRoute();
        }}
        title="Delete Business"
      >
        🗑️
      </Button>
      {/* <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Business</DialogTitle>
          </DialogHeader>
          <div>
            Are you sure you want to delete <b>{business.name}</b>?
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </>
  );
}
