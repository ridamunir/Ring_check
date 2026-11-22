
"use client";
import { useState } from "react";

// FAQ questions are <h3> headings (inside the accordion button) — never plain buttons.
export default function FaqAccordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="overflow-hidden rounded-lg border bg-white">
            <h3 className="m-0">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold"
              >
                <span>{item[0]}</span>
                <span aria-hidden="true" className="ml-4 text-xl">{isOpen ? "−" : "+"}</span>
              </button>
            </h3>
            <div
              className="grid transition-all duration-300 ease-in-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-4 pb-4 text-slate-700">{item[1]}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
