import { useState } from "react";
import { DetectionContext } from "./DetectionContext";

export function DetectionProvider({ children }) {
  const [detections, setDetections] = useState([]);

  const addDetection = (detection) => {
    setDetections((current) => [
      {
        ...detection,
        id: Date.now(),
      },
      ...current,
    ]);
  };

  return (
    <DetectionContext.Provider
      value={{
        detections,
        addDetection,
      }}
    >
      {children}
    </DetectionContext.Provider>
  );
}