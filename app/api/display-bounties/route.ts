import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import DisplayBounty from '@/models/DisplayBounty';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { networkName, reviewerAddresses, managerAddress, ...bountyData } = data;

    if (!networkName) {
      return NextResponse.json(
        { error: 'Network name is required' },
        { status: 400 }
      );
    }

    await connectMongoose();

    // Create or update the bounty
    const bounty = await DisplayBounty.findOneAndUpdate(
      { networkName },
      { 
        networkName,
        reviewerAddresses,
        managerAddress,
        ...bountyData,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    // Update reviewer team members
    if (reviewerAddresses && Array.isArray(reviewerAddresses)) {
      for (const address of reviewerAddresses) {
        const user = await User.findOne({ walletAddress: address.toLowerCase() });
        if (user) {
          await user.updateReviewerTeam(bounty._id, networkName);
        } else {
          // Create new user if doesn't exist
          await User.create({
            walletAddress: address.toLowerCase(),
            reviewerTeam: [{ bountyId: bounty._id, networkName }]
          });
        }
      }
    }

    // Update manager
    if (managerAddress) {
      const manager = await User.findOne({ walletAddress: managerAddress.toLowerCase() });
      if (manager) {
        await manager.updateManagerTeam(bounty._id, networkName);
      } else {
        // Create new user if doesn't exist
        await User.create({
          walletAddress: managerAddress.toLowerCase(),
          managerTeam: [{ bountyId: bounty._id, networkName }]
        });
      }
    }

    return NextResponse.json({
      success: true,
      bounty
    });
  } catch (error) {
    console.error('Error creating/updating bounty:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error processing bounty',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectMongoose();
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