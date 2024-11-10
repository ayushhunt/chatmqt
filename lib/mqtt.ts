import mqtt from 'mqtt';

export class MQTTClient {
  private static instance: MQTTClient;
  private client: mqtt.Client | null = null;
  private subscriptions: Map<string, Set<(message: string) => void>> = new Map();

  private constructor() {}

  static getInstance(): MQTTClient {
    if (!MQTTClient.instance) {
      MQTTClient.instance = new MQTTClient();
    }
    return MQTTClient.instance;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.client) {
        resolve();
        return;
      }

      const options = {
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        clean: true,
      };

      this.client = mqtt.connect(process.env.MQTT_BROKER_URL!, options);

      this.client.on('connect', () => {
        console.log('Connected to MQTT broker');
        resolve();
      });

      this.client.on('error', (error) => {
        console.error('MQTT connection error:', error);
        reject(error);
      });

      this.client.on('message', (topic, message) => {
        const callbacks = this.subscriptions.get(topic);
        if (callbacks) {
          const messageStr = message.toString();
          callbacks.forEach((callback) => callback(messageStr));
        }
      });
    });
  }

  subscribe(topic: string, callback: (message: string) => void): void {
    if (!this.client) {
      throw new Error('MQTT client not connected');
    }

    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set());
      this.client.subscribe(topic);
    }

    this.subscriptions.get(topic)!.add(callback);
  }

  unsubscribe(topic: string, callback: (message: string) => void): void {
    const callbacks = this.subscriptions.get(topic);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.subscriptions.delete(topic);
        this.client?.unsubscribe(topic);
      }
    }
  }

  publish(topic: string, message: string): void {
    if (!this.client) {
      throw new Error('MQTT client not connected');
    }
    this.client.publish(topic, message);
  }

  disconnect(): void {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.subscriptions.clear();
    }
  }
}