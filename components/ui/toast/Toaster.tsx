"use client"

import { useTheme } from "@/context/ThemeContext";
import { AlertTriangleIcon, CheckIcon, InfoIcon, XIcon } from "lucide-react";
// import { Toaster as Sonner, ToasterProps } from "sonner"

// const Toaster = ({ ...props }: ToasterProps) => {
//   const { theme } = useTheme();
//   return (
//     <Sonner theme={theme} position="bottom-right"
//       className="toaster group"
//       style={
//         {
//           "--normal-bg": "var(--popover)",
//           "--normal-text": "var(--popover-foreground)",
//           "--normal-border": "var(--border)",
//         } as React.CSSProperties
//       }
//       {...props}
//     />
//   )
// }

// export { Toaster }


import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      className="toaster group"
      icons={{
        success: <CheckIcon />,
        error: <XIcon />,
        warning: <AlertTriangleIcon />,
        info: <InfoIcon />,
      }}
      toastOptions={{
        // classNames: {
        //   toast: "px-6 py-5 text-lg", // Bigger toast box and text
        //   title: "text-xl font-semibold",
        //   description: "text-base text-muted-foreground",
        // }
         style: {
          background: '#1f2937', // Tailwind's gray-800
          color: '#f9fafb',       // Tailwind's gray-50
        },
        // classNames: {
        //   toast: 'rounded-lg shadow-lg',
        //   title: 'font-semibold',
        //   description: 'text-sm text-gray-300',
        // },
        classNames: {
          toast: 'text-lg px-6 py-4 rounded-xl shadow-2xl',
          title: 'text-md font-semibold',
          description: 'text-base text-gray-300',
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
