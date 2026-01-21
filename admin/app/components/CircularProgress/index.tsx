import React from "react";

type CircularProgressProps = {
  className?: string;
};

const CircularProgress = ({ className = "" }: CircularProgressProps) => (
  <div className={`loader ${className}`}>
    <img src="/images/loader.svg" alt="loader" style={{ height: 60 }} />
  </div>
);
export default CircularProgress;
