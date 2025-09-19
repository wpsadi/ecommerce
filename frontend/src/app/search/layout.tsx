import type React from "react";
import { Suspense } from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="text-center py-12 items-center flex justify-center">
          <p className="text-slate-500 text-lg"> Loading... </p>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export default Layout;
