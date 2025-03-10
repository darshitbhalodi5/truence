import { NextRequest, NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongodb";
import User from "@/models/User";
import Submission from "@/models/Submission";
import DisplayBounty from "@/models/DisplayBounty";
import { GridFSBucket, ObjectId } from "mongodb";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectMongoose();
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address")?.toLowerCase();

    const user = await User.findOne({ walletAddress: address });
    if (!user) {
      return NextResponse.json(
        { error: "No submission was found from your wallet." },
        { status: 404 }
      );
    }

    const userSubmissions = await Submission.find({ walletAddress: address })
      .sort({ createdAt: -1 })
      .lean();

    const programNames = [
      ...new Set(userSubmissions.map((sub) => sub.programName)),
    ];
    const bountyDetails = await DisplayBounty.find({
      networkName: { $in: programNames },
    })
      .select("networkName logoUrl additionalPaymentRequired")
      .lean();

    const bountyLogoMap = bountyDetails.reduce(
      (
        map: Record<
          string,
          { logoUrl: string; additionalPaymentRequired: boolean }
        >,
        bounty: any
      ) => {
        map[bounty.networkName] = {
          logoUrl: bounty.logoUrl,
          additionalPaymentRequired: bounty.additionalPaymentRequired,
        };
        return map;
      },
      {}
    );

    const fileIds = userSubmissions
      .flatMap((sub) => sub.files || [])
      .map((fileUrl) => fileUrl.split("/").pop())
      .filter(Boolean)
      .map((id) => new ObjectId(id));

    let fileNames: Record<string, string> = {};
    if (fileIds.length > 0) {
      // Get MongoDB native connection
      const db = mongoose.connection.db;
      if (!db) throw new Error("Database connection failed");
      const bucket = new GridFSBucket(db);
      const files = await bucket.find({ _id: { $in: fileIds } }).toArray();

      fileNames = files.reduce((acc: Record<string, string>, file) => {
        acc[file._id.toString()] = file.metadata?.originalName || file.filename;
        return acc;
      }, {});
    }

    const enrichedSubmissions = userSubmissions.map((submission) => ({
      ...submission,
      bountyLogo: bountyLogoMap[submission.programName]?.logoUrl || null,
      additionalPaymentRequired:
        bountyLogoMap[submission.programName]?.additionalPaymentRequired ||
        false,
      progressStatus: submission.progressStatus,
      managerVote: submission.managerVote,
      fileNames: (submission.files || [])
        .map((fileUrl: string) => {
          const fileId = fileUrl.split("/").pop();
          return fileId ? fileNames[fileId] : null;
        })
        .filter(Boolean),
    }));

    return NextResponse.json({ submissions: enrichedSubmissions });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
