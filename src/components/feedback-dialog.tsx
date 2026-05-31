"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Bug, Lightbulb, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const feedbackTypes = [
  { value: "general", label: "General", icon: MessageSquare, color: "text-indigo-600 bg-indigo-50" },
  { value: "bug", label: "Bug Report", icon: Bug, color: "text-red-600 bg-red-50" },
  { value: "feature", label: "Feature Request", icon: Lightbulb, color: "text-amber-600 bg-amber-50" },
] as const;

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const [type, setType] = useState<"general" | "bug" | "feature">("general");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message, rating: rating || undefined }),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setMessage("");
          setRating(0);
          setType("general");
          onOpenChange(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Feedback error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <Star className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Thank You!</h3>
            <p className="mt-1 text-sm text-slate-500">Your feedback helps us improve Ledgerly.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            We&apos;d love to hear your thoughts on Ledgerly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Feedback Type */}
          <div className="flex gap-2">
            {feedbackTypes.map((ft) => (
              <button
                key={ft.value}
                onClick={() => setType(ft.value)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-2.5 text-sm font-medium transition-all duration-200",
                  type === ft.value
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                )}
              >
                <ft.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{ft.label}</span>
              </button>
            ))}
          </div>

          {/* Rating */}
          <div>
            <Label className="mb-2 block">Rating (optional)</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star === rating ? 0 : star)}
                  className="transition-transform duration-150 hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-7 w-7",
                      star <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="feedback-message" className="mb-2 block">
              Your feedback
            </Label>
            <Textarea
              id="feedback-message"
              placeholder="Tell us what you think..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || loading}
          >
            {loading ? "Sending..." : "Send Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
