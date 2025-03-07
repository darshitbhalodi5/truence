import { NextRequest, NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongodb";
import Submission from "@/models/Submission";
import DisplayBounty from "@/models/DisplayBounty";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    await connectMongoose();

    const submissionId = (await params).submissionId;
    const { managerAddress, isPaymentDone, isAdditionalPaymentDone } =
      await request.json();

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    const displayBounty = await DisplayBounty.findOne({
      networkName: submission.programName,
    });

    if (!displayBounty) {
      return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
    }

    if (managerAddress !== displayBounty.managerAddress) {
      return NextResponse.json(
        { error: "Only the program manager can update payment status" },
        { status: 403 }
      );
    }

    if (!submission.progressStatus) {
      submission.progressStatus = {};
    }

    submission.progressStatus.paymentConfirmed = isPaymentDone;
    submission.progressStatus.additionalPaymentConfirmed = isAdditionalPaymentDone;

    await submission.save();

    return NextResponse.json({
      message: "Payment status finalized by manager",
      submission,
    });
  } catch (error) {
    console.error("Error finalizing payment status:", error);
    return NextResponse.json(
      {
        error: "Failed to finalize payment status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
