#include <ESP8266WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>
#include <NewPing.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Ultrasonic sensor pins
#define TRIGGER_PIN  D1
#define ECHO_PIN     D2
#define MAX_DISTANCE 100 // Maximum distance in cm

// Constants for calculations
const float CONTAINER_HEIGHT = 100.0; // cm
const float FLOW_RATE = 0.5;          // L/s (assumed constant flow rate)

NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);
WebSocketsServer webSocket = WebSocketsServer(81);

float lastHeight = 0;
unsigned long lastMeasurement = 0;
const unsigned long MEASUREMENT_INTERVAL = 1000; // 1 second

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", num);
      break;
    case WStype_CONNECTED:
      Serial.printf("[%u] Connected!\n", num);
      break;
  }
}

void setup() {
  Serial.begin(115200);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

String determineFlowDirection(float currentHeight, float lastHeight) {
  float difference = currentHeight - lastHeight;
  if (abs(difference) < 0.5) return "static";
  return difference > 0 ? "in" : "out";
}

float calculateFillTime(float currentHeight) {
  if (currentHeight >= CONTAINER_HEIGHT) return 0;
  return ((CONTAINER_HEIGHT - currentHeight) / FLOW_RATE) / 60.0; // Convert to minutes
}

void loop() {
  webSocket.loop();
  
  unsigned long currentMillis = millis();
  if (currentMillis - lastMeasurement >= MEASUREMENT_INTERVAL) {
    // Read sensor
    float height = CONTAINER_HEIGHT - sonar.ping_cm(); // Convert distance to height
    if (height < 0) height = 0;
    if (height > CONTAINER_HEIGHT) height = CONTAINER_HEIGHT;
    
    // Calculate metrics
    String flowDirection = determineFlowDirection(height, lastHeight);
    float fillTime = calculateFillTime(height);

    // Create JSON document
    StaticJsonDocument<256> doc;
    doc["height"] = height;
    doc["flowDirection"] = flowDirection;
    doc["timestamp"] = currentMillis;
    doc["containerHeight"] = CONTAINER_HEIGHT;
    doc["fillTime"] = fillTime;

    String jsonString;
    serializeJson(doc, jsonString);
    webSocket.broadcastTXT(jsonString);
    
    lastHeight = height;
    lastMeasurement = currentMillis;
  }
}
