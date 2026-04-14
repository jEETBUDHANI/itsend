import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CareerComparison() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Career Comparison</CardTitle>
          <CardDescription>
            Compare different careers side by side to make informed decisions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-gray-600">
            <p>Career comparison feature coming soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
