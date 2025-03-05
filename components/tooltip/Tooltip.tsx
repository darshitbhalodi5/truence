import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

export const Tooltip = ({ children, text }:TooltipProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div 
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        className="cursor-pointer"
      >
        {children}
      </div>
      {isTooltipVisible && (
        <div 
          className="absolute z-10 bg-[#00041B] text-white text-xs px-2 py-1 rounded-md 
                     transform -translate-x-1/2 left-1/2 -top-8 
                     transition-all duration-200 ease-in-out whitespace-nowrap"
        >
          {text}
          <div 
            className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 
                       rotate-45 bg-[#00041B] w-2 h-2"
          ></div>
        </div>
      )}
    </div>
  );
};
