import React from 'react';
import '../../styles/components/annotations.css';

export default function Note({ name, text }) {
  return (
    <li className="note-item">
      {text}
    </li>
  );
}