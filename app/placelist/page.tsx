"use client"
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { useEffect, useState } from 'react';
import axios from 'axios';

const placelist = () => {
  const [isediting, setisediting] = useState(false)  
  const [id, setId] = useState('id')     
  const [clerk_id, setClerk_id] = useState('clerk_id')           
  const [name, setName] = useState('-')               
  const [earning, setEarning] = useState(0)     
  const [account_no, setAccount_no] = useState('account_no')       
  const [ifsc_code, setIfsc_code] = useState('ifsc_code')        
  const [bank_name, setBank_name] = useState('bank_name')      
  const [user_name_in_bank, setUser_name_in_bank] = useState('username in bank')  
  const [feed_count, setFeed_count] = useState(0)  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/us")
        const data = response.data

        setId(data.id)
        setClerk_id(data.clerk_id)
        setName(data.name)
        setEarning(data.earning)
        setAccount_no(data.account_no)
        setIfsc_code(data.ifsc_code)
        setBank_name(data.bank_name)
        setUser_name_in_bank(data.user_name_in_bank)
        setFeed_count(data.feed_count)
        console.log(data)
      } catch (err) {
        console.error('Error:', err)
      }
    }

    fetchData()
  }, [])
  const handleUpdate = async () => {
    try {
      const response = await axios.post("/api/updateuser", {
        clerk_id: clerk_id,
        name:name,
        account_no: account_no,
        earning:earning,
        ifsc_code: ifsc_code,
        bank_name: bank_name,
        user_name_in_bank: user_name_in_bank,
        feed_count: feed_count
      });
      console.log(response.data);
      setisediting(false);
    } catch (err) {
      console.error('Error:', err);
    }
  };
  return (
    <div className="flex flex-row items-stretch">
      <div className=" container bg-[#212D31] pt-12 h-screen w-[21%]">
        
        <div className="flex flex-col items-center w-[100%]">
         <div><UserButton afterSignOutUrl="/" /></div>
         <div className="text-4xl font-mono">{name}</div>
         <div className="text-lg text-green-500 px-7  bg-[#36484F]">Earning : {earning}</div>
        </div>
        <div className="h-[45vh] m-1 mt-[23%] rounded-md ">
          <div className="text-xs text-[#425861] ml-4 mb-1">ACCOUNT INFO</div>
          <div className="flex flex-col gap-2 bg-[#2E3E43] mx-3 p-1 px-2 pt-4 rounded-md">
            <div>
              <div className="text-xs text-[#536d77]">Bank name</div>
              {(isediting)?<input 
              className="text-[9.5px] font-light bg-[#425861]  px-3 w-[100%] h-5" 
              value={bank_name} 
              onChange={(e) => setBank_name(e.target.value)} 
              />:<div className="text-[9.5px] font-light bg-[#425861] py-[2px] px-3 w-[100%] h-5">{bank_name}</div>}
            </div>
            <div>
              <div className="text-xs text-[#536d77]">Account number</div>
              {(isediting)?<input 
              className="text-[9.5px] font-light bg-[#425861]  px-3 w-[100%] h-5" 
              value={account_no} 
              onChange={(e) => setAccount_no(e.target.value)} 
              />:<div className="text-[9.5px] font-light bg-[#425861] py-[2px] px-3 w-[100%] h-5">{account_no}</div>}
            </div>
            <div>
              <div className="text-xs text-[#536d77]">IFSC code</div>
              {(isediting)?<input
              className="text-[9.5px] font-light bg-[#425861]  px-3 w-[100%] h-5" 
              value={ifsc_code} 
              onChange={(e) => setIfsc_code(e.target.value)} 
              />:<div className="text-[9.5px] font-light bg-[#425861] py-[2px] px-3  w-[100%] h-5">{ifsc_code}</div>}
            </div>
            <div>
              <div className="text-xs text-[#536d77]">Account holder name</div>
              {(isediting)?<input 
              className="text-[9.5px] font-light bg-[#425861]  px-3 w-[100%] h-5" 
              value={user_name_in_bank} 
              onChange={(e) => setUser_name_in_bank(e.target.value)} 
              />:<div className="text-[9.5px] font-light bg-[#425861] py-[2px] px-3 w-[100%] h-5">{user_name_in_bank}</div>}
            </div>
              {(isediting)?<button onClick={handleUpdate} className=" bg-[#517460] hover:bg-[#32483c] mt-4 mb-6 flex items-center justify-center mx-12 px-5 hover:border py-2 text-sm rounded-md">Confirm Edit</button>:<button onClick={()=>setisediting(true)} className=" bg-[#517460] hover:bg-[#32483c] hover:border mt-4 mb-6 flex items-center justify-center mx-12 px-5 py-2 text-sm rounded-md">Edit</button>}
          </div>
        </div>
      </div>
      <div className="bg-[#ECF0F4] p-8 h-screen w-[79%]">
        <Link href={{
        pathname: "/yourplaces",
        query: {
            id: id,
            clerk_id: clerk_id,
            name:name
        }}
    }>
          <div className="h-[6vh] w-[15vh] bg-[#C6CF10] hover:bg-[#BAC20C] hover:border-2 rounded-md flex justify-center items-center float-right mr-8">
            Your Places
          </div>
        </Link>
      </div>
    </div>
  )
}

export default placelist
