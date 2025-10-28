import React from 'react';
import { Button } from '@fitness-league/ui';
import { AlertTriangle, RefreshCw, Home, Wifi, WifiOff, Server, FileX, Search } from 'lucide-react';

interface ErrorStateProps {
  type?: 'network' | 'server' | 'notFound' | 'unauthorized' | 'generic';
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  className?: string;
}

const errorConfigs = {
  network: {
    icon: WifiOff,
    title: 'Connection Problem',
    message: 'Please check your internet connection and try again.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
  server: {
    icon: Server,
    title: 'Server Error',
    message: 'Something went wrong on our end. We\'re working to fix it.',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  notFound: {
    icon: FileX,
    title: 'Not Found',
    message: 'The page or resource you\'re looking for doesn\'t exist.',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
  },
  unauthorized: {
    icon: AlertTriangle,
    title: 'Access Denied',
    message: 'You don\'t have permission to access this resource.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
  },
  generic: {
    icon: AlertTriangle,
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try again.',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
};

export function ErrorState({
  type = 'generic',
  title,
  message,
  onRetry,
  onGoHome,
  className = '',
}: ErrorStateProps) {
  const config = errorConfigs[type];
  const Icon = config.icon;

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className={`w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center mb-4`}>
        <Icon className={`w-8 h-8 ${config.color}`} />
      </div>
      
      <h3 className="text-lg font-semibold text-fitness-foreground mb-2">
        {title || config.title}
      </h3>
      
      <p className="text-fitness-muted-foreground mb-6 max-w-md">
        {message || config.message}
      </p>

      <div className="flex gap-3">
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="default"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}
        
        {onGoHome && (
          <Button
            onClick={onGoHome}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        )}
      </div>
    </div>
  );
}

// Specialized error components
export function NetworkError({ onRetry, className }: { onRetry?: () => void; className?: string }) {
  return (
    <ErrorState
      type="network"
      onRetry={onRetry}
      className={className}
    />
  );
}

export function ServerError({ onRetry, className }: { onRetry?: () => void; className?: string }) {
  return (
    <ErrorState
      type="server"
      onRetry={onRetry}
      className={className}
    />
  );
}

export function NotFoundError({ onGoHome, className }: { onGoHome?: () => void; className?: string }) {
  return (
    <ErrorState
      type="notFound"
      onGoHome={onGoHome}
      className={className}
    />
  );
}

export function UnauthorizedError({ onGoHome, className }: { onGoHome?: () => void; className?: string }) {
  return (
    <ErrorState
      type="unauthorized"
      onGoHome={onGoHome}
      className={className}
    />
  );
}

// Empty state component
interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = Search,
  title,
  message,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-fitness-primary/10 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-fitness-primary" />
      </div>
      
      <h3 className="text-lg font-semibold text-fitness-foreground mb-2">
        {title}
      </h3>
      
      <p className="text-fitness-muted-foreground mb-6 max-w-md">
        {message}
      </p>

      {action && (
        <Button
          onClick={action.onClick}
          variant="default"
          className="flex items-center gap-2"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Loading state component
interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingState({
  message = 'Loading...',
  size = 'md',
  className = '',
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-fitness-primary border-t-transparent mb-4`} />
      <p className="text-fitness-muted-foreground">{message}</p>
    </div>
  );
}
