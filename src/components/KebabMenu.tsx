"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function KebabMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, [open]);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Actions"
        aria-expanded={open}
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-text-muted)",
          background: open ? "rgba(255,255,255,0.06)" : "transparent",
          border: 0,
          cursor: "pointer",
          fontSize: 18,
          letterSpacing: "0.05em",
          transition: "background 0.15s ease, color 0.15s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = open
            ? "rgba(255,255,255,0.06)"
            : "transparent")
        }
      >
        <span aria-hidden style={{ lineHeight: 1 }}>
          ···
        </span>
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 6px)",
            minWidth: 160,
            borderRadius: 12,
            border: "1px solid var(--color-border-soft)",
            background: "rgba(13,13,15,0.96)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            padding: 4,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            zIndex: 50,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
