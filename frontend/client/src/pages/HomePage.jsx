// HomePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  LogInIcon,
  SearchIcon,
  SendIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "../components/ui/command";
import { useAuth } from "../context/AuthContext";

import { CustomerTestimonialsSection } from "./sections/CustomerTestimonialsSection";
import { MenuSection } from "./sections/MenuSection";
import FeaturedDishCard from "../components/DishCard.jsx";
import CookCard from "./compounttents/Cookcard.jsx";

// Navigation & footer sections
  const navigationItems = [
    { label: "Services", hasDropdown: true, id: "services" },
    { label: "Menu", hasDropdown: true, id: "menu" },
    { label: "Contact", hasDropdown: false, id: "contact" },
  ];

const footerSections = [
  { title: "About", links: ["About Us", "Features", "News", "Menu"] },
  { title: "Company", links: ["Why MealMatch?", "Partner With Us", "FAQ", "Blog"] },
  { title: "Support", links: ["Account", "Support Center", "Feedback", "Contact Us", "Accessibilty"] },
];

const socialIcons = [
  { name: "Facebook", icon: "/figmaAssets/bx-bxl-facebook.svg" },
  { name: "Instagram", icon: "/figmaAssets/bx-bxl-instagram-alt.svg" },
  { name: "Twitter", icon: "/figmaAssets/akar-icons-twitter-fill.svg" },
];

// Fetch nearby cooks from backend
const fetchNearbyCooks = async (lat, lon) => {
  // console.log("called");
  
  try {
    const res = await fetch("http://localhost:3000api/nearByCook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
       credentials: "include",
      body: JSON.stringify({ lat, lon, radius: 10000 }), // 10km radius in meters
    });
    if (!res.ok) throw new Error("Failed to fetch nearby cooks");
    const data = await res.json();
    // console.log(data);
    
    return data.result || [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cooks, setCooks] = useState([]);
  const [cookScrollPosition, setCookScrollPosition] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);

  // Login button handler
  const handleLoginClick = () => {
    if (user) {
      const dashboardPath = user.role === "STUDENT" ? "/student/dashboard" : "/cook/dashboard";
      navigate(dashboardPath);
    } else navigate("/login");
  };

  // Scroll nearby cooks
  const scrollCooks = (direction) => {
    const scrollAmount = 300;
    const newPosition =
      direction === "left"
        ? Math.max(0, cookScrollPosition - scrollAmount)
        : cookScrollPosition + scrollAmount;
    setCookScrollPosition(newPosition);
  };

  // Get user's location and fetch nearby cooks
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const nearbyCooks = await fetchNearbyCooks(latitude, longitude );
          setCooks(nearbyCooks);
        },
        (err) => console.error("Geolocation error:", err)
      );
    } else console.error("Geolocation not supported");
  }, []);

  return (
    <div className="bg-white w-full min-h-screen">
      <div className="bg-white w-full max-w-[1200px] mx-auto relative px-4">
        {/* Header */}
        <header className="relative w-full py-4">
          <div className="flex items-center justify-between">
            <img className="w-[193px] h-[156px] object-cover" alt="Logo" src="/figmaAssets/1-3.png" />
            <nav className="flex items-center gap-8">
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    if (item.id) {
                      const el = document.getElementById(item.id);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      else navigate("/");
                    }
                  }}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700"
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && <ChevronDownIcon className="w-2.5 h-2.5" />}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <Button onClick={() => setSearchOpen(true)} variant="outline" size="icon" className="w-12 h-12 rounded-full">
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

        {/* Search Command Dialog */}
        <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
          <CommandInput placeholder="Search cooks or dishes..." />
          <CommandList>
            {cooks.length === 0 ? (
              <CommandEmpty>No nearby cooks available</CommandEmpty>
            ) : (
              cooks.map((cook) => (
                <CommandItem
                  key={cook._id}
                  onSelect={() => {
                    setSearchOpen(false);
                    navigate(`/cook/${cook._id}`);
                  }}
                >
                  {cook.name}
                </CommandItem>
              ))
            )}
          </CommandList>
        </CommandDialog>

        {/* Hero Section */}
        <section className="relative py-8 flex items-center justify-between">
          <div className="flex-1">
            <Badge className="bg-[#28b26f4c] text-black hover:bg-[#28b26f4c] rounded-[50px] px-5 py-[11px] h-auto mb-8">
              <span className="font-medium text-[15px]">More than Faster</span>
            </Badge>
            <h1 className="font-bold text-[48px] leading-[60px] text-[#010f1c] mb-4">
              Connect with Local <span className="text-[#28b26f]">Home Cooks</span>
            </h1>
            <p className="font-medium text-gray-600 text-lg mb-8 max-w-[500px]">
              Monthly meal subscriptions from verified home cooks in Coimbatore. Fresh, homemade meals delivered to your doorstep.
            </p>
            <Button onClick={() => navigate('/login', { state: { initialTab: 'register' } })} className="bg-[#28b26f] hover:bg-[#28b26f]/90 text-white px-8 py-3 rounded-[25px] font-medium text-lg flex items-center gap-2">
              Get Started <ArrowRightIcon className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex-1 flex justify-center relative">
            <img className="w-[500px] h-[400px] object-cover" alt="Hero" src="/figmaAssets/image 46.png" />
            <div className="absolute bottom-4 right-4 z-20">
              <FeaturedDishCard dishName="Ghee Dosa" price="₹40" rating={4} imageUrl="/figmaAssets/frame-14-1.png" />
            </div>
          </div>
        </section>

        {/* What We Serve */}
        <section id="services" className="relative py-16 text-center">
          <p className="font-semibold text-[#28b26f] text-lg tracking-[2.88px] mb-8">WHAT WE SERVE</p>
          <h2 className="font-bold text-[#010f1c] text-[45px] leading-[60px] mb-16">
            Your Monthly Meal Subscription Partner
          </h2>
        </section>

        {/* Nearby Cooks */}
        <section className="relative py-16">
          <div className="text-center mb-16">
            <p className="font-semibold text-[#28b26f] text-lg tracking-[2.88px] mb-4">NEARBY COOKS</p>
            <h2 className="font-bold text-[#010f1c] text-[45px] leading-[60px] mb-8">
              Discover Home Cooks Near You
            </h2>
            <p className="font-medium text-gray-600 text-lg max-w-[600px] mx-auto">
              Connect with verified home cooks who prepare fresh, authentic meals.
            </p>
          </div>
          <div className="relative">
            <div className="flex gap-8 overflow-x-auto scrollbar-hide pb-4" style={{ scrollLeft: cookScrollPosition }}>
              {cooks.length === 0 ? (
                <p className="text-gray-500 mx-auto">No nearby cooks found.</p>
              ) : (
                cooks.map((cook) => (
                  <div key={cook._id} className="flex-shrink-0">
                    <CookCard cook={cook} />
                  </div>
                ))
              )}
            </div>
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

        {/* Menu Section */}
        <MenuSection />

        {/* Customer Testimonials */}
        <CustomerTestimonialsSection />

  {/* Footer */}
  <footer className="relative py-16 mt-16">
          <div className="flex items-start gap-16 mb-16">
            <div className="flex-1">
              <img className="w-[193px] h-[156px] object-cover mb-8" alt="Logo" src="/figmaAssets/1-3.png" />
              <p className="font-medium text-gray-600 text-lg max-w-[400px] mb-8">
                Connect with local home cooks for fresh, authentic meals delivered to your doorstep. Monthly subscriptions made simple.
              </p>
              <div className="flex gap-4">
                {socialIcons.map((social, index) => (
                  <Button key={index} variant="outline" size="icon" className="w-12 h-12 rounded-full">
                    <img className="w-6 h-6" alt={social.name} src={social.icon} />
                  </Button>
                ))}
              </div>
            </div>
            {footerSections.map((section, index) => (
              <div key={index} className="flex-1">
                <h3 className="font-bold text-[#010f1c] text-xl mb-6">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="font-medium text-gray-600 hover:text-[#28b26f] transition-colors duration-200">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div id="contact" className="flex-1">
              <h3 className="font-bold text-[#010f1c] text-xl mb-6">Get In Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#28b26f] rounded-full flex items-center justify-center">
                    <SendIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Email</p>
                    <p className="font-medium text-[#010f1c]">hello@mealmatch.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#28b26f] rounded-full flex items-center justify-center">
                    <SendIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Phone</p>
                    <p className="font-medium text-[#010f1c]">+91 98765 43210</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 flex items-center justify-between">
            <p className="font-medium text-gray-600">© 2024 MealMatch. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="font-medium text-gray-600 hover:text-[#28b26f] transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="font-medium text-gray-600 hover:text-[#28b26f] transition-colors duration-200">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
