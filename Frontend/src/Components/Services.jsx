import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  const serviceList = [
    {
      title: 'Emergency Buddy Rush',
      description: 'Urgent charging when you\'re stranded',
      features: ['24/7 Available', 'GPS Tracking', 'Emergency Support'],
      icon: 'fa-triangle-exclamation',
    },
    {
      title: 'Home Charging Setup',
      description: 'Professional installation at your doorstep',
      features: ['Certified Installers', 'Affordable Plans', 'Warranty Covered'],
      icon: 'fa-house-chimney',
    },
    {
      title: 'Battery Health Check',
      description: 'Keep your EV battery in top shape',
      features: ['Detailed Report', 'AI-Based Monitoring', 'Free Recommendations'],
      icon: 'fa-car-battery',
    },
    {
      title: 'On-Demand Maintenance',
      description: 'Quick fixes and scheduled care',
      features: ['Multi-Point Inspection', 'Doorstep Support', 'Genuine Parts'],
      icon: 'fa-tools',
    }
  ];

  return (
    <div className="px-2 sm:px-4 md:px-6 lg:px-12 py-6 bg-[#f9f9f9] " id='services'>
      <div className="p-2 bg-blue-300 w-fit mx-auto rounded text-blue-700 font-medium text-sm sm:text-base">
        <h2>🔧 Our Premium Services</h2>
      </div>

      <h1 className="text-center font-bold text-2xl sm:text-3xl lg:text-4xl my-4 text-black leading-tight">
        Complete EV Care with <span className="text-[#eb265a]">Rajasthani Touch</span>
      </h1>

      <p className="text-center text-gray-500 max-w-xl mx-auto text-sm sm:text-base px-2">
        From emergency charging to regular maintenance, your EV buddy provides comprehensive care with the warmth and reliability of Rajasthani hospitality.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-10 mx-10 md:mx-1">
        {serviceList.map((service, idx) => (
          <div
            key={idx}
            className="w-full p-4 sm:p-6 border border-gray-200 rounded-xl shadow-sm bg-white space-y-4 transition hover:shadow-md"
          >
            <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-gradient-to-tr from-yellow-500 to-red-500">
              <i className={`fa-solid ${service.icon} text-white text-xl sm:text-2xl`}></i>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-gray-800 text-center">{service.title}</h3>
            <p className="text-gray-500 text-sm text-center">{service.description}</p>

            <div className="text-gray-600 text-left text-sm space-y-1">
              {service.features.map((feature, i) => (
                <p key={i}>
                  <i className="fa-regular fa-circle-check text-green-500 mr-2"></i>
                  {feature}
                </p>
              ))}
            </div>

            <Link to="/book" className='mt-4 block'><button className="w-full py-2 rounded-md text-white font-semibold bg-[#00ba92] hover:bg-[#00a982] transition text-sm sm:text-base">
              Book Now
            </button></Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
