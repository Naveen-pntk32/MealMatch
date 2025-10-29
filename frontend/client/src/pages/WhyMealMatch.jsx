import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const WhyMealMatch = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Why MealMatch?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700">
              MealMatch connects students with nearby home cooks for affordable, homestyle meals.
              Enjoy convenient subscriptions, transparent pricing, and reliable delivery.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Homemade, hygienic, and tasty meals</li>
              <li>Weekly menus with monthly subscription</li>
              <li>Verified cooks with ratings and reviews</li>
              <li>Easy payments and flexible plans</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhyMealMatch;


