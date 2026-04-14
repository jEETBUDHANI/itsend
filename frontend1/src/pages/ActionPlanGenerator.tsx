import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ActionPlanGenerator() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Action Plan Generator</CardTitle>
          <CardDescription>
            Generate personalized action plans to achieve your career goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-gray-600">
            <p>Action plan generation coming soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
