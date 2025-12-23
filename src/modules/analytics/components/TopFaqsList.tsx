import type { TopFAQ } from "@/lib/api/analytics";

interface TopFaqsListProps {
  faqs: TopFAQ[];
}

export default function TopFaqsList({ faqs }: TopFaqsListProps) {
  return (
    <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-4">Top FAQs by Usage</h3>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="flex items-start justify-between p-3 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-[var(--admin-text-muted)] bg-[var(--admin-bg-secondary)] px-2 py-0.5 rounded">
                  #{index + 1}
                </span>
                <span className="text-xs text-[var(--admin-text-muted)] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">
                  {faq.category}
                </span>
              </div>
              <p className="text-sm text-[var(--admin-text)] font-medium line-clamp-2">{faq.question}</p>
            </div>
            <div className="ml-4 text-right">
              <p className="text-lg font-bold text-[var(--admin-text)]">{faq.usage_count}</p>
              <p className="text-xs text-[var(--admin-text-muted)]">uses</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

