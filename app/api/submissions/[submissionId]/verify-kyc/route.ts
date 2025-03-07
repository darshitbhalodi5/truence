import { NextRequest, NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongodb";
import Submission from "@/models/Submission";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    await connectMongoose();

    const submissionId = (await params).submissionId;
    const { submitterAddress } = await request.json();

    const formattedSubmitterAddress = submitterAddress.toLowerCase();

    const submission = await Submission.findById(submissionId);

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    if (submission.walletAddress !== formattedSubmitterAddress) {
      return NextResponse.json(
        { error: "Only submitter can update kyc status status" },
        { status: 403 }
      );
    }

    if (!submission.progressStatus) {
      submission.progressStatus = {};
    }

    submission.progressStatus.kycVerified = true;

    await submission.save();

    return NextResponse.json({
      message: "KYC verification done successfully",
      submission,
    });
  } catch (error) {
    console.error("Error while verifying KYC:", error);
    return NextResponse.json(
      {
        error: "Failed to verify KYC status",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
