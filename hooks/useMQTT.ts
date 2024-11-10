import { useEffect, useCallback } from 'react';
import { MQTTClient } from '@/lib/mqtt';

export function useMQTT(topic: string, callback: (message: string) => void) {
  const subscribe = useCallback(() => {
    const mqtt = MQTTClient.getInstance();
    
    try {
      mqtt.connect().then(() => {
        mqtt.subscribe(topic, callback);
      });
    } catch (error) {
      console.error('Failed to connect to MQTT:', error);
    }

    return () => {
      mqtt.unsubscribe(topic, callback);
    };
  }, [topic, callback]);

  useEffect(() => {
    const unsubscribe = subscribe();
    return () => {
      unsubscribe();
    };
  }, [subscribe]);

  const publish = useCallback((message: string) => {
    const mqtt = MQTTClient.getInstance();
    mqtt.publish(topic, message);
  }, [topic]);

  return { publish };
}