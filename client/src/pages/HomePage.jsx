// Homepage for MealMatch - Monthly meal subscription service
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  LogInIcon,
  SearchIcon,
  SendIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useAuth } from "../context/AuthContext";

// Import mock data
// TODO: API Integration - Replace mock data with real API calls
import { cooks } from "../mockData.js";

// Import existing sections
import { AboutUsSection } from "./sections/AboutUsSection";
import { CustomerTestimonialsSection } from "./sections/CustomerTestimonialsSection";
import { DeliveryPartnerSection } from "./sections/DeliveryPartnerSection";
import { FeaturedDishesSection } from "./sections/FeaturedDishesSection";
import { MenuSection } from "./sections/MenuSection";
import FeaturedDishCard from "../components/DishCard.jsx";

const navigationItems = [
  { label: "Services", hasDropdown: true },
  { label: "Menu", hasDropdown: true },
  { label: "Contact", hasDropdown: false },
];

const menuCategories = [
  {
    name: "Tiffin Items",
    icon: "/figmaAssets/2450-1.png",
    dishes: [
      {
        id: 1,
        name: "Masala Dosa",
        price: "₹80",
        image: "/figmaAssets/frame-14-1.png",
      },
      {
        id: 2,
        name: "Idli Sambar",
        price: "₹60",
        image: "/figmaAssets/frame-14-2.png",
      },
      {
        id: 3,
        name: "Pongal",
        price: "₹70",
        image: "/figmaAssets/frame-15.png",
      },
    ],
  },
  {
    name: "Biryani",
    icon: "/figmaAssets/image-2.png",
    dishes: [
      {
        id: 4,
        name: "Hyderabadi Biryani",
        price: "₹150",
        image: "/figmaAssets/frame-14-2.png",
      },
      {
        id: 5,
        name: "Seeraga Samba",
        price: "₹200",
        image: "/figmaAssets/frame-15.png",
      },
      {
        id: 6,
        name: "Chicken Biryani",
        price: "₹180",
        image: "/figmaAssets/frame-14-1.png",
      },
    ],
  },
  {
    name: "Non Veg Gravy",
    icon: "/figmaAssets/6-07-1.png",
    dishes: [
      {
        id: 7,
        name: "Chicken Curry",
        price: "₹120",
        image: "/figmaAssets/frame-14-1.png",
      },
      {
        id: 8,
        name: "Mutton Gravy",
        price: "₹180",
        image: "/figmaAssets/frame-14-2.png",
      },
      {
        id: 9,
        name: "Fish Curry",
        price: "₹140",
        image: "/figmaAssets/frame-15.png",
      },
    ],
  },
  {
    name: "Meals",
    icon: "/figmaAssets/3-01.png",
    dishes: [
      {
        id: 10,
        name: "South Indian Thali",
        price: "₹100",
        image: "/figmaAssets/frame-14-1.png",
      },
      {
        id: 11,
        name: "North Indian Thali",
        price: "₹120",
        image: "/figmaAssets/frame-14-2.png",
      },
      {
        id: 12,
        name: "Special Thali",
        price: "₹150",
        image: "/figmaAssets/frame-15.png",
      },
    ],
  },
  {
    name: "Variety Rice",
    icon: "/figmaAssets/28-15.png",
    dishes: [
      {
        id: 13,
        name: "Coconut Rice",
        price: "₹80",
        image: "/figmaAssets/frame-14-1.png",
      },
      {
        id: 14,
        name: "Lemon Rice",
        price: "₹70",
        image: "/figmaAssets/frame-14-2.png",
      },
      {
        id: 15,
        name: "Tomato Rice",
        price: "₹75",
        image: "/figmaAssets/frame-15.png",
      },
    ],
  },
];

const customerImages = [
  "/figmaAssets/ellipse-5.svg",
  "/figmaAssets/ellipse-6.png",
  "/figmaAssets/ellipse-7.png",
];

const footerSections = [
  {
    title: "About",
    links: ["About Us", "Features", "News", "Menu"],
  },
  {
    title: "Company",
    links: ["Why MealMatch?", "Partner With Us", "FAQ", "Blog"],
  },
  {
    title: "Support",
    links: [
      "Account",
      "Support Center",
      "Feedback",
      "Contact Us",
      "Accessibilty",
    ],
  },
];

const socialIcons = [
  { name: "Facebook", icon: "/figmaAssets/bx-bxl-facebook.svg" },
  { name: "Instagram", icon: "/figmaAssets/bx-bxl-instagram-alt.svg" },
  { name: "Twitter", icon: "/figmaAssets/akar-icons-twitter-fill.svg" },
];

// Cook Card Component
const CookCard = ({ cook }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    // Navigate to cook profile page
    navigate(`/cook/${cook.id}`);
  };

  return (
    <Card className="w-[280px] h-[400px] rounded-[30px] overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
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

// Dish Card Component
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

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(1); // Default to Biryani
  const [cookScrollPosition, setCookScrollPosition] = useState(0);

  const handleLoginClick = () => {
    if (user) {
      // Redirect to appropriate dashboard
      const dashboardPath =
        user.role === "student" ? "/student/dashboard" : "/cook/dashboard";
      navigate(dashboardPath);
    } else {
      navigate("/login");
    }
  };

  const handleCategorySelect = (index) => {
    setSelectedCategory(index);
  };

  const scrollCooks = (direction) => {
    const scrollAmount = 300;
    const newPosition =
      direction === "left"
        ? Math.max(0, cookScrollPosition - scrollAmount)
        : cookScrollPosition + scrollAmount;
    setCookScrollPosition(newPosition);
  };

  const selectedCategoryData = menuCategories[selectedCategory];

  return (
    <div className="bg-white w-full min-h-screen">
      <div className="bg-white w-full max-w-[1200px] mx-auto relative px-4">
        {/* Header Section */}
        <header className="relative w-full py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                className="w-[193px] h-[156px] object-cover"
                alt="Logo"
                src="/figmaAssets/1-3.png"
              />
            </div>

            <nav className="flex items-center gap-8">
              {navigationItems.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <span className="font-medium text-gray-700 text-sm">
                    {item.label}
                  </span>
                  {item.hasDropdown && (
                    <ChevronDownIcon className="w-2.5 h-2.5" />
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full"
              >
                <SearchIcon className="w-5 h-5" />
              </Button>
              <Button
                onClick={handleLoginClick}
                className="bg-[#28b26f] hover:bg-[#28b26f]/90 text-white px-6 py-2 rounded-[25px] flex items-center gap-2"
              >
                <LogInIcon className="w-4 h-4" />
                {user ? "Dashboard" : "Login"}
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Badge className="bg-[#28b26f4c] text-black hover:bg-[#28b26f4c] rounded-[50px] px-5 py-[11px] h-auto mb-8">
                <span className="font-medium text-[15px]">
                  More than Faster
                </span>
              </Badge>

              <h1 className="font-bold text-[48px] leading-[60px] text-[#010f1c] mb-4">
                Connect with Local <br />
                <span className="text-[#28b26f]">Home Cooks</span>
              </h1>

              <p className="font-medium text-gray-600 text-lg mb-8 max-w-[500px]">
                Monthly meal subscriptions from verified home cooks in
                Coimbatore. Fresh, homemade meals delivered to your doorstep.
              </p>

              <div className="mt-8">
                <Button className="bg-[#28b26f] hover:bg-[#28b26f]/90 text-white px-8 py-3 rounded-[25px] font-medium text-lg flex items-center gap-2">
                  Get Started
                  <ArrowRightIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 flex justify-center relative">
              <img
                className="w-[500px] h-[400px] object-cover"
                alt="Hero Image"
                src="/figmaAssets/image 46.png"
              />
              {/* Featured Dish Card positioned in front of the image */}
              <div className="absolute bottom-4 right-4 z-20">
                <FeaturedDishCard
                  dishName="Ghee Dosa"
                  price="₹40"
                  rating={4}
                  imageUrl="/figmaAssets/frame-14-1.png"
                />
              </div>
            </div>
          </div>
        </section>

        {/* What We Serve Section */}
        <section className="relative py-16">
          <div className="text-center">
            <p className="font-semibold text-[#28b26f] text-lg tracking-[2.88px] mb-8">
              WHAT WE SERVE
            </p>
            <h2 className="font-bold text-[#010f1c] text-[45px] leading-[60px] mb-16">
              Your Monthly Meal Subscription Partner
            </h2>
          </div>
        </section>

        

        {/* NEARBY COOKS Section */}
        <section className="relative py-16">
          <div className="text-center mb-16">
            <p className="font-semibold text-[#28b26f] text-lg tracking-[2.88px] mb-4">
              NEARBY COOKS
            </p>
            <h2 className="font-bold text-[#010f1c] text-[45px] leading-[60px] mb-8">
              Discover Home Cooks in Coimbatore
            </h2>
            <p className="font-medium text-gray-600 text-lg max-w-[600px] mx-auto">
              Connect with verified home cooks who prepare fresh, authentic
              meals. Each cook specializes in different cuisines and dietary
              preferences.
            </p>
          </div>

          {/* Horizontal Scrolling Cook Cards */}
          <div className="relative">
            <div
              className="flex gap-8 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollLeft: cookScrollPosition }}
            >
              {/* Duplicate cooks for infinite scroll effect */}
              {[...cooks, ...cooks].map((cook, index) => (
                <div key={`${cook.id}-${index}`} className="flex-shrink-0">
                  <CookCard cook={cook} />
                </div>
              ))}
            </div>

            {/* Scroll Buttons */}
            <Button
              onClick={() => scrollCooks("left")}
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </Button>
            <Button
              onClick={() => scrollCooks("right")}
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </Button>
          </div>
        </section>

        {/* Customer Testimonials Section */}
        <CustomerTestimonialsSection />

        {/* Menu Section */}
        <MenuSection />

        {/* About Us Section */}
        <AboutUsSection />

        {/* Delivery Partner Section */}
        <DeliveryPartnerSection />

        {/* Footer */}
        <footer className="relative py-16 mt-16">
          <div className="flex items-start gap-16 mb-16">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-8">
                <img
                  className="w-[193px] h-[156px] object-cover"
                  alt="Logo"
                  src="/figmaAssets/1-3.png"
                />
              </div>
              <p className="font-medium text-gray-600 text-lg max-w-[400px] mb-8">
                Connect with local home cooks for fresh, authentic meals
                delivered to your doorstep. Monthly subscriptions made simple.
              </p>
              <div className="flex gap-4">
                {socialIcons.map((social, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    className="w-12 h-12 rounded-full"
                  >
                    <img
                      className="w-6 h-6"
                      alt={social.name}
                      src={social.icon}
                    />
                  </Button>
                ))}
              </div>
            </div>

            {footerSections.map((section, index) => (
              <div key={index} className="flex-1">
                <h3 className="font-bold text-[#010f1c] text-xl mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="font-medium text-gray-600 hover:text-[#28b26f] transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="flex-1">
              <h3 className="font-bold text-[#010f1c] text-xl mb-6">
                Get In Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#28b26f] rounded-full flex items-center justify-center">
                    <SendIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Email</p>
                    <p className="font-medium text-[#010f1c]">
                      hello@mealmatch.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#28b26f] rounded-full flex items-center justify-center">
                    <SendIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Phone</p>
                    <p className="font-medium text-[#010f1c]">
                      +91 98765 43210
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-600">
                © 2024 MealMatch. All rights reserved.
              </p>
              <div className="flex gap-8">
                <a
                  href="#"
                  className="font-medium text-gray-600 hover:text-[#28b26f] transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="font-medium text-gray-600 hover:text-[#28b26f] transition-colors duration-200"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
