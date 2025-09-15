"use client";
import { useServerHealth } from "@/app/_hooks/server-health";

function ServerUp() {
  useServerHealth();
  return null;
}

export default ServerUp;
