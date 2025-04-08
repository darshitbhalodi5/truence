# Project Code Structure

## App Directory (Backend APIs and Main Pages)

### Main Pages
- `Page.tsx` - Home page or landing page
- `Not-found.tsx` - Not found page (Imported from component dir)
- `Layout.tsx` - Layout file

### Routes/Directories
- `thank-you/` - Thank you page or route
- `submission/` - Submission page or route
- `dashboard/` - Dashboard page or route
- `bounties/create/` - Create bounty page or route
- `bounties/explore/` - Explore bounty page
- `bounties/explore/[network]/` - Specific program page or route

### API Endpoints
- `api/`
  - `address-management/` - Managing reviewers
  - `bounties/` - Store bounty details
  - `bounties/[network]/` - Get data of specific program
  - `bounties/form-data/` - Get submission parameters (misuserange, severity)
  - `change-reviewer-address/` - Store reviewer change data
  - `check-role/` - Check user role by address
  - `contact/` - Store contact info from bounty creation
  - `display-bounties/` - Store/import bounty data
  - `display-bounties/[network]/` - Get/change specific bounty data
  - `display-bounties/reviewer-address/` - Get reviewer address
  - `files/[fileId]/` - Get file from MongoDB
  - `files/[fileId]/metadata/` - Get file metadata
  - `manager-data/` - Get manager dashboard data
  - `manager-management/` - Managing managers
  - `reviewer-data/` - Get reviewer dashboard data
  - `submissions/` - Store submission data
  - `submissions/[submissionId]/payment-confirmation/` - Payment confirmation
  - `submissions/[submissionId]/status/` - Change submission status
  - `submissions/[submissionId]/verify-kyc/` - KYC verification
  - `submissions/[submissionId]/vote/` - Voting on reports
  - `submitter-data/` - Get submitter dashboard data
  - `submitter-form-selection/` - Get bounty data for submission
  - `upload/` - File upload to MongoDB
  - `users/[address]/reports/` - Get user details

## Components Directory (Frontend)

- `coming-soon/` - Coming soon component
- `arbitrum-watchdog/`, `optimism/`, `solana/` - Program-specific components
- `create-bounty-page/` - Bounty creation page
- `custom-toast/` - Custom toast configuration
- `dashboard/` - Dashboard components with chat
- `dashboard-page/` - Main dashboard page
- `explore-bounty-page/` - Bounty explorer
- `explore-bountydetails-page/` - Program details
- `manager-program-summary/` - Manager summary
- `multi-purpose-loader/` - Loading component
- `navbar/` - Navigation bar
- `no-bounties/` - No bounties component
- `not-found-page/` - 404 page
- `payment-progressbar/` - Payment status
- `program-closed/` - Closed program info
- `report-submission-page/` - Report submission
- `reviewer-program-summary/` - Reviewer summary
- `severity-change/` - Severity mismatch
- `sort-icon/` - Sort icon
- `state-handle/` - State management
- `submission-details/` - Submission info
- `thank-you-page/` - Thank you page
- `tooltip/` - Tooltip component
- `view-file/` - File viewer
- `vote-modal/` - Voting popup
- `bounty-card` - Bounty explorer card
- `bounty-header` - Program header
- `bounty-rewards` - Rewards display

## Hooks Directory (Frontend)
- `usePin` - Pin/unpin submissions
- `useWallet` - Wallet connection

## Lib Directory (DB/Backend)
- `mongodb/` - MongoDB connection

## Models Directory (DB/Backend)
- Various database models

## Providers Directory
- `privyProvider/` - Application providers

## Public Directory
- `Fonts/` - Font files
- `Assets/` - Image files

## Types Directory
- Various application types

## Utils Directory
- `fileConfig` - File upload config
- `managerManagement` - Manager DB changes
- `reviewerManagement` - Reviewer DB changes
- `parseMisuseRange` - Filter parsing
- `networkCurrency` - Network currencies
- `mapBounties` - Program components