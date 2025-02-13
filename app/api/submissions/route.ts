// app/api/submissions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import Submission from '@/models/Submission';
import DisplayBounty from '@/models/DisplayBounty';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { programName, title, description, severityLevel, files, walletAddress } = data;

    if (!programName || !title || !description || !severityLevel || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectMongoose();

    // Find the bounty
    const bounty = await DisplayBounty.findOne({ networkName: programName });
    if (!bounty) {
      return NextResponse.json(
        { error: 'Bounty program not found' },
        { status: 404 }
      );
    }

    // Create the submission
    const submission = await Submission.create({
      programName,
      title,
      description,
      severityLevel,
      files,
      walletAddress: walletAddress.toLowerCase(),
      status: 'pending'
    });

    // Find or create user and add submission to their record
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) {
      user = await User.create({
        walletAddress: walletAddress.toLowerCase(),
        submissions: [{
          bountyId: bounty._id,
          networkName: programName,
          title,
          submissionDate: new Date(),
          status: 'pending'
        }]
      });
    } else {
      await user.addSubmission({
        bountyId: bounty._id,
        networkName: programName,
        title,
        submissionDate: new Date(),
        status: 'pending'
      });
    }

    return NextResponse.json({
      success: true,
      submission: {
        id: submission._id,
        programName,
        title,
        severityLevel,
        status: 'pending',
        submittedAt: submission.createdAt
      }
    });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error processing submission',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}