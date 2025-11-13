import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Calendar, ChefHat, Save } from "lucide-react";


const MealPlanEditor = () => {
  const [meals, setMeals] = useState({
  Monday: "Chicken Biryani",
  Tuesday: "Fish Curry with Rice",
  Wednesday: "Paneer Butter Masala",
  Thursday: "Egg Fried Rice",
  Friday: "Mutton Curry with Parotta",
  Saturday: "Vegetable Pulao",
  Sunday: "Lemon Rice and Potato Fry",
});

const [changedMeals, setChangedMeals] = useState({});

const handleInputChange = (day, value) => {
  setMeals((prev) => ({ ...prev, [day]: value }));
  setChangedMeals((prev) => ({ ...prev, [day]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch("/api/update-meal-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changedMeals), // ✅ only send changed fields
    });

    if (response.ok) {
      toast({ title: "Success!", description: "Meal plan updated successfully" });
      setChangedMeals({}); // reset changed list
    } else throw new Error("Failed to update meal plan");
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to update meal plan. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <ChefHat className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Weekly Meal Planner</h1>
          </div>
          <p className="text-muted-foreground">
            Update your weekly meal menu for your customers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {Object.keys(meals).map((day) => (
  <Card
    key={day}
    className="overflow-hidden border-2 transition-all hover:shadow-lg hover:border-primary/50"
  >
    <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        <Calendar className="h-5 w-5 text-primary" />
        {day}
      </CardTitle>
      <CardDescription>Today's special menu</CardDescription>
    </CardHeader>
    <CardContent className="pt-6">
      <div className="space-y-2">
        <Label htmlFor={day} className="text-sm font-medium">
          Meal Name
        </Label>
        <Input
          id={day}
          value={meals[day]}
          onChange={(e) => handleInputChange(day, e.target.value)}
          placeholder={`Enter ${day}'s meal`}
          className="transition-all focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </CardContent>
  </Card>
))}

          </div>

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={false}
              className="group relative overflow-hidden px-8 py-6 text-lg font-semibold shadow-xl transition-all hover:shadow-2xl hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <Save className="h-5 w-5 transition-transform group-hover:rotate-12" />
                {false ? "Saving..." : "Save Meal Plan"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MealPlanEditor;