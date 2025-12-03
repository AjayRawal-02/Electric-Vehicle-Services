import React from 'react'

const Features = () => {
    return (
        <div className='mt-4'>
            <div>
                <div className=' w-[300px] m-auto'><h2 className='text-center bg-orange-300 p-3 rounded'>🚀 Why Choose VoltCare?</h2></div>
                <h1 className="text-center text-3xl md:text-4xl font-bold p-2">
  Advanced Features for{" "}
  <span className="bg-gradient-to-tr from-blue-500 to-purple-500 bg-clip-text text-transparent">
    Modern EVs
  </span>
</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
  {[
    { icon: "fa-shield-halved", title: "100% Safe & Secure", desc: "Certified technicians with insurance coverage" },
    { icon: "fa-clock", title: "Quick Response", desc: "Average response time of 30–60 minutes" },
    { icon: "fa-location-dot", title: "Wide Coverage", desc: "Available across all major areas in Jaipur" },
    { icon: "fa-user-group", title: "Expert Team", desc: "Experienced and background-verified professionals" },
    { icon: "fa-medal", title: "Quality Assured", desc: "High-quality service with warranty" },
    { icon: "fa-headphones", title: "24/7 Support", desc: "Always available to help you" },
  ].map((item, index) => (
    <div key={index} className="bg-white rounded-2xl shadow-md p-6 text-center transition hover:shadow-lg">
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500">
        <i className={`fa-solid ${item.icon} text-white text-2xl`}></i>
      </div>
      <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
      <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
    </div>
  ))}
</div>


            </div>
        </div>
    )
}

export default Features