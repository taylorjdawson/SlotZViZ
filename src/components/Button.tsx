import React, { ReactNode, ButtonHTMLAttributes } from "react";
import "./Button.css"; // Importing the CSS file where we will define our animation

type ButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      {...props}
      className={`${className} relative overflow-hidden text-md p-2 flex flex-col mt-10 w-max h-max backdrop-blur-sm bg-gradient-to-r from-[#d7269349] to-[#0AFE9749] rounded-sm hover:shimmer opacity-75 hover:opacity-100`}
    >
      {children}
    </button>
  );
};

export default Button;
