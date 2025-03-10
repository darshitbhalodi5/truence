import { NextRequest, NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongodb";
import User from "@/models/User";
import Submission from "@/models/Submission";
import DisplayBounty from "@/models/DisplayBounty";
import Bounty from "@/models/Bounty";
import { GridFSBucket, ObjectId } from "mongodb";
import mongoose from "mongoose";

// Define TypeScript interfaces for our data models
interface ReviewerTeamItem {
  bountyId: mongoose.Types.ObjectId;
  networkName: string;
  assignedDate: Date;
}

interface UserDoc {
  _id: mongoose.Types.ObjectId;
  walletAddress: string;
  reviewerTeam: ReviewerTeamItem[];
}

interface SubmissionFile {
  fileId: mongoose.Types.ObjectId;
  url: string;
  originalName?: string;
  type?: string;
  size?: number;
}

export async function GET(request: NextRequest) {
  try {
    await connectMongoose();
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address")?.toLowerCase();

    if (!address) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Find user and check if they're a reviewer
    const userDoc = await User.findOne({ walletAddress: address }).lean();

    // Type assertion - tell TypeScript this is a UserDoc
    const user = userDoc as unknown as UserDoc;

    // Safe checks with type safety
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.reviewerTeam || user.reviewerTeam.length === 0) {
      return NextResponse.json(
        { error: "User is not a reviewer for any bounties" },
        { status: 404 }
      );
    }

    // Get network names from the user's reviewer team
    const networkNames = user.reviewerTeam.map((team) => team.networkName);

    // Get bounty details (basic info + logo)
    const displayBounties = await DisplayBounty.find({
      networkName: { $in: networkNames },
    })
      .select("networkName logoUrl additionalPaymentRequired -_id")
      .lean();

    const bountyDetails = await Bounty.find({
      networkName: { $in: networkNames },
    })
      .select("networkName finalSeverity initialSeverities misUseRange -_id")
      .lean();

    // Create maps for quick lookups
    const bountyLogoMap = displayBounties.reduce(
      (
        map: Record<
          string,
          { logoUrl: string; additionalPaymentRequired: boolean }
        >,
        bounty: any
      ) => {
        map[bounty.networkName] = {
          logoUrl: bounty.logoUrl,
          additionalPaymentRequired: bounty.additionalPaymentRequired || false,
        };
        return map;
      },
      {}
    );

    const bountyDetailsMap = bountyDetails.reduce(
      (map: Record<string, any>, bounty: any) => {
        map[bounty.networkName] = {
          finalSeverity: bounty.finalSeverity,
          initialSeverities: bounty.initialSeverities,
          misUseRange: bounty.misUseRange,
        };
        return map;
      },
      {}
    );

    // Get submissions for bounties where user is a reviewer
    const submissionDocs = await Submission.find({
      programName: { $in: networkNames },
    })
      .select(
        "programName title description severityLevel files walletAddress status " +
          "progressStatus misUseRange reviewVotes managerVote reviewerSeverity createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    // Process file IDs if there are any submissions with files
    let fileMap: Record<string, any> = {};
    const fileIds: ObjectId[] = [];

    submissionDocs.forEach((sub) => {
      if (sub.files && Array.isArray(sub.files)) {
        sub.files.forEach((file: SubmissionFile) => {
          if (file && file.fileId) {
            fileIds.push(new ObjectId(file.fileId.toString()));
          }
        });
      }
    });

    if (fileIds.length > 0) {
      // Get MongoDB native connection
      const db = mongoose.connection.db;
      if (!db) throw new Error("Database connection failed");
      const bucket = new GridFSBucket(db);
      const files = await bucket.find({ _id: { $in: fileIds } }).toArray();

      fileMap = files.reduce((acc: Record<string, any>, file) => {
        acc[file._id.toString()] = {
          originalName: file.metadata?.originalName || file.filename,
          contentType: file.contentType,
        };
        return acc;
      }, {});
    }

    // Enrich submissions with bounty info
    const enrichedSubmissions = submissionDocs.map((submission) => {
      const networkName = submission.programName;
      return {
        ...submission,
        bountyInfo: {
          logo: bountyLogoMap[networkName]?.logoUrl || null,
          additionalPaymentRequired:
            bountyLogoMap[networkName]?.additionalPaymentRequired || false,
          ...(bountyDetailsMap[networkName] || {}),
        },
      };
    });

    return NextResponse.json({
      reviewer: {
        walletAddress: user.walletAddress,
        submissions: enrichedSubmissions,
        bounties: networkNames.map((name) => ({
          networkName: name,
          logoUrl: bountyLogoMap[name]?.logoUrl || null,
          additionalPaymentRequired:
            bountyLogoMap[name]?.additionalPaymentRequired || false,
          ...(bountyDetailsMap[name] || {}),
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching reviewer data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch reviewer data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
