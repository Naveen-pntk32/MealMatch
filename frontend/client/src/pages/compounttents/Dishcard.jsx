const DishCard = ({ dish }) => {
  const handleOrderNow = () => {
    alert(`Added ${dish.name} to cart!`);
  };

  return (
    <Card className="w-[200px] h-[250px] rounded-[20px] overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0 h-full relative">
        {/* Dish Image */}
        <div className="w-full h-[120px] overflow-hidden">
          <img
            className="w-full h-full object-cover"
            alt={dish.name}
            src={dish.image}
          />
        </div>

        {/* Dish Info */}
        <div className="p-4 flex flex-col justify-between h-[130px]">
          <div>
            <h4 className="font-bold text-[#010f1c] text-sm mb-1">
              {dish.name}
            </h4>
            <p className="font-bold text-[#28b26f] text-lg">{dish.price}</p>
          </div>

          {/* Order Button */}
          <Button
            onClick={handleOrderNow}
            className="w-full bg-[#28b26f] hover:bg-[#28b26f]/90 text-white font-medium py-1 text-xs rounded-[15px]"
          >
            Order Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DishCard;