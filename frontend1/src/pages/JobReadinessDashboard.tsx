import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function JobReadinessDashboard() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Readiness Dashboard</CardTitle>
          <CardDescription>
            Track your readiness for your target job role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-gray-600">
            <p>Job readiness assessment coming soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
