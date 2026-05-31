import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Building2, MessageSquare } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== "duraidigiinfolab@gmail.com") {
    redirect("/dashboard");
  }

  // Fetch Global Stats
  const [totalUsers, totalInvoices, totalClients, totalFeedbacks] = await Promise.all([
    prisma.user.count(),
    prisma.invoice.count(),
    prisma.client.count(),
    prisma.feedback.count(),
  ]);

  // Fetch all feedback with user details
  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { email: true, name: true, businessName: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="pl-[260px] transition-all duration-300">
        <div className="p-8 max-w-5xl mx-auto animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 mt-2">
              Global statistics and user feedback across Ledgerly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Users</p>
                    <h3 className="text-2xl font-bold text-slate-900">{totalUsers}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Invoices Generated</p>
                    <h3 className="text-2xl font-bold text-slate-900">{totalInvoices}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <Building2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Clients Managed</p>
                    <h3 className="text-2xl font-bold text-slate-900">{totalClients}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Feedback Submitted</p>
                    <h3 className="text-2xl font-bold text-slate-900">{totalFeedbacks}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-xl font-semibold text-slate-900 mb-4">All User Feedback</h2>
          <div className="grid gap-4">
            {feedbacks.length === 0 ? (
              <Card className="border-dashed shadow-none bg-slate-50/50">
                <CardContent className="flex flex-col items-center justify-center h-48 text-center">
                  <p className="text-slate-500 font-medium">No feedback yet</p>
                </CardContent>
              </Card>
            ) : (
              feedbacks.map((item) => (
                <Card key={item.id} className="shadow-sm">
                  <CardHeader className="pb-3 flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2 mb-1">
                        {item.type === "bug" && <Badge variant="destructive">Bug</Badge>}
                        {item.type === "feature" && <Badge className="bg-indigo-500">Feature</Badge>}
                        {item.type === "general" && <Badge variant="secondary">General</Badge>}
                        
                        {item.rating && (
                          <span className="text-sm font-medium text-amber-500">
                            {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription>
                        From: <span className="font-medium text-slate-700">{item.user.email}</span> 
                        {item.user.businessName ? ` (${item.user.businessName})` : ""} • {item.createdAt.toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 whitespace-pre-wrap">{item.message}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
