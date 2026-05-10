import { useRef, useState } from "react";

interface EditableFieldProps {
  value: string;
  placeholder?: string;
  onChange: (val: string) => void;
  className?: string;
  as?: "input" | "textarea";
  strike?: boolean;
}

export function EditableField({
  value,
  placeholder,
  onChange,
  className = "",
  as = "input",
  strike = false,
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const _handleFocus = () => setEditing(true);
  const handleBlur = () => setEditing(false);

  const commonProps = {
    value,
    placeholder,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    className: `bg-transparent border-none outline-none w-full p-0 m-0 ${className}`,
    onBlur: handleBlur,
    autoFocus: editing,
    style: { color: "inherit", font: "inherit" },
  };

  return (
    <span
      className={`relative group ${strike ? "line-through text-muted-foreground" : ""}`}
      onClick={() => {
        setEditing(true);
        setTimeout(
          () =>
            (as === "textarea"
              ? textareaRef.current
              : inputRef.current
            )?.focus(),
          0,
        );
      }}
      style={{ cursor: "text" }}
    >
      {editing ? (
        as === "textarea" ? (
          <textarea ref={textareaRef} {...commonProps} rows={2} />
        ) : (
          <input ref={inputRef} {...commonProps} />
        )
      ) : (
        <span className={value ? "" : "text-muted-foreground italic"}>
          {value || placeholder || "Click to edit"}
        </span>
      )}
    </span>
  );
}
