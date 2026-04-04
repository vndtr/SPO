import React from 'react'

export default function Progressbar({progress}) {
  return (
    <div className="w-full my-2 bg-gray-200 rounded-full h-2 overflow-hidden">
  <div
    className="bg-blue h-full rounded-full transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>
  )
}
