import { Loader2 } from 'lucide-react';

export function Spinner({ className = 'py-16' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-brand" />
    </div>
  );
}
