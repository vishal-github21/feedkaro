"use client";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
interface Place {
  name: string;
  link: string;
  img: string;
  id:string;
}
const Placelist = () => {
  const [isediting, setisediting] = useState(false);
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
        const response = await axios.get("/api/fetchplaces");
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
      <div className=" container bg-gradient-to-b  from-[#000000] to-[#283618] pt-12 h-screen w-[21%]">
        <div className="flex flex-col items-center w-[100%]">
          <div>
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="text-4xl font-mono">{name}</div>
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
                  className="text-[9.5px] font-light bg-[#425861] rounded-md px-3 w-[100%] h-5"
                  value={bank_name}
                  onChange={(e) => setBank_name(e.target.value)}
                />
              ) : (
                <div className="text-[9.5px] font-light rounded-sm bg-[#425861] py-[2px] px-3 w-[100%] h-5">
                  {bank_name}
                </div>
              )}
            </div>
            <div>
              <div className="text-xs text-[#536d77]">Account number</div>
              {isediting ? (
                <input
                  className="text-[9.5px] font-light rounded-sm bg-[#425861]  px-3 w-[100%] h-5"
                  value={account_no}
                  onChange={(e) => setAccount_no(e.target.value)}
                />
              ) : (
                <div className="text-[9.5px] font-light rounded-sm bg-[#425861] py-[2px] px-3 w-[100%] h-5">
                  {account_no}
                </div>
              )}
            </div>
            <div>
              <div className="text-xs text-[#536d77]">IFSC code</div>
              {isediting ? (
                <input
                  className="text-[9.5px] font-light rounded-sm bg-[#425861]  px-3 w-[100%] h-5"
                  value={ifsc_code}
                  onChange={(e) => setIfsc_code(e.target.value)}
                />
              ) : (
                <div className="text-[9.5px] font-light rounded-sm bg-[#425861] py-[2px] px-3  w-[100%] h-5">
                  {ifsc_code}
                </div>
              )}
            </div>
            <div>
              <div className="text-xs text-[#536d77]">Account holder name</div>
              {isediting ? (
                <input
                  className="text-[9.5px] font-light rounded-sm bg-[#425861]  px-3 w-[100%] h-5"
                  value={user_name_in_bank}
                  onChange={(e) => setUser_name_in_bank(e.target.value)}
                />
              ) : (
                <div className="text-[9.5px] font-light rounded-sm bg-[#425861] py-[2px] px-3 w-[100%] h-5">
                  {user_name_in_bank}
                </div>
              )}
            </div>
            {isediting ? (
              <button
                onClick={handleUpdate}
                className=" bg-[#517460] hover:bg-[#32483c] mt-4 mb-6 flex items-center justify-center mx-12 px-5 hover:border py-2 text-sm rounded-md"
              >
                Confirm Edit
              </button>
            ) : (
              <button
                onClick={() => setisediting(true)}
                className=" bg-[#517460] hover:bg-[#32483c] hover:border mt-4 mb-6 flex items-center justify-center mx-12 px-5 py-2 text-sm rounded-md"
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
      <div className="bg-gradient-to-br from-[#c9d5df] to-[#e7c8d4] flex flex-col p-8 h-screen w-[79%]">
        <div>
        <span className=" pl-6 z-20 text-2xl font-bold text-[#4368ffcb] font-sans">feedkaro</span>

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
            <div className="h-[6vh] w-[15vh] bg-[#C6CF10] hover:bg-[#BAC20C] hover:border-2 rounded-md flex justify-center items-center float-right mr-8">
              Your Places
            </div>
          </Link>
        </div>
        <div className="w-full mt-8 h-[85%] overflow-y-scroll custom-scrollbar scroll">
          {places && places.length > 0 ? (
            places.filter(place => !feedplaces.includes(place.id)).map((place, index) => (
              <div
                key={index}
                className=" bg-gradient-to-bl from-[#ececec] to-[#ffffff] p-4 w-[100%] rounded-lg mt-4 shadow-md"
              >
                <h3 className="text-xl text-black font-bold">{place.name}</h3>
                <a href={place.link} className="text-sm font-mono border border-gray-400 border-dotted w-full py-1 px-4 rounded-md mt-1 flex items-center bg-gray-100 text-blue-600">
                  {place.link}
                </a>
                <form
                  onSubmit={(e)=>handleSubmit(e,place.id,id)}
                  className=" items-center mt-2"
                ><label htmlFor="image" className="text-sm text-gray-400 mr-2">Add screenshot</label>
                  <input
                    type="file"
                    title="Upload your file"
                    id="image"
                    accept="image/*"
                    
                    className=" text-purple-500 text-sm font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-3 text-xs py-1 rounded-lg float-right"
                  >
                    Submit
                  </button>
                </form>
              </div>
            ))
          ) : (
            <div>No places found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Placelist;
