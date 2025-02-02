import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Activity } from 'lucide-react';
import { SensorCard } from './components/SensorCard';
import type { SensorData } from './types';

const SOCKET_URL = 'ws://your-nodemcu-ip:81';

function App() {
  const [connected, setConnected] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData>({
    height: 0,
    flowDirection: 'static',
    timestamp: new Date().toISOString(),
    containerHeight: 100, // 100 cm container height
    fillTime: 0
  });

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      setConnected(true);
      console.log('Connected to NodeMCU');
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from NodeMCU');
    });

    socket.on('sensorData', (data: SensorData) => {
      setSensorData(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Liquid Level Monitor</h1>
          <div className="flex items-center">
            <Activity className={`w-5 h-5 ${connected ? 'text-green-500' : 'text-red-500'}`} />
            <span className="ml-2 text-sm text-gray-600">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SensorCard
            title="Liquid Height"
            value={sensorData.height}
            unit="cm"
            icon="height"
          />
          <SensorCard
            title="Flow Status"
            value={sensorData.flowDirection === 'in' ? 'Filling' : 
                   sensorData.flowDirection === 'out' ? 'Draining' : 'Static'}
            unit=""
            icon="flow"
            direction={sensorData.flowDirection}
          />
          <SensorCard
            title="Time to Fill"
            value={sensorData.fillTime}
            unit="min"
            icon="timer"
          />
        </div>

        <div className="mt-6 text-right text-sm text-gray-600">
          Last updated: {new Date(sensorData.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default App;