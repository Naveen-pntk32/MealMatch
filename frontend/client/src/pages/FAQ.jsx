import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const FAQ = () => {
  const faqs = [
    { q: 'What is MealMatch?', a: 'A platform connecting students with verified home cooks for monthly meal plans.' },
    { q: 'How do subscriptions work?', a: 'Subscribe to a cook for a month and get daily meals as per their weekly menu.' },
    { q: 'How do I pay?', a: 'Secure online payments with popular gateways. Receipts and history in your dashboard.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">FAQ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {faqs.map((f, i) => (
              <div key={i} className="space-y-1">
                <h3 className="font-semibold text-lg">{f.q}</h3>
                <p className="text-gray-700">{f.a}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;


