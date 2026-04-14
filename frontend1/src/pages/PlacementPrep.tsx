import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlacementPrep() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Placement Preparation</CardTitle>
          <CardDescription>
            Prepare for placements with mock interviews and skill assessments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-gray-600">
            <p>Placement preparation resources coming soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
