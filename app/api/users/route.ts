import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';

  try {
    const users = await prisma.user.findMany({
      where: query
        ? {
            username: {
              contains: query,
              mode: 'insensitive',
            },
          }
        : {}, // If no query, return all users
      select: {
        id: true,
        username: true,
      },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.error();
  }
}
