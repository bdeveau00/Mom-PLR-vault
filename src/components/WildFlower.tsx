import React from 'react'

type FlowerType = 'daisy' | 'lavender' | 'leaf'

interface WildFlowerProps {
  type: FlowerType
  className?: string
}

export const WildFlower: React.FC<WildFlowerProps> = ({ type, className = '' }) => {
  if (type === 'daisy') {
    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="15" fill="#FBBF24" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse
            key={angle}
            cx="50"
            cy="25"
            rx="10"
            ry="25"
            fill="white"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
      </svg>
    )
  }

  if (type === 'lavender') {
    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50 90C50 90 50 50 50 10"
          stroke="#4ade80"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {[20, 35, 50, 65, 80].map((y) => (
          <React.Fragment key={y}>
            <ellipse cx="45" cy={y} rx="5" ry="8" fill="#D8C5E0" transform={`rotate(-20 45 ${y})`} />
            <ellipse cx="55" cy={y} rx="5" ry="8" fill="#D8C5E0" transform={`rotate(20 55 ${y})`} />
          </React.Fragment>
        ))}
      </svg>
    )
  }

  if (type === 'leaf') {
    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50 90C50 90 80 60 50 10C20 60 50 90Z"
          fill="#B5D8B7"
          stroke="#8FB791"
          strokeWidth="1"
        />
        <path d="M50 90V10" stroke="#8FB791" strokeWidth="1" />
      </svg>
    )
  }

  return null
}
