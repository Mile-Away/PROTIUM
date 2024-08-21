// RainbowCard.tsx
import React from 'react';

const RainbowCard: React.FC = () => {
  return (
    <div className="relative h-48 w-72 overflow-hidden rounded-lg bg-white p-1">
      <div
        className="animate-spin-slow absolute inset-0 rounded-lg bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"
        style={{ backgroundSize: '400% 400%' }}
      ></div>
      <div className="absolute inset-0 m-1 rounded-lg bg-white"></div>
      <div className="relative h-full w-full rounded-lg bg-white p-4">
        {/* 这里放置卡片内容 */}
        <p>Card Content</p>
      </div>
    </div>
  );
};

export default RainbowCard;
