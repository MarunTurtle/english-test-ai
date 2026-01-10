"use client";

import { useEffect } from "react";

export default function LoginPage() {
  useEffect(() => {
    // Redirect to landing page
    window.location.href = "/";
  }, []);

  return null;
}
