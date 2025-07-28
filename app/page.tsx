import Image from "next/image";
import { bg, illus, navbg } from "./assets";
import Link from "next/link"

import { useState } from "react";
export default function Home() {
  // const [url,seturl]=useState('/placelist')
  // const valid= auth()
  // if(valid)

  return (
    <div className="relative w-full h-screen bg-[url('./assets/bg.svg')]">
      <div className="relative z-10 h-screen">
      <div className="absolute w-full "><Link href='/placelist'><button className="mt-4 mr-4 md:mr-8 lg:mr-16 float-right relative z-40 h-[5.5vh] w-[15vh] text-sm font-semibold hover:border-2 hover:bg-green-700 text-white rounded-lg bg-green-500">Log In</button></Link></div>

        <div className="absolute z-0  overflow-hidden "><Image src={navbg} alt="" className="object-cover object-bottom  h-24 w-[300vh] "></Image></div>
      <div className="relative pt-4 pl-10 z-20 text-2xl text-white font-bold font-sans">feedkaro</div>
      <div className="flex flex-row items-center  justify-around  w-full h-[80vh] ">
        <div className="md:w-[45%] w-[100%]  h-[70vh] ml-5 md:ml-24 mt-20">
          <div className="lg:h-[30vh] md:h-[40vh] md:text-4xl text-white sm:h-[50vh] w-full md:w-[40vh] lg:w-[80vh] text-4xl  pt-7 lg:text-6xl">Empower Your <span className="text-[#8859EC]">Business</span> with Honest <span className="text-[#8859EC]">Feedback</span></div>
          <div className="mt-20 text-white font-thin">Register your organization, purchase feedback slots, and gain actionable feedback to improve your services</div>
          <div className="mt-5 font-thin text-white sm:text-xs md:text-sm lg:text-base">Browse registered places, share your experiences, and earn money for your valuable feedback</div>
        </div>
        <div className="w-[45%] "><Image src={illus} alt="" className="pt-6 float-end object-contain w-[150vh] h-[70vh] hidden md:block "></Image></div>
        
      </div>
      </div>
    </div>
    
  
  );
}
