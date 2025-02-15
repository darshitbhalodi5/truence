import { NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import Submission from '@/models/Submission';

export async function POST() {
  try {
    await connectMongoose();

    // Create test submission
    const submission = await Submission.create({
      programName: "Test Network",
      title: "Test Vulnerability Report",
      description: "This is a test vulnerability report with severity selection.",
      severityLevel: 'critical',
      walletAddress: "0x1234567890123456789012345678901234567890", // Example submitter address
      status: 'pending',
      files: [] // No files for test
    });

    return NextResponse.json({
      message: 'Test submission created successfully',
      submission
    });
  } catch (error) {
    console.error('Error creating test submission:', error);
    return NextResponse.json(
      {
        error: 'Failed to create test submission',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 