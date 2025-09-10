import { PlayIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

export const CustomerTestimonialsSection = (): JSX.Element => {
  return (
    <section className="relative py-16">
      <div className="text-center">
        <p className="font-semibold text-[#28b26f] text-lg tracking-[2.88px] mb-4">
          WHAT THEY SAY
        </p>
        <h2 className="font-bold text-[#010f1c] text-[45px] leading-[60px] mb-8">
          What Our Customers Say About Us
        </h2>
        <p className="font-medium text-gray-600 text-lg max-w-[600px] mx-auto mb-12">
          Don't just take our word for it. Here's what our satisfied customers have to say about their MealMatch experience.
        </p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="max-w-[600px] text-center">
          <h3 className="font-bold text-[#010f1c] text-[32px] leading-[40px] mb-6">
            "Fresh, authentic meals delivered right to my doorstep. MealMatch has made my college life so much easier!"
          </h3>
          <div className="flex items-center justify-center gap-4 mb-4">
            <img
              className="w-12 h-12 rounded-full object-cover"
              alt="Customer"
              src="/figmaAssets/ellipse-6.png"
            />
            <div>
              <p className="font-bold text-[#010f1c] text-lg">Rahul Kumar</p>
              <p className="font-medium text-gray-600 text-sm">Student, PSG College</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <Button className="bg-[#28b26f] hover:bg-[#28b26f]/90 text-white px-8 py-3 rounded-[25px] font-medium text-lg">
            Get Started
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 px-6 py-3 rounded-[25px] font-medium text-lg border-[#28b26f] text-[#28b26f] hover:bg-[#28b26f] hover:text-white"
          >
            <PlayIcon className="w-5 h-5" />
            Watch Video
          </Button>
        </div>
      </div>
    </section>
  );
};
