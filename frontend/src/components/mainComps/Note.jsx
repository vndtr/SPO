import React from 'react'

export default function Note({name, text}) {
  return (
    <li
    className="relative before:content-['•'] before:text-blue before:text-1xl before:absolute before:-left-4">{text}</li>
  )
}
