import { NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import DisplayBounty from '@/models/DisplayBounty';
import Bounty from '@/models/Bounty';
import User from '@/models/User';

export async function POST() {
  try {
    await connectMongoose();

    // Create test bounty
    const [displayBounty, bounty] = await Promise.all([
      DisplayBounty.create({
        networkName: "Test Network",
        logoUrl: "/assets/arbitrum-arb-logo.svg",
        description: "Test bounty with severity selection",
        maxRewards: 1000,
        totalPaid: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        lastUpdated: new Date(),
        status: 'active'
      }),
      Bounty.create({
        networkName: "Test Network",
        finalSeverity: true,
        initialSeverities: ['Critical', 'High', 'Medium', 'Low'],
        criticalReward: 1000,
        highReward: 500,
        mediumReward: 250,
        lowReward: 100,
        severityDescriptions: [
          { severity: 'Critical', description: 'Critical severity issue' },
          { severity: 'High', description: 'High severity issue' },
          { severity: 'Medium', description: 'Medium severity issue' },
          { severity: 'Low', description: 'Low severity issue' }
        ],
        additionalDetails: {
          scope: "Test scope",
          eligibility: "Test eligibility",
          rules: "Test rules",
          rewards: "Test rewards"
        },
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      })
    ]);

    // Add reviewer
    const reviewerAddress = "0xCB40d07c8493aeEc43033070DD987f2638125873";
    
    await User.findOneAndUpdate(
      { walletAddress: reviewerAddress.toLowerCase() },
      {
        $addToSet: {
          reviewerTeam: {
            bountyId: displayBounty._id,
            networkName: "Test Network",
            assignedDate: new Date()
          }
        }
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      message: 'Test data created successfully',
      displayBounty,
      bounty,
      reviewerAddress
    });
  } catch (error) {
    console.error('Error setting up test data:', error);
    return NextResponse.json(
      {
        error: 'Failed to set up test data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 