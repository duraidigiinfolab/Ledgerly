import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function FeedbackPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const feedbacks = await prisma.feedback.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="pl-[260px] transition-all duration-300">
        <div className="p-8 max-w-5xl mx-auto animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              User Feedback
            </h1>
            <p className="text-slate-500 mt-2">
              View all feedback submitted through the app.
            </p>
          </div>

          <div className="grid gap-4">
            {feedbacks.length === 0 ? (
              <Card className="border-dashed shadow-none bg-slate-50/50">
                <CardContent className="flex flex-col items-center justify-center h-48 text-center">
                  <p className="text-slate-500 font-medium">No feedback yet</p>
                  <p className="text-sm text-slate-400 mt-1">
                    When users submit feedback, it will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              feedbacks.map((item) => (
                <Card key={item.id} className="shadow-sm">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {item.type === "bug" && <Badge variant="destructive">Bug</Badge>}
                        {item.type === "feature" && <Badge className="bg-indigo-500">Feature</Badge>}
                        {item.type === "general" && <Badge variant="secondary">General</Badge>}
                        
                        {item.rating && (
                          <span className="text-sm font-medium text-amber-500">
                            {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {item.createdAt.toLocaleDateString()} at {item.createdAt.toLocaleTimeString()}
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
