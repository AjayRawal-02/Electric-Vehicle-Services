import React from 'react';

const Data = () => {
    return (
        <div className="px-4 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="border border-black p-4 text-center rounded">
                    <h1 className="text-2xl font-bold">2500+</h1>
                    <span className="block">Total Bookings</span>
                    <span className="block text-green-600">↗ +15% this month</span>
                </div>
                <div className="border border-black p-4 text-center rounded">
                    <h1 className="text-2xl font-bold">1800+</h1>
                    <span className="block">Happy Customers</span>
                    <span className="block text-green-600">↗ +15% this month</span>
                </div>
                <div className="border border-black p-4 text-center rounded">
                    <h1 className="text-2xl font-bold">45+</h1>
                    <span className="block">Active Buddies</span>
                    <span className="block text-green-600">↗ +15% this month</span>
                </div>
                <div className="border border-black p-4 text-center rounded">
                    <h1 className="text-2xl font-bold">4.8★</h1>
                    <span className="block">Ratings</span>
                    <span className="block text-green-600">↗ +15% this month</span>
                </div>
            </div>
        </div>
    );
};

export default Data;
