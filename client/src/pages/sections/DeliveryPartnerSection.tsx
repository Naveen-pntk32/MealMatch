import { ArrowRightIcon, StarIcon } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const DeliveryPartnerSection = (): JSX.Element => {
  return (
    <Card className="w-full h-[508px] rounded-[30px] overflow-hidden relative bg-[linear-gradient(359deg,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.21)_42%,rgba(0,0,0,0)_100%),url(../figmaAssets/frame-14-1.png)] bg-cover bg-center">
      <CardContent className="p-0 h-full relative">
        <div className="absolute bottom-[133px] left-[34px] w-[337px]">
          <h2 className="[font-family:'Poppins',Helvetica] font-medium text-white text-[34px] tracking-[0] leading-[22.4px]">
            HariBavan Hotel
          </h2>
        </div>

        <div className="absolute bottom-[97px] left-[30px]">
          <Badge className="bg-[#28b26f] hover:bg-[#28b26f] text-white rounded-[20px] px-[23px] py-[9px] h-[43px] flex items-center gap-2">
            <span className="[font-family:'DM_Sans',Helvetica] font-bold text-xl leading-[22.4px]">
              7.49
            </span>
            <StarIcon className="w-[25px] h-6 fill-white" />
          </Badge>
        </div>

        <div className="absolute bottom-[53px] left-[39px] flex items-center gap-4">
          <Button
            variant="ghost"
            className="p-0 h-auto text-white hover:bg-transparent"
          >
            <span className="[font-family:'Poppins',Helvetica] font-medium text-lg tracking-[0] leading-[22.4px]">
              Order Now
            </span>
          </Button>
          <ArrowRightIcon className="w-6 h-6 text-white" />
        </div>
      </CardContent>
    </Card>
  );
};
