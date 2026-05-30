"use client";

import { useEffect, useState } from "react";

export function ClientYear() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    if (currentYear !== 2026) {
      const handle = requestAnimationFrame(() => {
        setYear(currentYear);
      });
      return () => cancelAnimationFrame(handle);
    }
  }, []);

  return <>{year}</>;
}

export default ClientYear;
