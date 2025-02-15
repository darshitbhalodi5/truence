import { NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import DisplayBounty from '@/models/DisplayBounty';
import Submission from '@/models/Submission';

export async function GET() {
  try {
    await connectMongoose();

    // Get all bounties
    const bounties = await DisplayBounty.find().select('networkName logoUrl').lean();

    // Get submission counts for each bounty
    const stats = await Promise.all(
      bounties.map(async (bounty) => {
        const submissionCount = await Submission.countDocuments({
          programName: bounty.networkName
        });

        return {
          networkName: bounty.networkName,
          logoUrl: bounty.logoUrl,
          submissionCount
        };
      })
    );

    // Sort by submission count in descending order
    stats.sort((a, b) => b.submissionCount - a.submissionCount);

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching bounty stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch bounty stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 