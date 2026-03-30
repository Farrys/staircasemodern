import type { PropsWithChildren } from 'react';

export function PageWrapper({ children }: PropsWithChildren) {
  return (
    <main className="container-page section-enter relative py-10 sm:py-12">
      <div className="content-veil" />
      <div className="relative z-10">{children}</div>
    </main>
  );
}
