"use client";

import { useCallback, useState } from "react";
import type { ActiveForm } from "@/app/(main)/_types/home.types";

export function useHomeHero() {
  const [activeForm, setActiveForm] = useState<ActiveForm>("none");

  const toggleForm = useCallback((form: Exclude<ActiveForm, "none">) => {
    setActiveForm((curr) => (curr === form ? "none" : form));
  }, []);

  return { activeForm, toggleForm };
}
