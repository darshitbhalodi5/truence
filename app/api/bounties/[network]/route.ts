import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Bounty from '@/models/Bounty';
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

    // Fetch data from both collections
    const [bounty, displayBounty] = await Promise.all([
      Bounty.findOne({ networkName }),
      DisplayBounty.findOne({ networkName })
    ]);

    if (!bounty || !displayBounty) {
      return new NextResponse(JSON.stringify({ error: 'Bounty not found' }), {
        status: 404,
      });
    }

    // Combine the data from both collections
    const combinedData = {
      _id: bounty._id,
      networkName: bounty.networkName,
      criticalReward: bounty.criticalReward,
      highReward: bounty.highReward,
      mediumReward: bounty.mediumReward,
      lowReward: bounty.lowReward,
      additionalDetails: bounty.additionalDetails,
      severityDescriptions: bounty.severityDescriptions,
      finalSeverity: bounty.finalSeverity,
      initialSeverities: bounty.initialSeverities
    };

    return NextResponse.json(combinedData);
  } catch (error) {
    console.error('Error fetching bounty:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
} 