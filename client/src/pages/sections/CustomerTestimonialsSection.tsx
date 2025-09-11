import React from "react";
import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const CustomerTestimonialsSection = (): JSX.Element => {
  return (
    <section className="relative py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Image Area */}
          <div className="relative order-1 md:order-1">
            {/* Decorative Background Shape */}
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#28b26f] rounded-full opacity-20 blur-xl"></div>
            <div className="absolute top-16 -right-4 w-24 h-24 bg-[#28b26f] rounded-full opacity-15 blur-lg"></div>
            
            {/* Main Image Container */}
            <div className="relative z-10 rounded-2xl shadow-2xl h-[400px] bg-[#28b26f] ">
              {/* TODO: Replace with actual customer image */}
              <img
                className="w-full max-w-md mx-auto h-full object-cover z-20 overflow-visible  absolute  bottom-20 left-14"
                alt="Happy Customer"
                src="/figmaAssets/delivery man 1.png"
              />
            </div>

            {/* Floating Decorative Icons */}
            <div className="absolute top-8 right-8 w-8 h-8 bg-[#28b26f] rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            
            <div className="absolute bottom-16 left-4 w-6 h-6 bg-yellow-400 rounded-full shadow-lg"></div>
            
            <div className="absolute top-32 left-8 w-4 h-4 bg-[#28b26f] rounded-full shadow-md"></div>
          </div>

          {/* Right Column - Text Content */}
          <div className="order-2 md:order-2 space-y-8">
            {/* Eyebrow Heading */}
            <div>
              <p className="font-semibold text-[#28b26f] text-lg tracking-[2.88px] uppercase mb-4">
                WHAT THEY SAY
              </p>
            </div>

            {/* Main Heading */}
            <div>
              <h2 className="font-bold text-[#010f1c] text-[45px] leading-[60px] mb-8">
                What Our Customers Say About Us
              </h2>
            </div>

            {/* Testimonial Quote */}
            <div className="relative">
              {/* Large Decorative Quotation Mark */}
              <div className="absolute -top-4 -left-4">
                <span className="text-[#28b26f] text-8xl font-bold opacity-20 leading-none">"</span>
              </div>
              
              <blockquote className="relative z-10 font-medium text-gray-700 text-xl leading-relaxed pl-8 italic">
                {/* TODO: Replace with actual customer testimonial */}
                This is the best service ever. The quality is amazing, and the delivery was incredibly fast. I would highly recommend this to anyone looking for a great experience.
              </blockquote>
            </div>

            {/* Reviewer Information */}
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                {/* TODO: Replace with actual reviewer avatar */}
                <AvatarImage src="/figmaAssets/ellipse-6.png" alt="Customer Avatar" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              
              <div>
                <h4 className="font-bold text-[#010f1c] text-xl leading-tight">
                  {/* TODO: Replace with actual reviewer name */}
                  Likitha
                </h4>
                <p className="font-medium text-gray-600 text-base">
                  {/* TODO: Replace with actual reviewer title/role */}
                  Student
                </p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-6 h-6 ${
                      i < 4 
                        ? "text-yellow-400 fill-current" 
                        : i === 4 
                        ? "text-yellow-400 fill-current opacity-80" // Represents 0.8 rating
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-[#010f1c] text-xl">
                {/* TODO: Replace with actual rating */}
                4.8
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
