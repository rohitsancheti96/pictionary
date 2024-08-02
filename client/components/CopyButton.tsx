"use client";

import React from "react";

const CopyButton = ({ value }: { value: string }) => {
  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        navigator.clipboard.writeText(value);
      }}
    >
      Copy
    </div>
  );
};

export default CopyButton;
