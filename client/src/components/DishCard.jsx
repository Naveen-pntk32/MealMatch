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
    <Card className="w-[280px] h-[120px] rounded-[20px] overflow-hidden border-0 shadow-lg bg-white">
      <CardContent className="p-4 h-full flex items-center gap-4">
        {/* Dish Image */}
        <div className="w-[80px] h-[80px] rounded-[15px] overflow-hidden flex-shrink-0">
          <img
            className="w-full h-full object-cover"
            alt={dishName}
            src={imageUrl}
          />
        </div>

        {/* Dish Info */}
        <div className="flex-1 flex flex-col justify-between h-full py-2">
          {/* Dish Name */}
          <h3 className="font-bold text-[#010f1c] text-lg leading-tight">
            {dishName}
          </h3>

          {/* Rating Stars */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-4 h-4 ${
                  i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Price */}
          <p className="font-bold text-[#28b26f] text-xl">{price}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedDishCard;
