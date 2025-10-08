import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const RestaurantListSection = (): JSX.Element => {
  const features = [
    {
      title: "Easy To Order",
      description: "You only need a few steps in ordering food",
      image: "/figmaAssets/order-food-pana-1.svg",
      alt: "Order food pana",
    },
    {
      title: "Fastest Delivery",
      description: "Delivery that is always ontime even faster",
      image: "/figmaAssets/take-away-rafiki-1.svg",
      alt: "Take away rafiki",
    },
    {
      title: "Best Quality",
      description: "Not only fast for us quality is also number one",
      image: "/figmaAssets/waiters-rafiki-1.svg",
      alt: "Waiters rafiki",
    },
  ];

  return (
    <section className="w-full relative">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center justify-center px-4">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="w-full max-w-[360px] border-0 shadow-none bg-transparent"
          >
            <CardContent className="flex flex-col items-center text-center p-0">
              <div className="mb-6">
                <img
                  className="w-[247px] h-[230px] object-contain"
                  alt={feature.alt}
                  src={feature.image}
                />
              </div>
              <h3 className="[font-family:'Poppins',Helvetica] font-bold text-black text-[28px] tracking-[0] leading-[70px] mb-4">
                {feature.title}
              </h3>
              <p className="[font-family:'Poppins',Helvetica] font-medium text-gray-1 text-lg text-center tracking-[0] leading-[30px] max-w-[356px]">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
