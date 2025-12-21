import { AuthGuard } from "@/components/auth/auth-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { WorkflowProvider } from "@/contexts/workflow-context";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <WorkflowProvider>
        <div className="flex h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
          <Sidebar />
          <main className="flex-1 flex flex-col overflow-hidden">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>
      </WorkflowProvider>
    </AuthGuard>
  );
}

