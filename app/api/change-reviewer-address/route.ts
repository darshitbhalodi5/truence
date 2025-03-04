import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { ReviewerAddress } from "@/models/ReviewerAddress";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    console.log("Request body:", body);

    if (!body.email || !body.programName) {
      return NextResponse.json(
        { error: "email and programName are required" },
        { status: 400 }
      );
    }

    const contact = await ReviewerAddress.create(body);

    return NextResponse.json({ success: true, data: contact }, { status: 201 });
  } catch (error: any) {
    console.error("Contact creation error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "Email already exists. Try with another email.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to create request for modification in reviewer addresses.",
      },
      { status: 500 }
    );
  }
}
