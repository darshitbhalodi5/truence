import { Document, Model } from 'mongoose';

interface IUser extends Document {
  walletAddress: string;
  reviewerTeam: { bountyId: string; networkName: string; }[];
  managerTeam: { bountyId: string; networkName: string; }[];
}

export interface IUserModel extends Model<IUser> {
  findByWallet(walletAddress: string): Promise<IUser | null>;
}