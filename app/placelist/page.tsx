"use client";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { HiBars3 } from "react-icons/hi2";
import { HiArrowLongLeft } from "react-icons/hi2";
interface Place {
  name: string;
  link: string;
  img: string;
  id:string;
}
const Placelist = () => {
  const [isediting, setisediting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [id, setId] = useState("id");
  const [clerk_id, setClerk_id] = useState("clerk_id");
  const [name, setName] = useState("-");
  const [earning, setEarning] = useState(0);
  const [account_no, setAccount_no] = useState("account_no");
  const [ifsc_code, setIfsc_code] = useState("ifsc_code");
  const [bank_name, setBank_name] = useState("bank_name");
  const [feedplaces, setfeedplaces] = useState<string[]>([]);
  const [user_name_in_bank, setUser_name_in_bank] =
    useState("username in bank");
  const [feed_count, setFeed_count] = useState(0);
  const [places, setplaces] = useState<Place[]>([]);
  const [side,setside]=useState(false)
  const handleSubmit = async (e: React.FormEvent,placeid:string,id:string) => {
    e.preventDefault();
    const fileInput = (e.target as HTMLFormElement).elements.namedItem(
      "image"
    ) as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      alert("Please select an image.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      

      try {
        const response = await axios.post("/api/addfeed", {
          img: base64String,placeId:placeid,userId:id
        });
        console.log(response.data);
        setEarning(earning+4)
        alert("Feed uploaded successfully!");
        window.location.reload();
      } catch (err) {
        console.error("Error uploading image:", err);
        alert("Failed to upload image.");
      }
    };

    reader.readAsDataURL(file);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/us");
        const data = response.data;

        setId(data.id);
        setClerk_id(data.clerk_id);
        setName(data.name);
        setEarning(data.earning);
        setAccount_no(data.account_no);
        setIfsc_code(data.ifsc_code);
        setBank_name(data.bank_name);
        setUser_name_in_bank(data.user_name_in_bank);
        setFeed_count(data.feed_count);
        setfeedplaces(data.feedplaces);
        
        console.log(data);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    
    
    fetchData();
  }, []);
  useEffect(() => {
    const fetchplaces = async () => {
      try {
        const response = await axios.get("/api/fetchplaces", {
          params: { userId: id }
        });
        const data = response.data;
        console.log(data);
        setplaces(data);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchplaces();
  }, []);
  const handleUpdate = async () => {
    try {
      const response = await axios.post("/api/updateuser", {
        clerk_id: clerk_id,
        name: name,
        account_no: account_no,
        earning: earning,
        ifsc_code: ifsc_code,
        bank_name: bank_name,
        user_name_in_bank: user_name_in_bank,
        feed_count: feed_count,
      });
      console.log(response.data);
      setisediting(false);
    } catch (err) {
      console.error("Error:", err);
    }
  };
  return (
    <div className="flex flex-row">
      <div className=" container bg-gradient-to-b  from-[#000000] to-[#283618] pt-12 h-screen w-[21%] md:block hidden">
        <div className="flex flex-col items-center w-[100%]">
          <div>
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="text-4xl text-white font-mono">{name}</div>
          <div className="text-lg text-green-500 px-7 rounded-sm bg-[#606c38]">
            Earning : {earning}
          </div>
        </div>
        <div className="h-[45vh]  m-1 mt-[23%] rounded-md ">
          <div className="text-xs text-[#425861a7] ml-4 mb-1">ACCOUNT INFO</div>
          <div className="flex flex-col gap-2 bg-[#1b2510] mx-3 p-1 px-2 pt-4 rounded-md">
            <div>
              <div className="text-xs text-[#536d77]">Bank name</div>
              {isediting ? (
                <input
                  className="text-[9.5px] font-light text-white bg-[#425861] rounded-sm px-3 w-[100%] h-5"
                  value={bank_name}
                  onChange={(e) => setBank_name(e.target.value)}
                />
              ) : (
                <div className="text-[9.5px] font-light text-white rounded-sm bg-[#425861] py-[2px] px-3 w-[100%] h-5">
                  {bank_name}
                </div>
              )}
            </div>
            <div>
              <div className="text-xs text-[#536d77]">Account number</div>
              {isediting ? (
                <input
                  className="text-[9.5px] font-light text-white rounded-sm bg-[#425861]  px-3 w-[100%] h-5"
                  value={account_no}
                  onChange={(e) => setAccount_no(e.target.value)}
                />
              ) : (
                <div className="text-[9.5px] font-light text-white rounded-sm bg-[#425861] py-[2px] px-3 w-[100%] h-5">
                  {account_no}
                </div>
              )}
            </div>
            <div>
              <div className="text-xs text-[#536d77]">IFSC code</div>
              {isediting ? (
                <input
                  className="text-[9.5px] font-light text-white rounded-sm bg-[#425861]  px-3 w-[100%] h-5"
                  value={ifsc_code}
                  onChange={(e) => setIfsc_code(e.target.value)}
                />
              ) : (
                <div className="text-[9.5px] font-light text-white rounded-sm bg-[#425861] py-[2px] px-3  w-[100%] h-5">
                  {ifsc_code}
                </div>
              )}
            </div>
            <div>
              <div className="text-xs text-[#536d77]">Account holder name</div>
              {isediting ? (
                <input
                  className="text-[9.5px] font-light text-white rounded-sm bg-[#425861]  px-3 w-[100%] h-5"
                  value={user_name_in_bank}
                  onChange={(e) => setUser_name_in_bank(e.target.value)}
                />
              ) : (
                <div className="text-[9.5px] font-light text-white rounded-sm bg-[#425861] py-[2px] px-3 w-[100%] h-5">
                  {user_name_in_bank}
                </div>
              )}
            </div>
            {isediting ? (
              <button
                onClick={handleUpdate}
                className=" bg-[#517460] hover:bg-[#32483c] text-white mt-4 mb-6 flex items-center justify-center mx-12 px-5 hover:border py-2 text-sm rounded-md"
              >
                Confirm Edit
              </button>
            ) : (
              <button
                onClick={() => setisediting(true)}
                className=" bg-[#517460] hover:bg-[#32483c] text-white hover:border mt-4 mb-6 flex items-center justify-center mx-12 px-5 py-2 text-sm rounded-md"
              >
                Edit
              </button>
            )}
          </div>
        </div>
        <div className=" float-right mr-4 mt-[29%]"><button className="bg-gradient-to-r from-[#4800ff] via-[#b300ff] to-[#ff006a] text-xs hover:opacity-90 text-white py-2 px-4 rounded-xl border-2 border-pink-600 shadow-lg hover:transition-colors transition-colors">
            request withdrawal
        </button></div>
      </div>
      {side &&
      <div className=" container bg-gradient-to-b transition-transform  from-[#000000] to-[#283618] pt-12 h-screen w-[100%] md:hidden">

      <div className="flex flex-col items-center w-[100%]">
      <button onClick={()=>setside(false)}><HiArrowLongLeft  className=" absolute right-5 text-white top-5 h-7 w-7 mr-2 md:hidden"/></button>

        <div>
          <UserButton afterSignOutUrl="/" />
        </div>
        <div className="text-4xl text-white font-mono">{name}</div>
        <div className="text-lg text-green-500 px-7 rounded-sm bg-[#606c38]">
          Earning : {earning}
        </div>

      </div>
      <div className="h-[45vh]  m-1 mt-[23%] rounded-md ">
        <div className="text-xs text-[#425861a7] ml-4 mb-1">ACCOUNT INFO</div>
        <div className="flex flex-col gap-2 bg-[#1b2510] mx-3 p-1 px-2 pt-4 rounded-md">
          <div>
            <div className="text-xs text-[#536d77]">Bank name</div>
            {isediting ? (
              <input
                className="text-[9.5px] font-light text-white bg-[#425861] rounded-sm px-3 w-[100%] h-5"
                value={bank_name}
                onChange={(e) => setBank_name(e.target.value)}
              />
            ) : (
              <div className="text-[9.5px] font-light text-white rounded-sm bg-[#425861] py-[2px] px-3 w-[100%] h-5">
                {bank_name}
              </div>
            )}
          </div>
          <div>
            <div className="text-xs text-[#536d77]">Account number</div>
            {isediting ? (
              <input
                className="text-[9.5px] font-light text-white rounded-sm bg-[#425861]  px-3 w-[100%] h-5"
                value={account_no}
                onChange={(e) => setAccount_no(e.target.value)}
              />
            ) : (
              <div className="text-[9.5px] font-light text-white rounded-sm bg-[#425861] py-[2px] px-3 w-[100%] h-5">
                {account_no}
              </div>
            )}
          </div>
          <div>
            <div className="text-xs text-[#536d77]">IFSC code</div>
            {isediting ? (
              <input
                className="text-[9.5px] font-light text-white rounded-sm bg-[#425861]  px-3 w-[100%] h-5"
                value={ifsc_code}
                onChange={(e) => setIfsc_code(e.target.value)}
              />
            ) : (
              <div className="text-[9.5px] font-light text-white rounded-sm bg-[#425861] py-[2px] px-3  w-[100%] h-5">
                {ifsc_code}
              </div>
            )}
          </div>
          <div>
            <div className="text-xs text-[#536d77]">Account holder name</div>
            {isediting ? (
              <input
                className="text-[9.5px] font-light text-white rounded-sm bg-[#425861]  px-3 w-[100%] h-5"
                value={user_name_in_bank}
                onChange={(e) => setUser_name_in_bank(e.target.value)}
              />
            ) : (
              <div className="text-[9.5px] font-light text-white rounded-sm bg-[#425861] py-[2px] px-3 w-[100%] h-5">
                {user_name_in_bank}
              </div>
            )}
          </div>
          {isediting ? (
            <button
              onClick={handleUpdate}
              className=" bg-[#517460] hover:bg-[#32483c] text-white mt-4 mb-6 flex items-center justify-center mx-12 px-5 hover:border py-2 text-sm rounded-md"
            >
              Confirm Edit
            </button>
          ) : (
            <button
              onClick={() => setisediting(true)}
              className=" bg-[#517460] hover:bg-[#32483c] text-white hover:border mt-4 mb-6 flex items-center justify-center mx-12 px-5 py-2 text-sm rounded-md"
            >
              Edit
            </button>
          )}
        </div>
      </div>
      <div className=" float-right mr-4 mt-[29%]"><button className="bg-gradient-to-r from-[#4800ff] via-[#b300ff] to-[#ff006a] text-xs hover:opacity-90 text-white py-2 px-4 rounded-xl border-2 border-pink-600 shadow-lg hover:transition-colors transition-colors">
          request withdrawal
      </button></div>
    </div>
      }
      {!side && <div className="bg-gradient-to-br from-[#c9d5df] to-[#e7c8d4] flex flex-col p-8 h-screen md:w-[79%] md:hidden w-[100%]">
        <div>
        <button onClick={()=>setside(true)}><HiBars3 className="h-6 w-6 mr-2 text-black md:hidden"/></button>
        <span className=" md:pl-6 z-20 text-2xl font-bold text-[#4368ffcb] font-sans">feedkaro</span>

          <Link
            href={{
              pathname: "/yourplaces",
              query: {
                id: id,
                clerk_id: clerk_id,
                name: name,
              },
            }}
          >
            <div className="md:h-[6vh] h-[5vh] w-[15vh] bg-[#C6CF10] hover:bg-[#BAC20C] text-white text-sm hover:border-2 rounded-md flex justify-center items-center float-right md:mr-8 ">
              Your Places
            </div>
          </Link>
        </div>
        <div className="mb-4 mt-2 flex justify-center">
  <input
    type="text"
    placeholder="Search places..."
    value={searchTerm}
    onChange={e => setSearchTerm(e.target.value)}
    className="
      w-full max-w-md
      px-4 py-2
      border border-gray-300 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-purple-500
      placeholder-gray-400
    "
  />
</div>

        <div className="w-full md:mt-8 mt-2 h-[85%] overflow-y-scroll md:custom-scrollbar scroll">
          {places && places.length > 0 ? (
           
            places.filter(place => !feedplaces.includes(place.id)).filter(place =>
        place.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).map((place, index) => (
              <div
  key={place.id}
  className="bg-white bg-opacity-90 shadow-md rounded-lg p-3 mt-4 w-full transition-transform hover:shadow-lg"
>
  {/* Title */}
  <h3 className="text-base font-medium text-gray-800 truncate">
    {place.name}
  </h3>

  {/* Google Maps Link */}
  <div className="flex items-center text-blue-600 text-sm mt-1 hover:underline">
    <HiBars3 /* swap this for your map pin icon import */ className="mr-1 h-4 w-4" />
    <a
      href={place.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      View on Map
    </a>
  </div>

  {/* Upload Form */}
  <form
    onSubmit={(e) => handleSubmit(e, place.id, id)}
    className="mt-2 flex items-center"
  >
    <label htmlFor={`image-${index}`} className="text-xs text-gray-600 mr-2">
      Add screenshot
    </label>
    <input
      type="file"
      id={`image-${index}`}
      name="image"
      accept="image/*"
      className="text-xs hidden text-gray-700"
    />
    <button
      type="submit"
      className="ml-auto bg-blue-500 hover:opacity-90 text-white text-[10px] px-2 py-1 rounded"
    >
      Submit
    </button>
  </form>
</div>
            ))
          ) : (
           <div className="flex flex-col items-center justify-center h-full">
  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#8A2BE2] mb-4"></div>
  <p className="text-[#8A2BE2] text-lg font-semibold font-mono">Fetching new places...</p>
  <p className="text-gray-500 text-sm">Hang tight, something cool is on the way!</p>
</div>
          )}
        </div>
      </div>}
      <div className="bg-gradient-to-br from-[#c9d5df] to-[#e7c8d4] flex flex-col p-8 h-screen w-[79%] md:block hidden">
        <div>
        <button onClick={()=>setside(true)}><HiBars3 className="h-6 w-6 mr-2 text-black md:hidden"/></button>
        <span className=" md:pl-6 z-20 text-2xl font-bold text-[#4368ffcb] font-sans">feedkaro</span>

          <Link
            href={{
              pathname: "/yourplaces",
              query: {
                id: id,
                clerk_id: clerk_id,
                name: name,
              },
            }}
          >
            <div className="md:h-[6vh] h-[5vh] w-[15vh] bg-[#C6CF10] text-white hover:bg-[#BAC20C] hover:border-2 rounded-md flex justify-center text-sm items-center float-right md:mr-8 ">
              Your Places
            </div>
          </Link>
        </div>
        <div className="mb-4 mt-2 flex justify-center">
  <input
    type="text"
    placeholder="Search places..."
    value={searchTerm}
    onChange={e => setSearchTerm(e.target.value)}
    className="
      w-full max-w-md
      px-4 py-2
      border border-gray-300 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-purple-500
      placeholder-gray-400
    "
  />
</div>
        <div className="w-full md:mt-8 mt-2 h-[85%] overflow-y-scroll md:custom-scrollbar scroll">
          {places && places.length > 0 ? (
            places.filter(place => !feedplaces.includes(place.id)).filter(place =>
        place.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).map((place, index) => (
              <div
  key={place.id}
  className="bg-white bg-opacity-90 shadow-md rounded-lg p-3 mt-4 w-full transition-transform hover:shadow-lg"
>
  {/* Title */}
  <h3 className="text-base font-medium text-gray-800 truncate">
    {place.name}
  </h3>

  {/* Google Maps Link */}
  <div className="flex items-center text-blue-600 text-sm mt-1 hover:underline">
    <HiBars3 /* swap this for your map pin icon import */ className="mr-1 h-4 w-4" />
    <a
      href={place.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      View on Map
    </a>
  </div>

  {/* Upload Form */}
  <form
    onSubmit={(e) => handleSubmit(e, place.id, id)}
    className="mt-2 flex items-center"
  >
    <label htmlFor={`image-${index}`} className="text-xs text-gray-600 mr-2">
      Add screenshot
    </label>
    <input
      type="file"
      id={`image-${index}`}
      name="image"
      accept="image/*"
      className="text-xs text-gray-700"
    />
    <button
      type="submit"
      className="ml-auto bg-blue-500 hover:opacity-90 text-white text-[10px] px-2 py-1 rounded"
    >
      Submit
    </button>
  </form>
</div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#8A2BE2] mb-4"></div>
  <p className="text-[#8A2BE2] text-lg font-semibold font-mono">Fetching new places...</p>
  <p className="text-gray-500 text-sm">Hang tight, something cool is on the way!</p>
</div>
          )}
        </div>
      </div>
   
    </div>
  );
};

export default Placelist;
