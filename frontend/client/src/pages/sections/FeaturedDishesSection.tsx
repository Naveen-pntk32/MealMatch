import { ArrowRightIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const featuredDishes = [
  {
    id: 1,
    name: "hyderabadi biryani",
    price: "150",
    backgroundImage: "url(../figmaAssets/frame-14-2.png)",
  },
  {
    id: 2,
    name: "Seeraga Samba",
    price: "200",
    backgroundImage: "url(../figmaAssets/frame-15.png)",
  },
];

export const FeaturedDishesSection = (): JSX.Element => {
  return (
    <section className="w-full h-auto overflow-hidden">
      <div className="flex gap-[35px] w-full">
        {featuredDishes.map((dish) => (
          <Card
            key={dish.id}
            className="flex-1 h-[508px] rounded-[30px] overflow-hidden border-0 bg-cover bg-center bg-no-repeat relative"
            style={{
              backgroundImage: `linear-gradient(359deg,rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.21) 42%,rgba(0,0,0,0) 100%), ${dish.backgroundImage}`,
            }}
          >
            <CardContent className="p-0 h-full relative">
              <div className="absolute bottom-[131px] left-[39px] w-[369px]">
                <h3 className="[font-family:'Poppins',Helvetica] font-medium text-white text-[34px] tracking-[0] leading-[22.4px] mb-4">
                  {dish.name}
                </h3>
                <div className="[font-family:'Poppins',Helvetica] font-bold text-2xl tracking-[0] leading-[22.4px]">
                  <span className="text-[#f2c94c]">₹ </span>
                  <span className="text-white text-[34px]">{dish.price}</span>
                </div>
              </div>

              <Button
                variant="ghost"
                className="absolute bottom-[39px] left-[39px] h-auto p-0 bg-transparent hover:bg-transparent flex items-center gap-[10px]"
              >
                <span className="[font-family:'Poppins',Helvetica] font-medium text-white text-lg tracking-[0] leading-[22.4px]">
                  Order Now
                </span>
                <ArrowRightIcon className="w-6 h-6 text-white" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
