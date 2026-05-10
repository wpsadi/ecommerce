import Script from "next/script";
import type React from "react";
import EnsureLoggedIn from "@/components/EnsureLoggedIn";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <EnsureLoggedIn>
      <div className="bg-background">
        {children}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </div>
    </EnsureLoggedIn>
  );
}

export default Layout;
