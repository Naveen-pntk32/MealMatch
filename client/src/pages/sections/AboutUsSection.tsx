import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export const AboutUsSection = (): JSX.Element => {
  return (
    <section className="w-full relative">
      <Card className="max-w-6xl mx-auto bg-white border-0 shadow-none">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row min-h-[494px]">
            <div className="w-full lg:w-[488px] bg-[#28b26fb2] flex-shrink-0" />

            <div className="flex-1 p-8 lg:p-16 lg:pl-8">
              <div className="mb-6">
                <div className="[font-family:'Poppins',Helvetica] font-semibold text-[#28b26f] text-lg tracking-[2.88px] leading-[22.4px] mb-6">
                  WHAT THEY SAY
                </div>

                <h2 className="[font-family:'Rubik',Helvetica] font-bold text-[#010f1c] text-[45px] leading-[60px] mb-8 max-w-[532px]">
                  What Our Customers Say About Us
                </h2>

                <blockquote className="[font-family:'Poppins',Helvetica] font-medium text-gray-1 text-xl leading-[30px] mb-12 max-w-[505px]">
                  "MealMatch is the best. Besides the many and delicious meals,
                  the service is also very good, especially in the very fast
                  delivey. I highly recommend Fudo to you".
                </blockquote>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src="/figmaAssets/ellipse-9-1.svg"
                    alt="Naveen"
                  />
                  <AvatarFallback>N</AvatarFallback>
                </Avatar>

                <div>
                  <div className="[font-family:'Poppins',Helvetica] font-medium text-black text-xl leading-[30px]">
                    Naveen
                  </div>
                  <div className="[font-family:'Poppins',Helvetica] font-medium text-gray-3 text-base leading-[30px]">
                    Student
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <img
                  className="w-[173px] h-[25px]"
                  alt="5 star rating"
                  src="/figmaAssets/group-7.png"
                />
                <span className="[font-family:'Poppins',Helvetica] font-medium text-black text-[15px] leading-[22.4px]">
                  4,8
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
