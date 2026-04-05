import React, { useRef, useState } from "react";
import '../../styles/components/library.css';

export default function FileInput({ onFileSelect }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("Файл не выбран");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (onFileSelect) onFileSelect(file);
    }
  };

  return (
    <div className="file-input-container">
      <input
        ref={inputRef}
        type="file"
        className="file-input-hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="file-input-button"
      >
        Выбрать файл
      </button>
      <span className="file-input-name">{fileName}</span>
    </div>
  );
}