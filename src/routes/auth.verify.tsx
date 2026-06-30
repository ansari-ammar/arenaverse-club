import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/auth/verify")({
  component: VerifyAlias,
});

function VerifyAlias() {
  const nav = useNavigate();
  useEffect(() => { nav({ to: "/auth/verify-otp", replace: true }); }, [nav]);
  return null;
}
