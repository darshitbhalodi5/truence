import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import DisplayBounty from "@/models/DisplayBounty";

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();

    const bounties = await DisplayBounty.find(
      {
        startDate: { $ne: null, $lte: now },
        $or: [{ endDate: null }, { endDate: { $gt: now } }],
      },
      "networkName logoUrl"
    )
      .sort({ lastUpdated: -1 })
      .lean()
      .exec();

    return NextResponse.json(bounties);
  } catch (error) {
    console.error("Error fetching bounty selection data:", error);
    return NextResponse.json(
      { error: "Failed to fetch bounty selection data" },
      { status: 500 }
    );
  }
}
