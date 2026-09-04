"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { X } from "lucide-react";

type ReviewCardProps = {
  author: string;
  content: string;
};

const authorInitial = (author: string) => {
  const trimmed = author.trim();
  return trimmed ? trimmed[0].toUpperCase() : "?";
};

const ReviewCard = ({ author, content }: ReviewCardProps) => {
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    setOverflows(el.scrollHeight > el.clientHeight + 1);
  }, [content]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    }
    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <>
      <article className="rounded-xl border border-border/60 bg-background/50 p-3">
        <header className="flex items-center gap-2.5">
          <div
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary"
          >
            {authorInitial(author)}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Review by
            </p>
            <p className="truncate text-sm font-semibold text-foreground">
              {author}
            </p>
          </div>
        </header>

        <p
          ref={textRef}
          className="mt-2.5 line-clamp-4 text-sm leading-relaxed text-muted-foreground"
        >
          {content}
        </p>

        {overflows ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-2 text-sm font-medium text-primary hover:underline"
          >
            Read full review
          </button>
        ) : null}
      </article>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-black/65"
      >
        <div
          className="flex min-h-full items-center justify-center p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div
            role="document"
            className="flex max-h-[min(36rem,85svh)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl"
          >
            <header className="flex shrink-0 items-start justify-between gap-3 border-b border-border/50 px-4 py-3">
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Review by
                </p>
                <p className="truncate text-sm font-semibold text-foreground">
                  {author}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Close review"
              >
                <X className="size-4" />
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {content}
              </p>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ReviewCard;
