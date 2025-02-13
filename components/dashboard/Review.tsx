import { roleBasedDashboardTypes } from "@/types/ComponentPropsType";

export function Review({walletAddress}:roleBasedDashboardTypes) {
    if(walletAddress === undefined) {
        return;
    }
    return (
        <>
    <h1>This component is for reviewer</h1>
    <h1>{walletAddress}</h1>
    </>
    );
}