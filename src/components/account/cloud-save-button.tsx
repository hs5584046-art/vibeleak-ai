"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PersonalityReport } from "@/lib/assessment/types";
import { LockIcon } from "@/components/ui/icons";

export function CloudSaveButton({ report }: { report: PersonalityReport }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "signin" | "error">("idle");

  async function save() {
    setStatus("saving");
    const response = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assessmentId: "personality-dna", report })
    });

    if (response.status === 401) {
      setStatus("signin");
      return;
    }

    if (!response.ok) {
      setStatus("error");
      return;
    }

    setStatus("saved");
    router.refresh();
  }

  if (status === "signin") {
    return (
      <a className="button button-primary" href="/auth">
        <LockIcon /> Sign in to save
      </a>
    );
  }

  return (
    <button type="button" className="button button-primary" disabled={status === "saving" || status === "saved"} onClick={save}>
      <LockIcon />
      {status === "saving" ? "Saving…" : status === "saved" ? "Saved to account" : status === "error" ? "Retry cloud save" : "Save to my account"}
    </button>
  );
}
