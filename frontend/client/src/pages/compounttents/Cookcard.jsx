import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { StarIcon } from "lucide-react";
import { Button } from "../../components/ui/button";

const CookCard = ({ cook }) => {
  // console.log(cook);
  
  const navigate = useNavigate();

  const handleViewProfile = () => {
    // Navigate to cook profile page
    navigate(`/cook/${cook._id}`);
  };

  return (
    <Card className="w-[280px] h-[450px] rounded-[30px] overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-0 h-full relative">
        {/* Profile Image */}
        <div className="w-full h-[200px] overflow-hidden">
          <img
            className="w-full h-full object-cover"
            alt={cook.name}
            src={cook.profileImage}
          />
        </div>

        {/* Cook Info */}
        <div className="p-6 flex flex-col justify-between h-[200px]">
          <div>
            <h3 className="font-bold text-[#010f1c] text-xl mb-2">
              {cook.name}
            </h3>
            <p className="font-medium text-[#28b26f] text-sm mb-2">
              {cook.specialty}
            </p>
            <p className="font-medium text-gray-600 text-sm mb-3">
              {cook.address}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(cook.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium text-gray-600 text-sm">
                {cook.rating}
              </span>
            </div>

            {/* Price */}
            <p className="font-bold text-[#28b26f] text-lg">
              ₹{cook.monthlyPrice}/month
            </p>
          </div>

          {/* View Button */}
          <Button
            onClick={handleViewProfile}
            className="w-full bg-[#28b26f] hover:bg-[#28b26f]/90 text-white font-medium py-2 rounded-[25px]"
          >
            View Menu
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


export default CookCard;