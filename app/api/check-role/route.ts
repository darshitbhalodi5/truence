import { NextResponse } from 'next/server';
import User from '@/models/User';
import { IUserModel } from '@/types/roleCheck';

const UserModel = User as IUserModel;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const user = await UserModel.findByWallet(walletAddress.toLowerCase());

    if (!user) {
      return NextResponse.json({
        isReviewer: false,
        isManager: false,
        message: 'User not found'
      });
    }

    return NextResponse.json({
      isReviewer: user.reviewerTeam?.length > 0,
      isManager: user.managerTeam?.length > 0
    });

  } catch (error) {
    console.error('Error in checking dashboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}