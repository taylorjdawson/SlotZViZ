import React, { ReactNode, ButtonHTMLAttributes } from "react"

type ButtonProps = {
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      style={{
        border: "1px solid #eecbff",
        boxShadow:
          "0 0 10px 2px #5e38ff, 0 4px 80px rgba(147,64,223,.6), inset 0 0 10px 2px #5e38ff, inset 0 4px 40px rgba(147,64,223,.6)",
      }}
      {...props}
      className={`${className} relative overflow-hidden text-md p-2 flex flex-col mt-10 w-max h-max backdrop-blur-sm bg-gradient-to-r from-[#d7269349] to-[#0AFE9749] rounded-sm hover:shimmer opacity-75 hover:opacity-100`}
    >
      {children}
    </button>
  )
}

export default Button
