"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export function ShareButton({ title, className = "" }: { title: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {}
  }
  return (
    <button type="button" onClick={share} aria-label="Share this product" className={`inline-flex items-center justify-center transition active:scale-90 ${className}`}>
      {copied ? <Check className="h-5 w-5 text-emerald-600" /> : <Share2 className="h-5 w-5 text-ink/70" />}
    </button>
  );
}
