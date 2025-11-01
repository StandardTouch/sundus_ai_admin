import {
  Bot,
  MessageSquare,
  BarChart3,
  Settings,
  Users,
  LineChart,
  Search,
  UserCircle,
  Star,
} from "lucide-react";

export default function ChatbotDashboard() {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/80 border-r border-slate-800 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <Bot className="w-8 h-8 text-blue-500" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              ChatBot Admin
            </h1>
          </div>

          <nav className="space-y-2">
            {[
              { icon: <BarChart3 className="w-5 h-5" />, label: "Dashboard" },
              { icon: <MessageSquare className="w-5 h-5" />, label: "Conversations" },
              { icon: <LineChart className="w-5 h-5" />, label: "Analytics" },
              { icon: <Users className="w-5 h-5" />, label: "Training" },
              { icon: <Settings className="w-5 h-5" />, label: "Settings" },
            ].map((item, i) => (
              <button
                key={i}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-4 flex items-center gap-3">
          <UserCircle className="w-8 h-8 text-slate-400" />
          <div>
            <p className="font-semibold">Admin User</p>
            <p className="text-xs text-slate-500">admin@chatbot.ai</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Dashboard Overview</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder:text-slate-500"
              />
            </div>
            <button className="p-2 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800">
              <Settings className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            {
              title: "Total Conversations",
              value: "12,340",
              change: "+18% from last month",
              color: "from-blue-600 to-cyan-500",
            },
            {
              title: "Active Users",
              value: "2,345",
              change: "+5% this week",
              color: "from-purple-600 to-pink-500",
            },
            {
              title: "Response Accuracy",
              value: "94.2%",
              change: "+2.1% improvement",
              color: "from-green-600 to-emerald-500",
            },
            {
              title: "Satisfaction Score",
              value: "4.8 / 5",
              change: "↑ steady performance",
              color: "from-yellow-500 to-orange-400",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-blue-600/10 transition-all"
            >
              <p className="text-sm text-slate-400">{item.title}</p>
              <h3 className="text-2xl font-bold mt-2 mb-1 bg-gradient-to-r text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                {item.value}
              </h3>
              <p className="text-xs text-slate-500">{item.change}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-3">Message Volume (Last 7 days)</h3>
            <div className="h-48 flex items-end gap-2">
              {[40, 60, 30, 70, 90, 80, 50].map((height, i) => (
                <div
                  key={i}
                  style={{ height: `${height}%` }}
                  className="w-full bg-gradient-to-t from-blue-700 to-blue-400 rounded"
                ></div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-3">Response Time Trend</h3>
            <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
              <LineChart className="w-6 h-6 mr-2 text-purple-400" />
              Line chart placeholder (backend data integration ready)
            </div>
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Conversations</h3>
          <ul className="divide-y divide-slate-800">
            {[
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
            ].map((chat, i) => (
              <li key={i} className="flex justify-between items-center py-3">
                <div>
                  <p className="font-semibold">{chat.user}</p>
                  <p className="text-slate-400 text-sm">{chat.message}</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <p>{chat.time}</p>
                  <div className="flex">
                    {Array.from({ length: chat.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" />
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
