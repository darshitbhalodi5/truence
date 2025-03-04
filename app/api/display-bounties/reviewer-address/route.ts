import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import DisplayBounty from "@/models/DisplayBounty";

export async function GET() {
  try {
    await dbConnect();

    // Fetch only the networkName and reviewerAddresses fields
    const bounties = await DisplayBounty.find(
      {},
      "networkName reviewerAddresses"
    );

    return NextResponse.json({ success: true, data: bounties });
  } catch (error) {
    console.error("Error fetching bounties:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
