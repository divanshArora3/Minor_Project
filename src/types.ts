export interface SensorData {
  height: number;          // Current liquid height in cm
  flowDirection: 'in' | 'out' | 'static';  // Water flow direction
  timestamp: string;
  containerHeight: number; // Total container height in cm
  fillTime: number;       // Estimated time to fill in minutes
}