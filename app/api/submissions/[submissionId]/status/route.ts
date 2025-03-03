import { NextRequest, NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongodb";
import Submission from "@/models/Submission";
import Bounty from "@/models/Bounty";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    await connectMongoose();

    const submissionId = (await params).submissionId;
    const { status, reviewerSeverity, managerAddress, comment } =
      await request.json();

    // Validate status
    const validStatuses = ["accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Get the submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Get the bounty to check if the requester is a manager
    const bounty = await Bounty.findOne({
      networkName: submission.programName,
    });
    if (!bounty) {
      return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
    }

    // Only the manager can update submission status
    if (managerAddress !== bounty.managerAddress) {
      return NextResponse.json(
        { error: "Only the program manager can update submission status" },
        { status: 403 }
      );
    }

    // Record the manager's decision
    submission.managerVote = {
      vote: status,
      severity: status === "accepted" ? reviewerSeverity : undefined,
      votedAt: new Date(),
      comment: comment || "Submission finalized by manager",
    };

    // Update submission status based on manager decision
    submission.status = status;
    if (status === "accepted" && reviewerSeverity) {
      submission.reviewerSeverity = reviewerSeverity;
    }

    // Mark as finalized
    submission.votingStatus = "finalized";
    submission.reviewedAt = new Date();
    submission.reviewedBy = managerAddress;

    await submission.save();

    return NextResponse.json({
      message: "Submission finalized by manager",
      submission,
      voteSummary: submission.getVoteSummary(),
    });
  } catch (error) {
    console.error("Error finalizing submission:", error);
    return NextResponse.json(
      {
        error: "Failed to finalize submission",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
