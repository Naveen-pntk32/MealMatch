import { PlayIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

export const CustomerTestimonialsSection = (): JSX.Element => {
  return (
    <section className="flex flex-col items-start gap-[25px] w-full">
      <div className="flex flex-col w-full max-w-[470px] items-start gap-[22.4px]">
        <h2 className="self-stretch [font-family:'Poppins',Helvetica] font-bold text-black text-[64px] tracking-[0] leading-[50px]">
          Variety &amp; Choice in Your Study Table
        </h2>

        <div className="self-stretch [font-family:'Poppins',Helvetica] font-bold text-[#333333] text-lg leading-[0.1px]">
          Ready to order? Your stomach <br />
          says <span className="text-black">yes</span>
        </div>
      </div>

      <div className="flex items-center gap-[29px] flex-wrap">
        <Button className="w-[186px] h-[68px] bg-[#28b26f] hover:bg-[#28b26f]/90 rounded-[50px] [font-family:'Poppins',Helvetica] font-medium text-white text-lg">
          Get Started
        </Button>

        <Button
          variant="ghost"
          className="flex items-center gap-2 h-auto p-0 [font-family:'Poppins',Helvetica] font-medium text-gray-1 text-lg hover:bg-transparent"
        >
          <div className="w-[46px] h-[46px] flex items-center justify-center">
            <PlayIcon className="w-6 h-6 fill-current" />
          </div>
          Watch Video
        </Button>
      </div>
    </section>
  );
};
