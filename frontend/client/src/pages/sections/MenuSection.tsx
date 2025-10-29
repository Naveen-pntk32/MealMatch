import { ArrowRightIcon, StarIcon } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type MenuSectionProps = {
  id?: string;
};

export const MenuSection = ({ id }: MenuSectionProps): JSX.Element => {
  return (
    <section id={id ?? "menu"} className="relative py-16">
      <div className="text-center">
        <p className="font-semibold text-[#28b26f] text-lg tracking-[2.88px] mb-8">
          OUR MENU
        </p>
        <h2 className="font-bold text-[#010f1c] text-[45px] leading-[60px] mb-16">
          Menu That Always Makes You Fall In Love
        </h2>
      </div>
    </section>
  );
};
