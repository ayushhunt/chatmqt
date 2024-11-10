'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

export function LandingHero() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Welcome to <span className="text-primary">ChatApp</span>
        </h1>
        <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl">
          A secure and real-time chat application built with Next.js, MQTT, and PostgreSQL
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/login">
          <Button size="lg">Login</Button>
        </Link>
        <Link href="/register">
          <Button size="lg" variant="outline">Register</Button>
        </Link>
      </div>
    </div>
  );
}