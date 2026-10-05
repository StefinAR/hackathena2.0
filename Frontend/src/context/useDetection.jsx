import { useContext } from "react";
import { DetectionContext } from "./DetectionContext";

export function useDetections() {
  return useContext(DetectionContext);
}