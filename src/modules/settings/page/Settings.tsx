import { SupportPhoneNumber, ToolsManagement } from "../components";

export default function Settings() {
  return (
    <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full lg:w-auto bg-[var(--admin-bg)] text-[var(--admin-text)]">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[var(--admin-text)]">Settings</h2>
          <p className="text-sm text-[var(--admin-text-muted)]">
            Manage application settings and configurations
          </p>
        </div>

        {/* Support Phone Number */}
        <SupportPhoneNumber />

        {/* Tools Management */}
        <ToolsManagement />
      </div>
    </main>
  );
}

