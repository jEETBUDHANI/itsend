import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface FeedbackFormProps {
    careerName: string;
    onSubmitSuccess?: () => void;
}

export function FeedbackForm({ careerName, onSubmitSuccess }: FeedbackFormProps) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [satisfied, setSatisfied] = useState<boolean | null>(null);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast({
                title: "Rating required",
                description: "Please select a rating before submitting",
                variant: "destructive",
            });
            return;
        }

        if (satisfied === null) {
            toast({
                title: "Satisfaction required",
                description: "Please indicate if you're satisfied with this recommendation",
                variant: "destructive",
            });
            return;
        }

        try {
            setSubmitting(true);
            const token = localStorage.getItem("token");

            await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/feedback/career`,
                {
                    career_id: careerName,
                    rating,
                    satisfied,
                    comment,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast({
                title: "Feedback submitted!",
                description: "Thank you for helping us improve our recommendations",
            });

            // Reset form
            setRating(0);
            setSatisfied(null);
            setComment("");

            if (onSubmitSuccess) {
                onSubmitSuccess();
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            toast({
                title: "Submission failed",
                description: "Please try again later",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Rate This Career Recommendation</CardTitle>
                <CardDescription>
                    Your feedback helps us improve our recommendations for everyone
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Star Rating */}
                    <div className="space-y-2">
                        <Label>How would you rate this recommendation?</Label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`h-8 w-8 ${star <= (hoveredRating || rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                            {rating > 0 && (
                                <span className="ml-2 text-sm text-muted-foreground self-center">
                                    {rating} / 5
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Satisfaction */}
                    <div className="space-y-2">
                        <Label>Are you satisfied with this recommendation?</Label>
                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant={satisfied === true ? "default" : "outline"}
                                onClick={() => setSatisfied(true)}
                                className="flex-1"
                            >
                                <ThumbsUp className="h-4 w-4 mr-2" />
                                Yes
                            </Button>
                            <Button
                                type="button"
                                variant={satisfied === false ? "default" : "outline"}
                                onClick={() => setSatisfied(false)}
                                className="flex-1"
                            >
                                <ThumbsDown className="h-4 w-4 mr-2" />
                                No
                            </Button>
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <Label htmlFor="comment">Additional Comments (Optional)</Label>
                        <Textarea
                            id="comment"
                            placeholder="Tell us more about your thoughts on this career recommendation..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                        />
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit Feedback"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
