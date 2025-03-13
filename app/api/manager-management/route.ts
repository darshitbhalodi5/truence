import { NextRequest, NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongodb";
import { getManager, addManager, removeManager, changeManager } from "@/utils/managerManagement";

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

    const manager = await getManager(networkName);
    return NextResponse.json({ manager }, { status: 200 });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectMongoose();
    const { networkName, managerAddress } = await req.json();

    if (!networkName || !managerAddress) {
      return NextResponse.json(
        { error: "Network name and manager address are required" },
        { status: 400 }
      );
    }

    const updatedBounty = await addManager(networkName, managerAddress);
    return NextResponse.json(
      { message: "Manager added successfully", bounty: updatedBounty },
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
    const { networkName } = await req.json();

    if (!networkName) {
      return NextResponse.json(
        { error: "Network name is required" },
        { status: 400 }
      );
    }

    const updatedBounty = await removeManager(networkName);
    return NextResponse.json(
      { message: "Manager removed successfully", bounty: updatedBounty },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectMongoose();
    const { networkName, newManagerAddress } = await req.json();

    if (!networkName || !newManagerAddress) {
      return NextResponse.json(
        { error: "Network name and new manager address are required" },
        { status: 400 }
      );
    }

    const updatedBounty = await changeManager(networkName, newManagerAddress);
    return NextResponse.json(
      { message: "Manager changed successfully", bounty: updatedBounty },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 