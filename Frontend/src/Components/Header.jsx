import React from 'react';
import header_img from '../assets/Header img.jpg';

const Header = () => {
  return (
    <div className="mt-4 relative w-full flex justify-center">
      <div className="relative w-[85%]">
        {/* Responsive image height */}
        <img
          src={header_img}
          alt="EV"
          className="w-full h-[400px] sm:h-[490px] md:h-[490px] lg:h-[490px] object-cover rounded"
        />

        {/* Overlay content */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 py-6 rounded">
          <div className="text-white text-center w-full max-w-3xl px-2 space-y-2 sm:space-y-3 md:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Your EV's Best BUDDY
            </h1>
            <h2 className="text-base sm:text-lg font-medium">In the Pink City</h2>
            <h2 className="text-sm sm:text-base font-normal">
              🔋 24/7 emergency charging • 🔧 Expert maintenance • 🏆 Premium care
            </h2>
            <h3 className="text-sm sm:text-base font-light ">
              Experience the future of EV services with authentic Rajasthani hospitality
            </h3>

            {/* Buttons - your styling kept intact */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button className="px-10 border bg-green-500 text-white py-2 rounded w-full sm:w-[355px] hover:bg-white hover:text-black hover:border border-black">
                <i className="fa-solid fa-bolt"></i> Book Your Buddy Now
              </button>
              <button className="px-10 border bg-white text-black py-2 rounded w-full sm:w-[355px] border-black hover:bg-gray-200">
                <i className="fa-solid fa-phone"></i> Emergency : +918955588289
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
