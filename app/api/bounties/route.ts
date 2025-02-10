import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Bounty from '@/models/Bounty';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const bounty = await Bounty.create(body);
    return NextResponse.json(bounty, { status: 201 });
  } catch (error) {
    console.error('Error creating bounty:', error);
    return NextResponse.json(
      { error: 'Failed to create bounty' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const bounties = await Bounty.find({}).sort({ lastUpdated: -1 });
    return NextResponse.json(bounties);
  } catch (error) {
    console.error('Error fetching bounties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bounties' },
      { status: 500 }
    );
  }
} 