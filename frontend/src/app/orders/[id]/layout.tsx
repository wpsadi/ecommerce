import type React from "react";
import EnsureLoggedIn from "@/components/EnsureLoggedIn";

function Layout({ children }: { children: React.ReactNode }) {
  return <EnsureLoggedIn>{children}</EnsureLoggedIn>;
}

export default Layout;
