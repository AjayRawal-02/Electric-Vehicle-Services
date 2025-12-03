import React from 'react'

const ServiceForm = () => {
  return (
    <div>
        <div className="bg-[#effaf7]">
              {/* Progress Steps */}
             <div className="w-full overflow-x-auto">
          <div className="flex items-center justify-center gap-0 py-10 min-w-[400px] sm:min-w-full px-4 sm:px-10 md:px-20 lg:px-40">
            {["Service", "Vehicle", "Details", "Confirm"].map((step, index) => (
              <React.Fragment key={index}>
                {/* Step container */}
                <div className="flex flex-col items-center">
                  {/* Circle + connector in one row */}
                  <div className="flex items-center">
                    {/* Wrap circle in its own div */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold bg-[#108fee]`}>{index+1}
                      </div>
                      {/* Step label below circle only */}
                      <p className="text-sm mt-2 text-center">{step}</p>
                    </div>
        
                    {/* Connector Line */}
                    {index < 3 && (
                      <div className="h-[3px] w-[50px] sm:w-[80px] md:w-[100px] bg-gray-300 ml-2 mb-6 mr-2" />
                    )}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        
        
        
              {/* Vehicle Options */}
              <div className="bg-white w-[95%] md:w-[85%] lg:w-[75%] xl:w-[65%] m-auto rounded-xl shadow-sm p-10">
                <div className="text-2xl md:text-3xl font-bold text-center p-2">Select Your Vehicle</div>
        
                {[
                  { icon: "fa-car-side", title: "Electric Car", models: ["Tata Nexon EV", "MG ZS EV", "Hyundai Kona", "Mahindra eVerito"] },
                  { icon: "fa-motorcycle", title: "Electric Bike", models: ["Revolt RV400", "Tork Kratos", "Ultraviolette F77", "Oben Rorr"] },
                  { icon: "fa-motorcycle", title: "Electric Scooter", models: ["Ola S1", "Ather 450X", "TVS iQube", "Hero Vida"] },
                  { icon: "fa-truck", title: "Commercial Vehicle", models: ["Mahindra Treo", "Piaggio Ape E-City", "Tata Ace EV"] },
                ].map((vehicle, i) => (
                  <div
                    key={i}
                    className="border-2 border-gray-200 flex flex-col sm:flex-row items-center p-4 sm:p-6 my-4 rounded-lg hover:border-blue-500 transition-all duration-200"
                  >
                    {/* Icon */}
                    <div className="w-20 h-20 bg-[#dbeafe] rounded-full flex items-center justify-center text-blue-600 text-xl font-bold mb-4 sm:mb-0 sm:mr-6">
                      <i className={`fa-solid ${vehicle.icon}`}></i>
                    </div>
        
                    {/* Text Content */}
                    <div className="flex-1 w-full">
                      <div className="font-bold text-xl md:text-2xl mb-4 text-center sm:text-left">{vehicle.title}</div>
                      <ul className="flex flex-wrap justify-center sm:justify-start gap-3">
                        {vehicle.models.map((model, j) => (
                          <li
                            key={j}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md text-center whitespace-nowrap"
                          >
                            {model}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
                <div className='flex justify-between'>
                  <div><button className='border border-gray-500 py-1 px-3 rounded-lg shadow-sm items-center'><i class="fa-solid fa-arrow-left"></i> Previous</button></div>
                  <div><button className='border border-gray-500 py-1 px-3 rounded-lg shadow-sm items-center bg-blue-400 text-white'>Next <i className="fa-solid fa-arrow-right"></i></button></div>
              </div>
              </div>
              
            </div>
    </div>
  )
}

export default ServiceForm