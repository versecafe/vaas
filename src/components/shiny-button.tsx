"use client";

import { motion } from "framer-motion";

export function ShinyButton({
  children,
  type,
  ...props
}: {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  props?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}): JSX.Element {
  return (
    <motion.button
      // @ts-ignore -- "--x" is a css variable
      initial={{ "--x": "100%", scale: 1 }}
      // @ts-ignore -- "--x" is a css variable
      animate={{ "--x": "-100%" }}
      whileTap={{ scale: 0.97 }}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 1,
        type: "spring",
        stiffness: 20,
        damping: 15,
        mass: 2,
        scale: {
          type: "spring",
          stiffness: 8,
          damping: 2,
          mass: 0.1,
        },
      }}
      className="px-6 py-2 rounded-md relative radial-gradient"
      {...props}
    >
      <span className="text-neutral-100 tracking-wide font-light h-full w-full block relative linear-mask">
        {children}
      </span>
      <span className="block absolute inset-0 rounded-md p-px linear-overlay" />
    </motion.button>
  );
}
