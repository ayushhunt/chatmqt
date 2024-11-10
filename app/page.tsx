import { LandingHero } from '@/components/LandingHero';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <LandingHero />
    </main>
  );
}