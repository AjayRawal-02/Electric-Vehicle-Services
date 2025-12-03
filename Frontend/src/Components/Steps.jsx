import React from 'react';

const Steps = () => {
    const stepData = [
        {
            id: 1,
            icon: 'fa-phone',
            title: 'Book Your Buddy',
            desc: "Call, WhatsApp, or use our app to book your EV buddy. Tell us your location and what you need - we'll handle the rest!",
            color: 'bg-[#1e6cff]',
        },
        {
            id: 2,
            icon: 'fa-truck',
            title: 'Buddy On The Way',
            desc: "Your certified EV buddy gets dispatched immediately. Track their live location and get real-time updates on arrival time.",
            color: 'bg-[#00bf63]',
        },
        {
            id: 3,
            icon: 'fa-circle-check',
            title: 'Problem Solved!',
            desc: "Your buddy arrives with all necessary equipment, solves your EV problem, and ensures you're back on the road safely.",
            color: 'bg-[#a349f3]',
        },
    ];

    return (
        <div className="bg-[#f8f9fb] py-10 px-4" id='HIW'>
            <div className="bg-green-100 p-3 w-fit text-center rounded-md mx-auto mb-4 text-green-700 font-medium shadow">
                📱 Simple 3-Step Process
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
                How Your <span className="text-[#009f69]">EV BUDDY</span> Works
            </h1>

            <p className="text-gray-500 text-center max-w-2xl mx-auto mb-8">
                Getting help for your EV is as simple as 1-2-3. Experience the royal treatment with authentic Rajasthani hospitality and professional EV care.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {stepData.map((step) => (
                    <div key={step.id} className="p-6 rounded-full text-center ">
                        <div className="relative flex justify-center mb-4">
                            <div
                                className={`text-white text-3xl w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center ${step.color} shadow-[0_0_20px_rgba(0,0,0,0.2)]`}
                            >
                                <i className={`fa-solid ${step.icon}`}></i>
                            </div>
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center font-bold shadow">
                                {step.id}
                            </div>
                        </div>

                        <h2 className="text-xl font-bold mb-2">{step.title}</h2>
                        <p className="text-gray-600">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Steps;
