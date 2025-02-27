import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import User from '@/models/User';
import Submission from '@/models/Submission';
import DisplayBounty from '@/models/DisplayBounty';
import { GridFSBucket, ObjectId } from 'mongodb';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
) {
  try {
    await connectMongoose();
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address')?.toLowerCase();

    // Find user and check if they're a reviewer
    const user = await User.findOne({ walletAddress: address });
    if (!user || !user.reviewerTeam || user.reviewerTeam.length === 0) {
      return NextResponse.json({ error: 'No reviewer found with this wallet address' }, { status: 404 });
    }

    // Get network names from the user's reviewer team
    const networkNames = user.reviewerTeam.map((team: any) => team.networkName);

    // Get submissions for bounties where user is a reviewer
    const reviewerSubmissions = await Submission.find({
      programName: { $in: networkNames }
    })
    .sort({ createdAt: -1 })
    .lean();

    if (reviewerSubmissions.length === 0) {
      return NextResponse.json({ submissions: [] });
    }

    // Get bounty logos
    const bountyDetails = await DisplayBounty.find({
      networkName: { $in: networkNames }
    })
    .select('networkName logoUrl')
    .lean();

    const bountyLogoMap = bountyDetails.reduce((map: Record<string, string>, bounty: any) => {
      map[bounty.networkName] = bounty.logoUrl;
      return map;
    }, {});

    // Process file IDs
    const fileIds = reviewerSubmissions
      .flatMap(sub => sub.files || [])
      .map(fileUrl => fileUrl.split('/').pop())
      .filter(Boolean)
      .map(id => new ObjectId(id));

    let fileNames: Record<string, string> = {};
    if (fileIds.length > 0) {
      // Get MongoDB native connection
      const db = mongoose.connection.db;
      if (!db) throw new Error('Database connection failed');
      const bucket = new GridFSBucket(db);
      const files = await bucket.find({ _id: { $in: fileIds } }).toArray();
      
      fileNames = files.reduce((acc: Record<string, string>, file) => {
        acc[file._id.toString()] = file.metadata?.originalName || file.filename;
        return acc;
      }, {});
    }

    // Enrich submissions with logo and file info
    const enrichedSubmissions = reviewerSubmissions.map(submission => ({
      ...submission,
      bountyLogo: bountyLogoMap[submission.programName],
      fileNames: (submission.files || []).map((fileUrl: string) => {
        const fileId = fileUrl.split('/').pop();
        return fileId ? fileNames[fileId] : null;
      }).filter(Boolean)
    }));

    return NextResponse.json({ submissions: enrichedSubmissions });

  } catch (error) {
    console.error('Error fetching reviewer submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviewer submissions' },
      { status: 500 }
    );
  }
}