import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Bounty from '@/models/Bounty';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const id = (await params).id;
    const bounty = await Bounty.findById(id);
    
    if (!bounty) {
      return NextResponse.json(
        { error: 'Bounty not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(bounty);
  } catch (error) {
    console.error('Error fetching bounty:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bounty' },
      { status: 500 }
    );
  }
} 