import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Contact } from "@/models/Contact";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const contact = await Contact.create(body);

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
      { success: false, error: "Failed to create contact" },
      { status: 500 }
    );
  }
}
