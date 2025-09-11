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
            
            <div className="flex-1 p-8">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/figmaAssets/ellipse-6.png" alt="Customer" />
                  <AvatarFallback>CN</AvatarFallback>
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
