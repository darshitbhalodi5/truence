export function EthereumRules() {
    return (
        <section className="rules">
          <h2>Program Rules</h2>
          <ul>
            <li>
              <strong>Eligibility:</strong> Only verified community members (after completing KYC) can receive rewards.
            </li>
            <li>
              <strong>Submission Requirements:</strong> Reports must include clear, verifiable evidence of fund misappropriation.
            </li>
            <li>
              <strong>Reward Structure:</strong> Submissions are categorized into Low, Medium, and High severity. Each category offers a base ARB reward plus a bonus (5% of recovered funds, capped accordingly).
            </li>
            <li>
              <strong>Review Process:</strong> A designated review committee evaluates submissions. A consensus (e.g., 2 out of 3 reviewers) is needed for a report to be approved.
            </li>
            <li>
              <strong>Confidentiality:</strong> Reporter identities remain anonymous unless disclosure is required at the committee’s discretion.
            </li>
          </ul>
        </section>
      );
} 