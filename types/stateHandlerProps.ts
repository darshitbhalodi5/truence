export interface StateHandlerProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingSpinner?: React.ReactNode;
  loadingText?: string;
  error?: string | null;
  errorTitle?: string;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  notAuthorized?: boolean;
  notAuthorizedTitle?: string;
  notAuthorizedMessage?: string;
}
