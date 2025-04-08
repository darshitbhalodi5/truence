# Truence

Truence is a decentralized platform for identifying and recovering misused funds in the blockchain ecosystem through community oversight. The platform enables transparent reporting, public accountability, and empowers community members to uphold the integrity of the ecosystem.

## Overview

Truence allows users to:
- Create bounty programs for specific blockchain networks
- Submit reports of fund misuse
- Review and vote on submissions
- Verify and process payments for valid reports
- Track the status of submissions through a dashboard

The platform supports multiple user roles including submitters, reviewers, and managers, each with specific permissions and responsibilities.

## Features

- **Bounty Programs**: Create and manage bounty programs for different blockchain networks
- **Severity Classification**: Define severity levels (Critical, High, Medium, Low) with corresponding rewards
- **Misuse Range Categorization**: Classify reports by types of fund misuse
- **Multi-tier Review System**: Reports are evaluated by multiple reviewers to ensure fairness
- **KYC Verification**: Verify submitter identity before processing payments
- **Wallet Integration**: Connect with blockchain wallets for secure authentication
- **Dashboard**: Track submissions, reviews, and program status

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Privy for wallet-based authentication
- **File Storage**: MongoDB GridFS for file uploads and storage
- **Blockchain Integration**: Ethers.js, Wagmi

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Yarn package manager
- MongoDB instance

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/truence.git
   cd truence
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PRIVY_APP_ID=your_privy_app_id
   ```

4. Run the development server:
   ```bash
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app`: Next.js app directory with pages and API routes
- `/components`: Reusable UI components
- `/hooks`: Custom React hooks
- `/lib`: Utility functions and database connections
- `/models`: Mongoose schemas and models
- `/providers`: Application providers
- `/public`: Static assets
- `/types`: TypeScript type definitions
- `/utils`: Helper functions

## API Endpoints

The application includes various API endpoints for:
- Managing bounties
- Submitting and reviewing reports
- Handling user data and permissions
- File uploads and management

For more detailed structure, please read CODE_STRUCTURE.md file.