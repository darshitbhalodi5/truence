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

    // Find user
    const user = await User.findOne({ walletAddress: address });
    
    // Find all submissions by this user
    const userSubmissions = await Submission.find({ 
      walletAddress: address 
    })
    .sort({ createdAt: -1 })
    .lean();

    // Find bounties where user is a reviewer
    const reviewerBounties = await DisplayBounty.find({
      reviewerAddresses: address
    }).lean();

    // If user is a reviewer, get all submissions for those bounties
    const reviewerSubmissions = reviewerBounties.length > 0
      ? await Submission.find({
          programName: {
            $in: reviewerBounties.map(b => b.networkName)
          }
        })
        .sort({ createdAt: -1 })
        .lean()
      : [];

    // Find bounties where user is a manager
    const managerBounties = await DisplayBounty.find({
      managerAddress: address
    }).lean();

    return NextResponse.json({
      submitter: {
        isSubmitter: userSubmissions.length > 0,
        submissions: userSubmissions
      },
      reviewer: {
        isReviewer: reviewerBounties.length > 0,
        submissions: reviewerSubmissions
      },
      manager: {
        isManager: managerBounties.length > 0
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