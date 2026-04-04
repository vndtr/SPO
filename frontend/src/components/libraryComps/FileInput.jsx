import React, { useRef, useState } from "react";

export default function FileInput() {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("Файл не выбран");

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setFileName(file.name);
        }}
      />

      <button
        onClick={() => inputRef.current?.click()}
        className="px-4 py-2 border border-accent-1 rounded-2xl hover:bg-accent-1/10 transition"
      >
        Выбрать файл
      </button>

      <span className="text-sm text-gray-500 truncate max-w-[200px]">
        {fileName}
      </span>
    </div>
  );
}