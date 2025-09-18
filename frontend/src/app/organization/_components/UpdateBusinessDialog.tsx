import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function UpdateBusinessDialog({ business }: { business: any }) {
  const [_open, _setOpen] = useState(false);
  const [_isLoading, _setIsLoading] = useState(false);
  const router = useRouter();

  const updateRoute = () => {
    router.push(`/businesses/${business.id}/update`);
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          // setOpen(true)
          updateRoute();
        }}
        title="Edit Business"
      >
        ✏️
      </Button>
      {/* <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Business</DialogTitle>
          </DialogHeader>
          <div>
            Edit business <b>{business.name}</b> (not implemented)
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
              variant="default"
              onClick={handleUpdate}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </>
  );
}
