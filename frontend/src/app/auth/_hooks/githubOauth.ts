import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export const useGithubOauth = () => {
  const githubOAuth = async () => {
    const call = await authClient.signIn.social({
      provider: "github",
      // newUserCallbackURL: new URL(window.location.origin).toString(),
      // errorCallbackURL: new URL("error", window.location.origin).toString(),
    });
    if (call.error) {
      throw new Error(call.error.message);
    }
    // if (call.data?.url) {
    //   window.location.href = call.data.url;
    // }
    return call.data;
  };
  const toastId = "github-oauth";
  return useMutation({
    mutationFn: async () => githubOAuth(),
    onMutate(_variables) {
      toast.loading("Connecting to GitHub...", { id: toastId });
    },
    onError(error) {
      toast.error("Failed to connect to GitHub", {
        id: toastId,
        description: error.message,
      });
    },
    // onSuccess(data) {
    //   if (data?.url) {
    //     toast.success("Redirecting to GitHub...", { id: toastId });
    //   } else {
    //     toast.error("Failed to connect to GitHub", { id: toastId });
    //   }
    // },
    onSettled() {
      toast.dismiss(toastId);
    },
  });
};
