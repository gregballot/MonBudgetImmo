import React from "react";

interface MoonIconProps {
  width?: number;
  height?: number;
  className?: string;
}

const MoonIcon: React.FC<MoonIconProps> = ({
  width = 20,
  height = 20,
  className = ""
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={width}
    height={height}
    className={className}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

export default MoonIcon;
