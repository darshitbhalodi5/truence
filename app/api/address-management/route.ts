import { NextRequest, NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongodb";
import { listReviewers, addReviewer, removeReviewer } from "@/utils/reviewerManagement";

export async function GET(
  req: Request,
) {
  try {
    await connectMongoose();
    const { searchParams } = new URL(req.url);
    const networkName = searchParams.get("networkName");

    if (!networkName) {
      return NextResponse.json(
        { error: "Invalid network name" },
        { status: 400 }
      );
    }

    const reviewers = await listReviewers(networkName);
    return NextResponse.json({ reviewers }, { status: 200 });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectMongoose();
    const { networkName } = await req.json();

    if (!networkName) {
      return NextResponse.json(
        { error: "Invalid network name" },
        { status: 400 }
      );
    }

    const senderAddress =
      req.headers.get("x-sender-address") || (await req.json()).senderAddress;

    if (!senderAddress) {
      return NextResponse.json(
        { error: "Sender address is required" },
        { status: 400 }
      );
    }

    const updatedBounty = await addReviewer(networkName, senderAddress);
    return NextResponse.json(
      { message: "Reviewer added successfully", bounty: updatedBounty },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectMongoose();
    const { networkName, address } = await req.json();

    if (!networkName || !address) {
      return NextResponse.json(
        { error: "Network name and address are required" },
        { status: 400 }
      );
    }

    const updatedBounty = await removeReviewer(networkName, address);
    return NextResponse.json(
      { message: "Reviewer removed successfully", bounty: updatedBounty },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
