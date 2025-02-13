import { roleBasedDashboardTypes } from "@/types/ComponentPropsType";

export function Submission({walletAddress}:roleBasedDashboardTypes) {
    if(walletAddress === undefined) {
        return;
    }
    return (
        <>
    <h1>This component is for submitter</h1>
    <h1>{walletAddress}</h1>
    </>
    )
}