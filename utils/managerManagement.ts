// managerManagement.ts
import mongoose from "mongoose";
import DisplayBounty from "@/models/DisplayBounty";
import User from "@/models/User";
import Submission from "@/models/Submission";

/**
 * Adds a new manager to a bounty program
 * @param networkName The name of the network/program
 * @param managerAddress The wallet address of the manager to add
 * @returns The updated DisplayBounty document
 */
export async function addManager(
  networkName: string,
  managerAddress: string
) {
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Normalize the address
    const normalizedAddress = managerAddress.toLowerCase();

    // 1. Update the DisplayBounty document
    const bounty = await DisplayBounty.findOne({ networkName }).session(
      session
    );

    if (!bounty) {
      throw new Error(`Bounty program "${networkName}" not found`);
    }

    // Check if manager is already assigned
    if (bounty.managerAddress === normalizedAddress) {
      throw new Error(
        `Manager ${normalizedAddress} is already assigned to this bounty`
      );
    }

    // Set the manager address
    bounty.managerAddress = normalizedAddress;
    await bounty.save({ session });

    // 2. Create or update the User document for this manager
    let user = await User.findOne({ walletAddress: normalizedAddress }).session(
      session
    );

    if (!user) {
      // Create new user if they don't exist
      user = new User({
        walletAddress: normalizedAddress,
        managerTeam: [
          {
            bountyId: bounty._id,
            networkName: bounty.networkName,
            assignedDate: new Date(),
          },
        ],
      });
    } else {
      // Update existing user
      await user.updateManagerTeam(bounty._id.toString(), bounty.networkName);
    }

    await user.save({ session });

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
 * Removes a manager from a bounty program
 * @param networkName The name of the network/program
 * @returns The updated DisplayBounty document
 */
export async function removeManager(
  networkName: string
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

    // Check if manager exists
    if (!bounty.managerAddress) {
      throw new Error(
        `No manager is assigned to this bounty`
      );
    }

    const managerAddress = bounty.managerAddress;

    // Remove the manager address
    bounty.managerAddress = undefined;
    await bounty.save({ session });

    // 2. Update the User document for this manager
    const user = await User.findOne({
      walletAddress: managerAddress,
    }).session(session);

    if (user) {
      // Remove this bounty from manager's team
      user.managerTeam = user.managerTeam.filter(
        (item: any) => item.networkName !== networkName
      );
      await user.save({ session });
    }

    // 3. Handle existing manager votes
    // Get all submissions where this manager has voted
    const submissions = await Submission.find({
      programName: networkName,
      "managerVote.vote": { $exists: true },
      status: { $in: ["pending", "reviewing"] },
    }).session(session);

    // Process each submission
    for (const submission of submissions) {
      // Reset manager vote
      submission.managerVote = undefined;
      await submission.save({ session });
    }

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
 * Gets the manager for a bounty program with their submission review status
 * @param networkName The name of the network/program
 * @returns Manager information or null if no manager
 */
export async function getManager(networkName: string) {
  // Get the bounty
  const bounty = await DisplayBounty.findOne({ networkName });

  if (!bounty || !bounty.managerAddress) {
    return null;
  }

  // Get all submissions for this program
  const submissions = await Submission.find({
    programName: networkName,
    status: { $ne: "rejected" },
  });

  // Find user document
  const user = await User.findOne({ walletAddress: bounty.managerAddress });

  // Calculate review statistics
  const reviewedCount = submissions.filter((sub) =>
    sub.managerVote && sub.managerVote.vote
  ).length;

  const pendingCount = submissions.length - reviewedCount;

  return {
    address: bounty.managerAddress,
    assignedDate:
      user?.managerTeam.find(
        (team: any) => team.networkName === networkName
      )?.assignedDate || null,
    reviewedSubmissions: reviewedCount,
    pendingSubmissions: pendingCount,
    lastActive: user?.lastLogin || null,
  };
}

/**
 * Checks if a user is a manager for a specific bounty program
 * @param networkName The name of the network/program
 * @param walletAddress The wallet address to check
 * @returns Boolean indicating if the user is a manager for the program
 */
export async function isManager(networkName: string, walletAddress: string) {
  if (!walletAddress) return false;
  
  const normalizedAddress = walletAddress.toLowerCase();
  const bounty = await DisplayBounty.findOne({ networkName });
  
  if (!bounty || !bounty.managerAddress) {
    return false;
  }
  
  return bounty.managerAddress.toLowerCase() === normalizedAddress;
}

/**
 * Changes the manager of a bounty program from the current one to a new address
 * @param networkName The name of the network/program
 * @param newManagerAddress The wallet address of the new manager
 * @returns The updated DisplayBounty document
 */
export async function changeManager(
  networkName: string,
  newManagerAddress: string
) {
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Normalize the address
    const normalizedAddress = newManagerAddress.toLowerCase();

    // 1. Get the bounty program
    const bounty = await DisplayBounty.findOne({ networkName }).session(
      session
    );

    if (!bounty) {
      throw new Error(`Bounty program "${networkName}" not found`);
    }

    // Check if there's an existing manager
    if (!bounty.managerAddress) {
      throw new Error(`No manager is currently assigned to this bounty`);
    }

    // Check if new manager is the same as current manager
    if (bounty.managerAddress === normalizedAddress) {
      throw new Error(
        `Manager ${normalizedAddress} is already assigned to this bounty`
      );
    }

    const oldManagerAddress = bounty.managerAddress;

    // 2. Update the old manager's User document
    const oldUser = await User.findOne({
      walletAddress: oldManagerAddress,
    }).session(session);

    if (oldUser) {
      // Remove this bounty from old manager's team
      oldUser.managerTeam = oldUser.managerTeam.filter(
        (item: any) => item.networkName !== networkName
      );
      await oldUser.save({ session });
    }

    // 3. Create or update the User document for the new manager
    let newUser = await User.findOne({ walletAddress: normalizedAddress }).session(
      session
    );

    if (!newUser) {
      // Create new user if they don't exist
      newUser = new User({
        walletAddress: normalizedAddress,
        managerTeam: [
          {
            bountyId: bounty._id,
            networkName: bounty.networkName,
            assignedDate: new Date(),
          },
        ],
      });
    } else {
      // Update existing user
      await newUser.updateManagerTeam(bounty._id.toString(), bounty.networkName);
    }

    await newUser.save({ session });

    // 4. Update the bounty with the new manager
    bounty.managerAddress = normalizedAddress;
    await bounty.save({ session });

    // 5. Handle existing manager votes
    // Get all submissions where the old manager has voted
    const submissions = await Submission.find({
      programName: networkName,
      "managerVote.vote": { $exists: true },
      status: { $in: ["pending", "reviewing"] },
    }).session(session);

    // Process each submission
    for (const submission of submissions) {
      // Reset manager vote
      submission.managerVote = undefined;
      await submission.save({ session });
    }

    await session.commitTransaction();
    return bounty;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
} 