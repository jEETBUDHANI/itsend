import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CareerSwitchSimulator() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Career Switch Simulator</CardTitle>
          <CardDescription>
            Simulate career transitions and explore new career paths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-gray-600">
            <p>Career switch simulation coming soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
