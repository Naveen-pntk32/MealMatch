// Homepage for MealMatch - Monthly meal subscription service
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRightIcon,
  ChevronDownIcon,
  LogInIcon,
  SearchIcon,
  SendIcon,
  StarIcon,
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useAuth } from '../context/AuthContext';

// Import mock data
// TODO: API Integration - Replace mock data with real API calls
import { cooks } from '../mockData.js';

// Import existing sections
import { AboutUsSection } from './sections/AboutUsSection';
import { CustomerTestimonialsSection } from './sections/CustomerTestimonialsSection';
import { DeliveryPartnerSection } from './sections/DeliveryPartnerSection';
import { FeaturedDishesSection } from './sections/FeaturedDishesSection';
import { MenuSection } from './sections/MenuSection';

const navigationItems = [
  { label: 'Services', hasDropdown: true },
  { label: 'Menu', hasDropdown: true },
  { label: 'Contact', hasDropdown: false },
];

const menuCategories = [
  { name: 'Tiffin Items', icon: '/figmaAssets/2450-1.png' },
  { name: 'Biryani', icon: '/figmaAssets/image-2.png', active: true },
  { name: 'Non Veg Gravy', icon: '/figmaAssets/6-07-1.png' },
  { name: 'Meals', icon: '/figmaAssets/3-01.png' },
  { name: 'Variety Rice', icon: '/figmaAssets/28-15.png' },
];

const customerImages = [
  '/figmaAssets/ellipse-5.svg',
  '/figmaAssets/ellipse-6.png',
  '/figmaAssets/ellipse-7.png',
];

const footerSections = [
  {
    title: 'About',
    links: ['About Us', 'Features', 'News', 'Menu'],
  },
  {
    title: 'Company',
    links: ['Why MealMatch?', 'Partner With Us', 'FAQ', 'Blog'],
  },
  {
    title: 'Support',
    links: [
      'Account',
      'Support Center',
      'Feedback',
      'Contact Us',
      'Accessibilty',
    ],
  },
];

const socialIcons = [
  { icon: '/figmaAssets/bx-bxl-instagram-alt.svg', alt: 'Instagram' },
  { icon: '/figmaAssets/bx-bxl-facebook.svg', alt: 'Facebook' },
  { icon: '/figmaAssets/akar-icons-twitter-fill.svg', alt: 'Twitter' },
];

// Cook Card Component
const CookCard = ({ cook }) => {
  const navigate = useNavigate();

  const handleCookClick = () => {
    // TODO: API Integration - Track cook card clicks for analytics
    navigate(`/cook/${cook.id}`);
  };

  return (
    <Card 
      className="w-[273px] h-[508px] rounded-[30px] overflow-hidden bg-cover bg-center cursor-pointer hover:transform hover:scale-105 transition-transform duration-300"
      style={{
        backgroundImage: `linear-gradient(359deg,rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.21) 42%,rgba(0,0,0,0) 100%), url(${cook.profileImage})`
      }}
      onClick={handleCookClick}
    >
      <CardContent className="p-6 h-full flex flex-col justify-end">
        <div className="mb-4">
          <div className="bg-[#28b26f] rounded-[20px] px-6 py-2 inline-flex items-center gap-2 mb-8">
            <span className="font-bold text-white text-xl">
              {cook.rating}
            </span>
            <StarIcon className="w-[25px] h-6 fill-white text-white" />
          </div>
          {cook.isVeg && (
            <Badge className="bg-green-100 text-green-800 mb-4">
              Pure Veg
            </Badge>
          )}
        </div>

        <h3 className="font-medium text-white text-[28px] mb-2">
          {cook.name}
        </h3>
        
        <p className="font-medium text-white/90 text-sm mb-2">
          {cook.specialty}
        </p>
        
        <p className="font-medium text-white/80 text-xs mb-4">
          {cook.address}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-white">
            <span className="text-sm">From </span>
            <span className="font-bold text-lg">₹{cook.monthlyPrice}/month</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-white text-sm">
              View Menu
            </span>
            <ArrowRightIcon className="w-4 h-4 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLoginClick = () => {
    if (user) {
      // Redirect to appropriate dashboard
      const dashboardPath = user.role === 'student' ? '/student/dashboard' : '/cook/dashboard';
      navigate(dashboardPath);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-white w-full min-h-screen">
      <div className="bg-white w-full max-w-[1440px] mx-auto relative">
        {/* Header Section */}
        <header className="relative w-full px-4 py-4">
          <div className="flex items-center justify-between max-w-[1307px] mx-auto">
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
              <SearchIcon className="w-[22px] h-[22px]" />
              <img
                className="w-[26px] h-[25px]"
                alt="Cart"
                src="/figmaAssets/group-2.png"
              />
              <Button 
                className="bg-[#28b26f] hover:bg-[#28b26f]/90 rounded-[50px] px-5 py-[11px] h-auto"
                onClick={handleLoginClick}
              >
                <LogInIcon className="w-4 h-4 mr-2" />
                <span className="font-medium text-white text-sm">
                  {user ? 'Dashboard' : 'Login'}
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative px-4 py-8">
          <div className="max-w-[1307px] mx-auto relative">
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
                  Monthly meal subscriptions from verified home cooks in Coimbatore. 
                  Fresh, homemade meals delivered to your doorstep.
                </p>

                <div className="mt-8">
                  <div className="flex items-center gap-4 mb-4">
                    {customerImages.map((src, index) => (
                      <img
                        key={index}
                        className="w-16 h-16 rounded-full"
                        alt="Customer"
                        src={src}
                      />
                    ))}
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold text-black text-[17px] mb-2">
                      Our Happy Students
                    </h3>
                    <div className="flex items-center gap-2">
                      <StarIcon className="w-[18px] h-[18px] fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-black text-[15px]">
                        4.8
                      </span>
                      <span className="font-medium text-gray-500 text-[15px]">
                        (2.5k Reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 relative">
                <img
                  className="w-[669px] h-[650px] object-cover"
                  alt="Food"
                  src="/figmaAssets/3-01.png"
                />

                <Card className="absolute bottom-8 right-8 w-[272px] bg-white rounded-[20px] shadow-[0px_4px_50px_#0000001a]">
                  <CardContent className="p-4 flex items-center gap-4">
                    <img
                      className="w-[113px] h-[97px] object-cover rounded"
                      alt="Monthly Meal"
                      src="/figmaAssets/rectangle-1.svg"
                    />
                    <div>
                      <h4 className="font-semibold text-black text-[15px] mb-2">
                        Monthly Subscription
                      </h4>
                      <img
                        className="w-[84px] h-3 mb-2"
                        alt="Rating"
                        src="/figmaAssets/group-6.png"
                      />
                      <div className="font-bold text-[10px]">
                        <span className="text-[#eb0029]">₹ </span>
                        <span className="text-black text-lg">3500</span>
                        <span className="text-gray-500 text-sm">/month</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <img
                  className="absolute top-8 left-8 w-[114px] h-[111px]"
                  alt="Frame"
                  src="/figmaAssets/frame-29.svg"
                />

                <img
                  className="absolute top-32 right-0 w-[81px] h-[149px]"
                  alt="Decoration"
                  src="/figmaAssets/group-53.png"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Customer Testimonials Section */}
        <CustomerTestimonialsSection />

        {/* What We Serve Section */}
        <section className="relative px-4 py-16">
          <div className="max-w-[1440px] mx-auto text-center">
            <p className="font-semibold text-[#28b26f] text-lg tracking-[2.88px] mb-8">
              WHAT WE SERVE
            </p>
            <h2 className="font-bold text-[#010f1c] text-[45px] leading-[60px] mb-16">
              Your Monthly Meal Subscription Partner
            </h2>
          </div>
        </section>

        {/* Nearby Cooks Section (Adapted from Restaurant List) */}
        <section className="relative px-4 py-16">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-16">
              <p className="font-semibold text-[#28b26f] text-lg tracking-[2.88px] mb-4">
                NEARBY COOKS
              </p>
              <h2 className="font-bold text-[#010f1c] text-[45px] leading-[60px] mb-8">
                Discover Home Cooks in Coimbatore
              </h2>
              <p className="font-medium text-gray-600 text-lg max-w-[600px] mx-auto">
                Connect with verified home cooks who prepare fresh, authentic meals. 
                Each cook specializes in different cuisines and dietary preferences.
              </p>
            </div>

            <div className="flex gap-8 justify-center flex-wrap">
              {/* TODO: API Integration - Fetch cooks from backend API */}
              {cooks.map((cook) => (
                <CookCard key={cook.id} cook={cook} />
              ))}
            </div>
          </div>
        </section>

        {/* Menu Section Header */}
        <section className="relative px-4 py-8">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="font-semibold text-[#28b26f] text-lg tracking-[2.88px] mb-4">
                  MEAL CATEGORIES
                </p>
                <h2 className="font-bold text-[#010f1c] text-[45px] leading-[60px]">
                  Variety That Always Satisfies Your Taste
                </h2>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-16 h-16 rounded-full"
                >
                  <img
                    className="w-8 h-8"
                    alt="Previous"
                    src="/figmaAssets/frame-48095867.svg"
                  />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-16 h-16 rounded-full"
                >
                  <img
                    className="w-8 h-8"
                    alt="Next"
                    src="/figmaAssets/frame-12.svg"
                  />
                </Button>
              </div>
            </div>

            {/* Menu Categories */}
            <div className="relative">
              <div className="absolute left-0 top-0 w-1.5 h-[573px] bg-gray-200 rounded-[20px]">
                <div className="h-[76px] bg-[#28b26f] rounded-[20px]" />
              </div>

              <div className="ml-16 space-y-8">
                {menuCategories.map((category, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div
                      className={`flex items-center gap-4 px-6 py-4 rounded-[50px] ${
                        category.active
                          ? 'bg-[#28b26f] text-white w-[254px]'
                          : 'text-black'
                      }`}
                    >
                      <div
                        className={`w-[52px] h-[52px] rounded-[30px] overflow-hidden ${
                          category.active ? 'bg-white' : ''
                        }`}
                      >
                        <img
                          className="w-12 h-12 object-cover"
                          alt={category.name}
                          src={category.icon}
                        />
                      </div>
                      <span className="font-medium text-2xl">
                        {category.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Dishes Section */}
        <FeaturedDishesSection />

        {/* Menu Section */}
        <MenuSection />

        {/* About Us Section */}
        <AboutUsSection />

        {/* Delivery Partner Section */}
        <DeliveryPartnerSection />

        {/* Footer */}
        <footer className="relative px-4 py-16 mt-16">
          <div className="max-w-[1440px] mx-auto">
            {/* Logo and Description */}
            <div className="flex items-start gap-16 mb-16">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-8">
                  <img
                    className="w-[37px] h-11"
                    alt="Logo"
                    src="/figmaAssets/frame.svg"
                  />
                  <h2 className="font-semibold text-[#28b26f] text-[32px]">
                    MealMatch
                  </h2>
                </div>
                <p className="font-medium text-gray-600 text-base leading-[30px] max-w-[297px]">
                  Connecting students with local home cooks for fresh, 
                  homemade meals delivered monthly.
                </p>

                <div className="flex gap-4 mt-8">
                  {socialIcons.map((social, index) => (
                    <img
                      key={index}
                      className="w-6 h-6"
                      alt={social.alt}
                      src={social.icon}
                    />
                  ))}
                </div>
              </div>

              {/* Footer Links */}
              {footerSections.map((section, index) => (
                <div key={index} className="flex-1">
                  <h3 className="font-semibold text-black text-xl mb-8">
                    {section.title}
                  </h3>
                  <div className="space-y-4">
                    {section.links.map((link, linkIndex) => (
                      <div key={linkIndex}>
                        <span className="font-medium text-gray-600 text-base leading-[30px]">
                          {link}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Contact Section */}
              <div className="flex-1">
                <h3 className="font-semibold text-black text-xl mb-8">
                  Get in Touch
                </h3>
                <p className="font-medium text-gray-600 text-lg leading-[30px] mb-4">
                  Question or feedback?
                </p>
                <p className="font-medium text-gray-600 text-lg leading-[30px] mb-8">
                  We'd love to hear from you
                </p>

                <div className="flex items-center gap-4 px-5 py-3.5 rounded-[60px] border border-gray-300">
                  <Input
                    placeholder="Email Address"
                    className="border-0 bg-transparent p-0 font-normal text-base"
                  />
                  <SendIcon className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;