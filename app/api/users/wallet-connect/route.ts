import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    await connectMongoose();

    // Find or create user
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

    if (!user) {
      // Create new user
      user = await User.create({
        walletAddress: walletAddress.toLowerCase(),
        lastLogin: new Date()
      });
    } else {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    }

    return NextResponse.json({
      success: true,
      user: {
        walletAddress: user.walletAddress,
        submissions: user.submissions,
        reviewerTeam: user.reviewerTeam,
        managerTeam: user.managerTeam,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Wallet connection error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error processing wallet connection',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 