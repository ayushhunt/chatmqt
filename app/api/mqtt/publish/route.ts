import { NextRequest, NextResponse } from 'next/server';
import { MQTTClient } from '@/lib/mqtt';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const user = verifyAuth(request);
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { topic, message } = await request.json();
    
    if (!topic || !message) {
      return NextResponse.json(
        { error: 'Topic and message are required' },
        { status: 400 }
      );
    }

    const mqtt = MQTTClient.getInstance();
    await mqtt.connect();
    mqtt.publish(topic, message);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to publish message' },
      { status: 500 }
    );
  }
}