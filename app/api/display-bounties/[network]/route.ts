import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DisplayBounty from '@/models/DisplayBounty';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ network: string }> }
) {
  try {
    await dbConnect();
    
    // Convert network name from URL format to database format
    const rawNetwork = (await params).network;
    const networkName = rawNetwork
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    const displayBounty = await DisplayBounty.findOne({ networkName });

    if (!displayBounty) {
      return new NextResponse(JSON.stringify({ error: 'Bounty not found' }), {
        status: 404,
      });
    }

    return NextResponse.json(displayBounty);
  } catch (error) {
    console.error('Error fetching bounty:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ network: string }> }
) {
  try {
    await dbConnect();
    
    const rawNetwork = (await params).network;
    const networkName = rawNetwork
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    const body = await request.json();

    // Update the document with new data
    const updatedBounty = await DisplayBounty.findOneAndUpdate(
      { networkName },
      { $set: { ...body, lastUpdated: new Date() } },
      { new: true, runValidators: true }
    );

    if (!updatedBounty) {
      return new NextResponse(JSON.stringify({ error: 'Bounty not found' }), {
        status: 404,
      });
    }

    return NextResponse.json(updatedBounty);
  } catch (error) {
    console.error('Error updating bounty:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
} 