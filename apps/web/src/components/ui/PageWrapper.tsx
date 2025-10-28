import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorState, LoadingState, EmptyState } from './ErrorStates';
import { useNetworkStatus } from '../hooks/useAsyncState';

interface PageWrapperProps {
  children: React.ReactNode;
  loading?: boolean;
  error?: Error | null;
  empty?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
  onRetry?: () => void;
  className?: string;
}

export function PageWrapper({
  children,
  loading = false,
  error = null,
  empty = false,
  emptyTitle = 'No data available',
  emptyMessage = 'There\'s nothing to show here yet.',
  emptyAction,
  onRetry,
  className = '',
}: PageWrapperProps) {
  const { isOnline } = useNetworkStatus();

  // Show network error if offline
  if (!isOnline) {
    return (
      <div className={`min-h-screen bg-fitness-background ${className}`}>
        <ErrorState
          type="network"
          title="You're offline"
          message="Please check your internet connection and try again."
          onRetry={onRetry}
        />
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className={`min-h-screen bg-fitness-background ${className}`}>
        <LoadingState message="Loading your data..." size="lg" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`min-h-screen bg-fitness-background ${className}`}>
        <ErrorState
          type="server"
          title="Something went wrong"
          message={error.message || 'An unexpected error occurred. Please try again.'}
          onRetry={onRetry}
        />
      </div>
    );
  }

  // Show empty state
  if (empty) {
    return (
      <div className={`min-h-screen bg-fitness-background ${className}`}>
        <EmptyState
          title={emptyTitle}
          message={emptyMessage}
          action={emptyAction}
        />
      </div>
    );
  }

  // Show content
  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-fitness-background ${className}`}>
        {children}
      </div>
    </ErrorBoundary>
  );
}

// Specialized page wrappers
export function GoalsPageWrapper({ children, ...props }: Omit<PageWrapperProps, 'emptyTitle' | 'emptyMessage'>) {
  return (
    <PageWrapper
      {...props}
      emptyTitle="No goals yet"
      emptyMessage="Create your first fitness goal to get started on your journey."
      emptyAction={{
        label: 'Create Goal',
        onClick: () => {
          // This would be handled by the parent component
          console.log('Create goal clicked');
        },
      }}
    >
      {children}
    </PageWrapper>
  );
}

export function WorkoutsPageWrapper({ children, ...props }: Omit<PageWrapperProps, 'emptyTitle' | 'emptyMessage'>) {
  return (
    <PageWrapper
      {...props}
      emptyTitle="No workouts yet"
      emptyMessage="Generate your first workout plan to start training."
      emptyAction={{
        label: 'Generate Plan',
        onClick: () => {
          console.log('Generate plan clicked');
        },
      }}
    >
      {children}
    </PageWrapper>
  );
}

export function VideosPageWrapper({ children, ...props }: Omit<PageWrapperProps, 'emptyTitle' | 'emptyMessage'>) {
  return (
    <PageWrapper
      {...props}
      emptyTitle="No videos found"
      emptyMessage="Search for workout videos or create a custom playlist."
      emptyAction={{
        label: 'Search Videos',
        onClick: () => {
          console.log('Search videos clicked');
        },
      }}
    >
      {children}
    </PageWrapper>
  );
}
