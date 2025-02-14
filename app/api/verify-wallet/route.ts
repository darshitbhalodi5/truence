// app/api/verify-wallet/route.ts
import { ethers } from 'ethers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message, signature, walletAddress } = await request.json();

    // Create a message hash that follows Ethereum signed message format
    const messageBytes = ethers.toUtf8Bytes(message);
    const messageHash = ethers.keccak256(
      ethers.concat([
        ethers.toUtf8Bytes('\x19Ethereum Signed Message:\n'),
        ethers.toUtf8Bytes(String(messageBytes.length)),
        messageBytes
      ])
    );

    try {
      // Recover the signer's address from the signature
      const sig = ethers.Signature.from(signature);
      const recoveredAddress = ethers.recoverAddress(messageHash, sig);

      // Compare the recovered address with the provided wallet address
      const verified = recoveredAddress.toLowerCase() === walletAddress.toLowerCase();

      return NextResponse.json({ verified });
    } catch (err) {
      console.error('Invalid signature:', err);
      return NextResponse.json({ verified: false });
    }
  } catch (error) {
    console.error('Wallet verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify wallet signature' },
      { status: 400 }
    );
  }
}