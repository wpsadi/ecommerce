import type React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 bg-background">
        {children}
      </div>
    </div>
  );
}

export default Layout;
