import { NextResponse } from "next/server";
import Bounty from "@/models/Bounty";
import dbConnect from "@/lib/mongodb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const networkName = searchParams.get("networkName");

  if (!networkName) {
    return NextResponse.json(
      { success: false, message: "Network name is required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const bounty = await Bounty.findOne({
      networkName,
      status: "active",
    })
      .select("networkName initialSeverities misUseRange")
      .lean();

    if (!bounty) {
      return NextResponse.json(
        { success: false, message: "Bounty not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: bounty }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bounty details:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
