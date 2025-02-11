import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DisplayBounty from '@/models/DisplayBounty';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const bounty = await DisplayBounty.create(body);
    return NextResponse.json(bounty, { status: 201 });
  } catch (error) {
    console.error('Error creating display bounty:', error);
    return NextResponse.json(
      { error: 'Failed to create display bounty' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const bounties = await DisplayBounty.find()
      .sort({ lastUpdated: -1 })
      .lean()
      .exec();

    return NextResponse.json(bounties);
  } catch (error) {
    console.error('Error fetching display bounties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch display bounties' },
      { status: 500 }
    );
  }
} 