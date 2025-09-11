import React from "react";
import { StarIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const FeaturedDishCard = ({
  dishName = "Ghee Dosa",
  price = "₹40",
  rating = 4,
  imageUrl = "/figmaAssets/frame-14-1.png",
}) => {
  return (
    <Card className="w-[240px] h-[100px] rounded-[15px] overflow-hidden border-0 shadow-lg bg-white">
      <CardContent className="p-3 h-full flex items-center gap-3">
        {/* Dish Image */}
        <div className="w-[70px] h-[70px] rounded-[12px] overflow-hidden flex-shrink-0">
          <img
            className="w-full h-full object-cover"
            alt={dishName}
            src={imageUrl}
          />
        </div>

        {/* Dish Info */}
        <div className="flex-1 flex flex-col justify-between h-full py-1">
          {/* Dish Name */}
          <h3 className="font-bold text-[#010f1c] text-base leading-tight mb-1">
            {dishName}
          </h3>

          {/* Rating Stars */}
          <div className="flex items-center gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Price */}
          <p className="font-bold text-[#010f1c] text-lg">{price}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedDishCard;
