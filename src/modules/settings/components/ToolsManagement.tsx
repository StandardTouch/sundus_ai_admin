import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTools, toggleToolAction } from "../store";
import { Wrench, Loader2 } from "lucide-react";
import { showError } from "@/lib/utils/toast";

export default function ToolsManagement() {
  const dispatch = useAppDispatch();
  const { tools, isLoadingTools, isTogglingTool, error } = useAppSelector(
    (state) => state.settings
  );

  useEffect(() => {
    if (tools.length === 0) {
      dispatch(fetchTools());
    }
  }, [dispatch, tools.length]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  const handleToggle = async (toolName: string) => {
    await dispatch(toggleToolAction(toolName));
  };

  // Group tools by category
  const groupedTools = tools.reduce((acc, tool) => {
    const category = tool.category || "other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tool);
    return acc;
  }, {} as Record<string, typeof tools>);

  if (isLoadingTools && tools.length === 0) {
    return (
      <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--admin-primary)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <Wrench className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--admin-text)]">Tools Management</h3>
          <p className="text-sm text-[var(--admin-text-muted)]">
            Enable or disable tools available to the AI assistant
          </p>
        </div>
      </div>

      {tools.length === 0 ? (
        <div className="text-center py-8 text-[var(--admin-text-muted)]">
          No tools found
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTools).map(([category, categoryTools]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-[var(--admin-text-muted)] mb-3 uppercase tracking-wide">
                {category}
              </h4>
              <div className="space-y-3">
                {categoryTools.map((tool) => (
                  <div
                    key={tool._id}
                    className="flex items-start justify-between p-4 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-base font-semibold text-[var(--admin-text)]">
                          {tool.display_name}
                        </h5>
                        <span className="text-xs text-[var(--admin-text-muted)] bg-[var(--admin-bg-secondary)] px-2 py-0.5 rounded">
                          {tool.tool_name}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--admin-text-muted)] mt-1">
                        {tool.description}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center">
                      <button
                        type="button"
                        onClick={() => handleToggle(tool.tool_name)}
                        disabled={isTogglingTool[tool.tool_name]}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] focus:ring-offset-2 cursor-pointer disabled:opacity-50 ${
                          tool.is_enabled
                            ? "bg-[var(--admin-primary)]"
                            : "bg-[var(--admin-border)]"
                        }`}
                        aria-label={`Toggle ${tool.display_name}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            tool.is_enabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                        {isTogglingTool[tool.tool_name] && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-3 h-3 animate-spin text-white" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

