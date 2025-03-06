// reviewerManagement.ts
import mongoose from "mongoose";
import DisplayBounty from "@/models/DisplayBounty";
import User from "@/models/User";
import Submission from "@/models/Submission";

/**
 * Adds a new reviewer to a bounty program
 * @param networkName The name of the network/program
 * @param reviewerAddress The wallet address of the reviewer to add
 * @returns The updated DisplayBounty document
 */
export async function addReviewer(
  networkName: string,
  reviewerAddress: string
) {
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Normalize the address
    const normalizedAddress = reviewerAddress.toLowerCase();

    // 1. Update the DisplayBounty document
    const bounty = await DisplayBounty.findOne({ networkName }).session(
      session
    );

    if (!bounty) {
      throw new Error(`Bounty program "${networkName}" not found`);
    }

    // Check if reviewer already exists
    if (
      bounty.reviewerAddresses &&
      bounty.reviewerAddresses.includes(normalizedAddress)
    ) {
      throw new Error(
        `Reviewer ${normalizedAddress} is already assigned to this bounty`
      );
    }

    // Add the reviewer address
    if (!bounty.reviewerAddresses) {
      bounty.reviewerAddresses = [normalizedAddress];
    } else {
      bounty.reviewerAddresses.push(normalizedAddress);
    }

    await bounty.save({ session });

    // 2. Create or update the User document for this reviewer
    let user = await User.findOne({ walletAddress: normalizedAddress }).session(
      session
    );

    if (!user) {
      // Create new user if they don't exist
      user = new User({
        walletAddress: normalizedAddress,
        reviewerTeam: [
          {
            bountyId: bounty._id,
            networkName: bounty.networkName,
            assignedDate: new Date(),
          },
        ],
      });
    } else {
      // Update existing user
      await user.updateReviewerTeam(bounty._id.toString(), bounty.networkName);
    }

    await user.save({ session });

    // 3. Reset votingStatus for pending submissions if needed
    // This ensures recalculation of quorum requirements
    await Submission.updateMany(
      {
        programName: networkName,
        status: { $in: ["pending", "reviewing"] },
        votingStatus: { $in: ["pending", "in_review"] },
      },
      { $set: { votingStatus: "pending" } },
      { session }
    );

    await session.commitTransaction();
    return bounty;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

/**
 * Removes a reviewer from a bounty program
 * @param networkName The name of the network/program
 * @param reviewerAddress The wallet address of the reviewer to remove
 * @returns The updated DisplayBounty document
 */
export async function removeReviewer(
  networkName: string,
  reviewerAddress: string
) {
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    // 1. Update the DisplayBounty document
    const bounty = await DisplayBounty.findOne({ networkName }).session(
      session
    );

    if (!bounty) {
      throw new Error(`Bounty program "${networkName}" not found`);
    }

    // Check if reviewer exists
    if (
      !bounty.reviewerAddresses ||
      !bounty.reviewerAddresses.includes(reviewerAddress)
    ) {
      throw new Error(
        `Reviewer ${reviewerAddress} is not assigned to this bounty`
      );
    }

    // Remove the reviewer address
    bounty.reviewerAddresses = bounty.reviewerAddresses.filter(
      (addr: string) => addr !== reviewerAddress
    );
    await bounty.save({ session });

    // 2. Update the User document for this reviewer
    const user = await User.findOne({
      walletAddress: reviewerAddress,
    }).session(session);

    if (user) {
      // Remove this bounty from reviewer's team
      user.reviewerTeam = user.reviewerTeam.filter(
        (item: any) => item.networkName !== networkName
      );
      await user.save({ session });
    }

    // 3. Handle existing votes from this reviewer
    // Get all submissions where this reviewer has voted
    const submissions = await Submission.find({
      programName: networkName,
      "reviewVotes.reviewerAddress": reviewerAddress,
      status: { $in: ["pending", "reviewing"] },
    }).session(session);

    // Process each submission
    for (const submission of submissions) {
      // Remove votes from this reviewer
      submission.reviewVotes = submission.reviewVotes.filter(
        (vote: any) => vote.reviewerAddress !== reviewerAddress
      );

      // Recalculate voting status
      if (submission.reviewVotes.length === 0) {
        submission.votingStatus = "pending";
      } else {
        // Check if quorum can still be reached with remaining reviewers
        const hasQuorum = await submission.hasReachedQuorum();
        submission.votingStatus = hasQuorum ? "quorum_reached" : "in_review";
      }

      await submission.save({ session });
    }

    // 4. Reset votingStatus for pending submissions to recalculate quorum
    await Submission.updateMany(
      {
        programName: networkName,
        status: { $in: ["pending", "reviewing"] },
        votingStatus: { $in: ["pending", "in_review"] },
      },
      { $set: { votingStatus: "pending" } },
      { session }
    );

    await session.commitTransaction();
    return bounty;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

/**
 * Lists all reviewers for a bounty program with their submission review status
 * @param networkName The name of the network/program
 * @returns An array of reviewer information
 */
export async function listReviewers(networkName: string) {
  // Get the bounty
  const bounty = await DisplayBounty.findOne({ networkName });

  if (!bounty || !bounty.reviewerAddresses) {
    return [];
  }

  // Get all submissions for this program
  const submissions = await Submission.find({
    programName: networkName,
    status: { $ne: "rejected" },
  });

  // Compile reviewer statistics
  const reviewerStats = await Promise.all(
    bounty.reviewerAddresses.map(async (address: string) => {
      // Find user document
      const user = await User.findOne({ walletAddress: address });

      // Calculate review statistics
      const reviewedCount = submissions.filter((sub) =>
        sub.reviewVotes.some((vote: any) => vote.reviewerAddress === address)
      ).length;

      const pendingCount = submissions.length - reviewedCount;

      return {
        address,
        assignedDate:
          user?.reviewerTeam.find(
            (team: any) => team.networkName === networkName
          )?.assignedDate || null,
        reviewedSubmissions: reviewedCount,
        pendingSubmissions: pendingCount,
        lastActive: user?.lastLogin || null,
      };
    })
  );

  return reviewerStats;
}
