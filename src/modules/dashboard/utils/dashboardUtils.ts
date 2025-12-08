export interface Conversation {
  user: string;
  message: string;
  time: string;
  rating: number;
}

export interface StatsData {
  title: string;
  value: string;
  change: string;
  gradientFrom: string;
  gradientTo: string;
}

export const getStatsData = (): StatsData[] => [
  {
    title: "Total Conversations",
    value: "12,340",
    change: "+18% from last month",
    gradientFrom: "var(--admin-primary-dark)",
    gradientTo: "var(--admin-accent-cyan)",
  },
  {
    title: "Active Users",
    value: "2,345",
    change: "+5% this week",
    gradientFrom: "var(--admin-secondary-dark)",
    gradientTo: "var(--admin-accent-pink)",
  },
  {
    title: "Response Accuracy",
    value: "94.2%",
    change: "+2.1% improvement",
    gradientFrom: "var(--admin-accent-green)",
    gradientTo: "var(--admin-accent-emerald)",
  },
  {
    title: "Satisfaction Score",
    value: "4.8 / 5",
    change: "↑ steady performance",
    gradientFrom: "var(--admin-accent-yellow)",
    gradientTo: "var(--admin-accent-orange)",
  },
];

export const getRecentConversations = (): Conversation[] => [
  {
    user: "Olivia Martin",
    message: "How can I reset my password?",
    time: "2m ago",
    rating: 5,
  },
  {
    user: "Jackson Lee",
    message: "Bot gave me the wrong info earlier.",
    time: "15m ago",
    rating: 3,
  },
  {
    user: "Sofia Davis",
    message: "Thanks! That really helped.",
    time: "30m ago",
    rating: 5,
  },
  {
    user: "William Kim",
    message: "Can I connect this to Slack?",
    time: "1h ago",
    rating: 4,
  },
];

