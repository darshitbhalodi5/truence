import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import Submission from '@/models/Submission';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    await connectMongoose();

    const submissionId = (await params).submissionId;
    const { status } = await request.json();

    // Validate status
    const validStatuses = ['pending', 'reviewing', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Update submission status
    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      { 
        status,
        ...(status === 'reviewing' ? { reviewedAt: new Date() } : {}),
      },
      { new: true }
    );

    if (!updatedSubmission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

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