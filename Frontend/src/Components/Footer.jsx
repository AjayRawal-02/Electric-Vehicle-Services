import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-[#0f172a] text-white pt-12 pb-6 px-6" id="footer">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 text-sm text-gray-300">


                {/* Logo & Description */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <i className="fa-solid fa-bolt text-[#00e676] text-2xl"></i>
                        <span className="text-2xl font-bold text-[#00e676]">VoltCare</span>
                    </div>
                    <p className="mb-4 leading-relaxed">Your EV's most trusted companion in the Pink City</p>
                    <div className="flex flex-wrap gap-3">
                        <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs hover:bg-blue-500 transition">
                            24/7 Service
                        </button>
                        <button className="bg-green-600 text-white px-4 py-1.5 rounded-full text-xs hover:bg-green-500 transition">
                            Certified Buddies
                        </button>
                        {/* Social Media Links */}
                        <div className="flex justify-center md:justify-start mt-10 gap-6">
                            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-xl transition">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-xl transition">
                                <i className="fab fa-github"></i>
                            </a>
                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-xl transition">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-xl transition">
                                <i className="fab fa-youtube"></i>
                            </a>
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-xl transition">
                                <i className="fab fa-instagram"></i>
                            </a>
                        </div>

                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-semibold text-white mb-4 text-lg">Quick Links</h4>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-[#00e676] transition">Book Service</a></li>
                        <li><a href="#" className="hover:text-[#00e676] transition">Dashboard</a></li>
                        <li><a href="#" className="hover:text-[#00e676] transition">Track Booking</a></li>
                        <li><a href="#" className="hover:text-[#00e676] transition">Become a Buddy</a></li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h4 className="font-semibold text-white mb-4 text-lg">Legal</h4>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-[#00e676] transition">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-[#00e676] transition">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-[#00e676] transition">Refund Policy</a></li>
                    </ul>
                </div>

                {/* Service Areas */}
                <div>
                    <h4 className="font-semibold text-white mb-4 text-lg">Service Areas</h4>
                    <ul className="space-y-2">
                        <li>Malviya Nagar</li>
                        <li>Vaishali Nagar</li>
                        <li>C-Scheme</li>
                        <li>Mansarovar</li>
                        <li>Jagatpura</li>
                        <li>And 25+ more areas…</li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="text-center text-gray-400 text-xs mt-10 border-t border-gray-700 pt-4">
                © VoltCare 2025. All rights reserved. Made with <span className="text-red-400">❤️</span> in Jaipur
            </div>
        </footer>
    );
};

export default Footer;
