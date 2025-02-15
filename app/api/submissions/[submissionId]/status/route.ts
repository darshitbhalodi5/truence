import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import Submission from '@/models/Submission';
import Bounty from '@/models/Bounty';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    await connectMongoose();

    const submissionId = (await params).submissionId;
    const { status, reviewerSeverity } = await request.json();

    // Validate status
    const validStatuses = ['pending', 'reviewing', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Get the submission to check the program name
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // If status is accepted and reviewerSeverity is provided, validate against bounty settings
    if (status === 'accepted' && reviewerSeverity) {
      const bounty = await Bounty.findOne({ networkName: submission.programName });
      if (!bounty) {
        return NextResponse.json(
          { error: 'Bounty not found' },
          { status: 404 }
        );
      }

      // If bounty requires final severity, validate the reviewer severity
      if (bounty.finalSeverity && !bounty.initialSeverities.includes(reviewerSeverity)) {
        return NextResponse.json(
          { error: 'Invalid reviewer severity for this bounty' },
          { status: 400 }
        );
      }
    }

    // Update submission status and reviewer severity if provided
    const updateData: any = {
      status,
      ...(status === 'reviewing' ? { reviewedAt: new Date() } : {}),
      ...(reviewerSeverity ? { reviewerSeverity } : {})
    };

    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      updateData,
      { new: true }
    );

    return NextResponse.json({
      message: 'Status updated successfully',
      submission: updatedSubmission
    });
  } catch (error) {
    console.error('Error updating submission status:', error);
    return NextResponse.json(
      {
        error: 'Failed to update submission status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 