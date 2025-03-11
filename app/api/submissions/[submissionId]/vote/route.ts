import { NextRequest, NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongodb";
import Submission from "@/models/Submission";
import Bounty from "@/models/Bounty";
import DisplayBounty from "@/models/DisplayBounty";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    await connectMongoose();

    const submissionId = (await params).submissionId;
    const { reviewerAddress, vote, severity, comment } = await request.json();
    
    const normalizedReviewerAddress = reviewerAddress.toLowerCase();

    // Validate vote
    const validVotes = ["accepted", "rejected"];
    if (!validVotes.includes(vote)) {
      return NextResponse.json(
        { error: "Invalid vote value" },
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

    // Get the bounty to check reviewer addresses
    const bounty = await DisplayBounty.findOne({
      networkName: submission.programName,
    });
    if (!bounty) {
      return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
    }

    if (
      !bounty?.reviewerAddresses ||
      !Array.isArray(bounty.reviewerAddresses)
    ) {
      return NextResponse.json(
        { error: "Bounty reviewers list is missing or invalid" },
        { status: 500 }
      );
    }

    const normalizedReviewerAddresses = bounty.reviewerAddresses.map((addr: string) =>
      addr.toLowerCase()
    );
    
    // Ensure the voter is a reviewer (not the manager)
    if (!normalizedReviewerAddresses.includes(normalizedReviewerAddress)) {
      return NextResponse.json(
        { error: "Unauthorized: Only reviewers can use this endpoint" },
        { status: 403 }
      );
    }

    // Check if this reviewer has already voted
    const existingVoteIndex = submission.reviewVotes.findIndex(
      (v: any) => v.reviewerAddress === reviewerAddress
    );

    if (existingVoteIndex >= 0) {
      // Update existing vote
      submission.reviewVotes[existingVoteIndex] = {
        reviewerAddress,
        vote,
        severity: vote === "accepted" ? severity : undefined,
        votedAt: new Date(),
        comment,
      };
    } else {
      // Add new vote
      submission.reviewVotes.push({
        reviewerAddress,
        vote,
        severity: vote === "accepted" ? severity : undefined,
        votedAt: new Date(),
        comment,
      });
    }

    // If this is the first vote, update status to in_review
    if (submission.votingStatus === "pending") {
      submission.votingStatus = "in_review";
      submission.status = "reviewing";
    }

    // Check if quorum is reached
    const hasReachedQuorum = await submission.hasReachedQuorum();
    if (hasReachedQuorum && submission.votingStatus !== "quorum_reached") {
      submission.votingStatus = "quorum_reached";
    }

    await submission.save();

    return NextResponse.json({
      message: "Reviewer vote recorded successfully",
      submission,
      voteSummary: submission.getVoteSummary(),
      quorumReached: hasReachedQuorum,
    });
  } catch (error) {
    console.error("Error recording reviewer vote:", error);
    return NextResponse.json(
      {
        error: "Failed to record vote",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
