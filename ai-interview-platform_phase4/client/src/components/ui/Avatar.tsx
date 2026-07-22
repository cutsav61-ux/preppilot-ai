"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-base",
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-cobalt-soft font-medium text-cobalt",
        sizeMap[size],
        className,
      )}
    >
      {src && !imgError ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="56px"
          className="object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span aria-hidden>{getInitials(name)}</span>
      )}
      <span className="sr-only">{name}</span>
    </div>
  );
}
