import React, { useEffect } from "react";

export default function Slider({ min, max, value, handleChange }) {
  useEffect(() => {
    const ele = document.querySelector(".buble");
    if (ele) {
      ele.style.left = `${Number((100 * value) / (max - min ))}%`;
      if(value<=(max-min)/2)
        ele.style.left = `calc(${ele.style.left} + 4%)`;
      else
        ele.style.left = `calc(${ele.style.left} - 4%)`;
    }
  });
  return (
    <div className="slider-container">
      <input
        type="range"
        className="slider"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
      />
      <div className="buble">{value}</div>
    </div>
  );
}
