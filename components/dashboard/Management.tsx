import { roleBasedDashboardTypes } from "@/types/ComponentPropsType";

export function Management({walletAddress}:roleBasedDashboardTypes) {
    if(walletAddress === undefined) {
        return;
    }
    return (
        <>
    <h1>This component is for bounty manager</h1>
    <h1>{walletAddress}</h1>
    </>
    );
}