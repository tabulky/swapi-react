"use client";
import { useEffect, useRef, useState } from "react";
import { UseResourceResult } from "@/lib/fetch-store/types";

export function TableLoadingState(
  { resource }: { resource: UseResourceResult },
) {
  const [showSuccess, setShowSuccess] = useState(false);
  const prevState = useRef(resource.state);

  useEffect(() => {
    if (prevState.current === "loading" && resource.state === "success") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowSuccess(true);
    }
    prevState.current = resource.state;
  }, [resource.state]);

  if (resource.state === "loading") {
    return <span className="animate-flash-in">⏳ Loading…</span>;
  }
  if (resource.state === "error") {
    return <span>❌ Error: {resource.error?.message}</span>;
  }
  if (showSuccess) {
    return (
      <span
        className="animate-flash-success"
        onAnimationEnd={() => setShowSuccess(false)}
      >
        ✅ Loaded
      </span>
    );
  }

  return null;
}
