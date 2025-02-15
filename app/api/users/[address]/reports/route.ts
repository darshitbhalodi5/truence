import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import User from '@/models/User';
import Submission from '@/models/Submission';
import DisplayBounty from '@/models/DisplayBounty';
import Bounty from '@/models/Bounty';
import { Types } from 'mongoose';

interface DisplayBountyDoc {
  _id: Types.ObjectId;
  networkName: string;
  logoUrl: string;
  description: string;
  maxRewards: number;
  totalPaid: number;
  startDate: Date | null;
  endDate: Date | null;
  lastUpdated: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BountyDoc {
  _id: Types.ObjectId;
  networkName: string;
  finalSeverity: boolean;
  initialSeverities: string[];
}

interface CombinedBounty extends DisplayBountyDoc {
  details?: {
    finalSeverity: boolean;
    initialSeverities: string[];
  };
}

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
    const [reviewerDisplayBounties, reviewerBountyDetails] = await Promise.all([
      DisplayBounty.find({
        _id: { $in: reviewerBountyIds }
      }).lean().exec().then(docs => docs as unknown as DisplayBountyDoc[]),
      Bounty.find({
        networkName: {
          $in: user.reviewerTeam.map((team:any) => team.networkName)
        }
      }).lean().exec().then(docs => docs as unknown as BountyDoc[])
    ]);

    // Combine display bounty data with bounty details
    const reviewerBounties: CombinedBounty[] = reviewerDisplayBounties.map(displayBounty => {
      const bountyDetails = reviewerBountyDetails.find(
        b => b.networkName === displayBounty.networkName
      );
      return {
        ...displayBounty,
        details: bountyDetails ? {
          finalSeverity: bountyDetails.finalSeverity,
          initialSeverities: bountyDetails.initialSeverities
        } : undefined
      };
    });

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
    const [managerDisplayBounties, managerBountyDetails] = await Promise.all([
      DisplayBounty.find({
        _id: { $in: managerBountyIds }
      }).lean().exec().then(docs => docs as unknown as DisplayBountyDoc[]),
      Bounty.find({
        networkName: {
          $in: user.managerTeam.map((team:any) => team.networkName)
        }
      }).lean().exec().then(docs => docs as unknown as BountyDoc[])
    ]);

    // Combine display bounty data with bounty details for managers
    const managerBounties: CombinedBounty[] = managerDisplayBounties.map(displayBounty => {
      const bountyDetails = managerBountyDetails.find(
        b => b.networkName === displayBounty.networkName
      );
      return {
        ...displayBounty,
        details: bountyDetails ? {
          finalSeverity: bountyDetails.finalSeverity,
          initialSeverities: bountyDetails.initialSeverities
        } : undefined
      };
    });

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