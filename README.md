# Minor Project

## Overview

This project integrates a NodeMCU microcontroller with a web interface to monitor and control height ,flow status etc. The web application is developed using tools React and Tailwind CSS and is deployed via Netlify.

## Features

- **Real-time Monitoring**: Provides live data updates from the NodeMCU sensors.
- **User-friendly Interface**: Interactive and responsive design for seamless user experience.
- **Remote Control**: Allows users to know height and time of tank to be filled remotely through the web interface.

## Project Structure

Minor_Project/
├── .bolt/
├── src/
│   ├── components/
│   ├── assets/
│   ├── App.tsx
│   └── main.tsx
├── .gitignore
├── Arduino.ino
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts

~ Arduino.ino: Contains the Arduino code for the NodeMCU.
~ src/: Contains the source code for the web application.
~ components/: React components.
~ assets/: Static assets like images and icons.
~ App.tsx: Main application component.
~ main.tsx: Entry point of the application.

