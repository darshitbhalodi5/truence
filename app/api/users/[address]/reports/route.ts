import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import User from '@/models/User';
import Submission from '@/models/Submission';
import DisplayBounty from '@/models/DisplayBounty';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    await connectMongoose();
    const rawAddress = (await params).address;
    const address = rawAddress.toLowerCase();

    // Find user and their roles
    const user = await User.findOne({ walletAddress: address });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user submissions
    const userSubmissions = await Submission.find({ 
      walletAddress: address 
    })
    .sort({ createdAt: -1 })
    .lean();

    // Get bounties where user is a reviewer (using reviewerTeam from user data)
    const reviewerBountyIds = user.reviewerTeam.map((team:any) => team.bountyId);
    const reviewerBounties = await DisplayBounty.find({
      _id: { $in: reviewerBountyIds }
    }).lean();

    // Get submissions for bounties where user is a reviewer
    const reviewerSubmissions = reviewerBounties.length > 0
      ? await Submission.find({
          programName: {
            $in: reviewerBounties.map(b => b.networkName)
          }
        })
        .sort({ createdAt: -1 })
        .lean()
      : [];

    // Get bounties where user is a manager (using managerTeam from user data)
    const managerBountyIds = user.managerTeam.map((team:any) => team.bountyId);
    const managerBounties = await DisplayBounty.find({
      _id: { $in: managerBountyIds }
    }).lean();

    return NextResponse.json({
      submitter: {
        isSubmitter: userSubmissions.length > 0,
        submissions: userSubmissions
      },
      reviewer: {
        isReviewer: user.reviewerTeam.length > 0,
        submissions: reviewerSubmissions,
        bounties: reviewerBounties
      },
      manager: {
        isManager: user.managerTeam.length > 0,
        bounties: managerBounties
      }
    });
  } catch (error) {
    console.error('Error fetching user reports:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch user reports',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}