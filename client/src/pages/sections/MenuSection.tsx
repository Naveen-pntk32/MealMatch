import { ArrowRightIcon, StarIcon } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const MenuSection = (): JSX.Element => {
  return (
    <Card className="w-full max-w-[436px] h-[508px] rounded-[30px] overflow-hidden relative bg-[linear-gradient(359deg,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.21)_42%,rgba(0,0,0,0)_100%),url(../figmaAssets/frame-14-1.png)] bg-cover bg-center">
      <CardContent className="p-0 h-full relative">
        <div className="absolute bottom-[172px] left-[29px] w-[304px]">
          <h2 className="[font-family:'Poppins',Helvetica] font-medium text-white text-[34px] tracking-[0] leading-[22.4px]">
            Annapoorna
          </h2>
        </div>

        <div className="absolute bottom-[96px] left-[29px]">
          <Badge className="bg-[#28b26f] hover:bg-[#28b26f] rounded-[20px] h-[43px] w-28 flex items-center justify-center gap-2 px-[23px]">
            <span className="[font-family:'DM_Sans',Helvetica] font-bold text-white text-xl tracking-[0] leading-[22.4px]">
              7.49
            </span>
            <StarIcon className="w-[25px] h-6 fill-white text-white" />
          </Badge>
        </div>

        <div className="absolute bottom-[53px] left-[39px]">
          <Button
            variant="ghost"
            className="h-auto p-0 text-white hover:bg-transparent flex items-center gap-4"
          >
            <span className="[font-family:'Poppins',Helvetica] font-medium text-lg tracking-[0] leading-[22.4px]">
              Order Now
            </span>
            <ArrowRightIcon className="w-6 h-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
