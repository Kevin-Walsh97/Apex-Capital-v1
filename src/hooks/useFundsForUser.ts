import { useStore } from '../store/useStore';

/**
 * Returns funds based on the current user's role:
 * - Advisor: All funds (cross-firm view)
 * - GP: Only funds belonging to the GP's firm
 * - LP: Not applicable (returns empty array)
 */
export function useFundsForUser() {
  const currentUser = useStore((s) => s.currentUser);
  const funds = useStore((s) => s.funds);
  const getFundsByFirm = useStore((s) => s.getFundsByFirm);

  if (!currentUser) return [];

  if (currentUser.role === 'Advisor') {
    // Advisors see all funds across all firms
    return funds;
  }

  if (currentUser.role === 'GP' && currentUser.firmId) {
    // GPs see only their firm's funds
    return getFundsByFirm(currentUser.firmId);
  }

  return [];
}

/**
 * Returns pipeline entries based on the current user's role:
 * - Advisor: All pipeline entries (cross-firm view)
 * - GP: Only pipeline entries for the GP's firm's funds
 */
export function usePipelineForUser() {
  const currentUser = useStore((s) => s.currentUser);
  const pipeline = useStore((s) => s.pipeline);
  const userFunds = useFundsForUser();

  if (!currentUser) return [];

  const fundIds = new Set(userFunds.map((f) => f.id));
  return pipeline.filter((p) => fundIds.has(p.fundId));
}
