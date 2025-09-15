"use client";

import { Github, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MagicCard } from "@/components/ui/magic-card";
import { useGithubOauth } from "../_hooks/githubOauth";

export function AuthForm() {
  const { theme } = useTheme();
  const { mutate, isPending } = useGithubOauth();

  return (
    <Card className="p-0 max-w-sm w-full shadow-none border-none">
      <MagicCard
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        className="p-0"
      >
        <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
          <CardTitle>Signup / Signin</CardTitle>
          <CardDescription>
            Continue to your account to continue
          </CardDescription>
        </CardHeader>
        {/* <CardContent className="p-4"> */}
        {/* <form>
            <div className="grid gap-4">
              <div className="grid gap-2">
              
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
            </div>
          </form> */}
        {/* </CardContent> */}
        <CardFooter className="p-4 border-t border-border [.border-t]:pt-4">
          <Button
            className="w-full"
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending && <Loader2 className="animate-spin" />} Continue with
            Github <Github />
          </Button>
        </CardFooter>
      </MagicCard>
    </Card>
  );
}
