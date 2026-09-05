// src/components/dashboard/posters/editable-text.tsx
// Click-to-edit text element — this is what makes headline/subheadline/CTA
// live and editable instead of baked into a canvas image. Click once to
// enter edit mode, click away or press Enter to commit.
"use client";

import { useState, useRef, useEffect } from "react";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  as?: "div" | "span";
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  multiline?: boolean;
}

export function EditableText({
  value,
  onChange,
  className,
  style,
  placeholder,
  multiline = false,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => setDraft(value), [value]);

  useEffect(() => {
    if (isEditing) ref.current?.focus();
  }, [isEditing]);

  function commit() {
    setIsEditing(false);
    if (draft !== value) onChange(draft);
  }

  if (isEditing) {
    const Field = multiline ? "textarea" : "input";
    return (
      <Field
        ref={ref as never}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !multiline) commit();
          if (e.key === "Escape") {
            setDraft(value);
            setIsEditing(false);
          }
        }}
        className={className}
        style={{ ...style, background: "transparent", border: "1px dashed currentColor", outline: "none", resize: "none" }}
        placeholder={placeholder}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`${className} cursor-text transition-opacity hover:opacity-80`}
      style={style}
      title="Click to edit"
    >
      {value || <span className="opacity-50">{placeholder}</span>}
    </div>
  );
}