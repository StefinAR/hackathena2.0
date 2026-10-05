import { useState } from "react";
import { DetectionContext } from "./DetectionContext";

export function DetectionProvider({ children }) {
  const [detections, setDetections] = useState([
    {
      id: 1,
      date: "2026-10-03",
      time: "10:31:24",
      source: "192.168.1.14",
      destination: "10.0.0.24",
      protocol: "TCP",
      type: "Suspicious",
    },
    {
      id: 2,
      date: "2026-10-03",
      time: "10:28:12",
      source: "192.168.1.21",
      destination: "172.16.0.5",
      protocol: "UDP",
      type: "Normal",
    },
    {
      id: 3,
      date: "2026-10-03",
      time: "10:24:45",
      source: "192.168.1.18",
      destination: "10.0.0.18",
      protocol: "TCP",
      type: "Malicious",
    },
    {
      id: 4,
      date: "2026-10-03",
      time: "10:19:07",
      source: "192.168.1.31",
      destination: "10.0.0.12",
      protocol: "HTTP",
      type: "Normal",
    },
    {
      id: 5,
      date: "2026-10-03",
      time: "10:12:36",
      source: "192.168.1.42",
      destination: "10.0.0.31",
      protocol: "HTTPS",
      type: "Normal",
    },
  ]);

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