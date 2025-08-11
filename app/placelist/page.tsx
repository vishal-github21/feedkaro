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
  id: string;
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
  const [side, setside] = useState(false);

  const handleSubmit = async (e: React.FormEvent, placeid: string, id: string) => {
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
          img: base64String,
          placeId: placeid,
          userId: id
        });
        console.log(response.data);
        setEarning(earning + 4);
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
    <div className="flex flex-row min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Desktop Sidebar */}
      <div className="container backdrop-blur-xl bg-black/20 border-r border-white/10 pt-12 h-screen w-[21%] md:block hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex flex-col items-center w-[100%]">
            <div className="mb-4 p-1 rounded-full bg-white/10 backdrop-blur-sm">
              <UserButton afterSignOutUrl="/" />
            </div>
            <div className="text-4xl text-white font-mono mb-4 text-shadow-lg">{name}</div>
            <div className="text-lg text-emerald-300 px-7 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-400/30 shadow-lg">
              Earning : {earning}
            </div>
          </div>

          <div className="h-[45vh] m-1 mt-[15%] rounded-xl">
            <div className="text-xs text-white/50 ml-4 mb-3 font-medium tracking-wide">ACCOUNT INFO</div>
            <div className="flex flex-col gap-3 bg-white/10 backdrop-blur-md mx-3 p-4 pt-6 rounded-xl border border-white/20 shadow-2xl">
              {/* Bank Name */}
              <div className="space-y-2">
                <div className="text-xs text-white/70 font-medium">Bank name</div>
                {isediting ? (
                  <input
                    className="text-sm text-white bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 w-full border border-white/20 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    value={bank_name}
                    onChange={(e) => setBank_name(e.target.value)}
                  />
                ) : (
                  <div className="text-sm text-white rounded-lg bg-white/5 backdrop-blur-sm py-2 px-4 w-full border border-white/10">
                    {bank_name}
                  </div>
                )}
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <div className="text-xs text-white/70 font-medium">Account number</div>
                {isediting ? (
                  <input
                    className="text-sm text-white bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 w-full border border-white/20 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    value={account_no}
                    onChange={(e) => setAccount_no(e.target.value)}
                  />
                ) : (
                  <div className="text-sm text-white rounded-lg bg-white/5 backdrop-blur-sm py-2 px-4 w-full border border-white/10">
                    {account_no}
                  </div>
                )}
              </div>

              {/* IFSC Code */}
              <div className="space-y-2">
                <div className="text-xs text-white/70 font-medium">IFSC code</div>
                {isediting ? (
                  <input
                    className="text-sm text-white bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 w-full border border-white/20 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    value={ifsc_code}
                    onChange={(e) => setIfsc_code(e.target.value)}
                  />
                ) : (
                  <div className="text-sm text-white rounded-lg bg-white/5 backdrop-blur-sm py-2 px-4 w-full border border-white/10">
                    {ifsc_code}
                  </div>
                )}
              </div>

              {/* Account Holder Name */}
              <div className="space-y-2">
                <div className="text-xs text-white/70 font-medium">Account holder name</div>
                {isediting ? (
                  <input
                    className="text-sm text-white bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 w-full border border-white/20 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    value={user_name_in_bank}
                    onChange={(e) => setUser_name_in_bank(e.target.value)}
                  />
                ) : (
                  <div className="text-sm text-white rounded-lg bg-white/5 backdrop-blur-sm py-2 px-4 w-full border border-white/10">
                    {user_name_in_bank}
                  </div>
                )}
              </div>

              {isediting ? (
                <button
                  onClick={handleUpdate}
                  className="bg-gradient-to-r from-emerald-500/80 to-teal-500/80 hover:from-emerald-500 hover:to-teal-500 text-white mt-6 mb-4 flex items-center justify-center mx-8 px-6 py-3 text-sm rounded-xl backdrop-blur-sm border border-emerald-400/30 shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Confirm Edit
                </button>
              ) : (
                <button
                  onClick={() => setisediting(true)}
                  className="bg-white/10 hover:bg-white/20 text-white mt-6 mb-4 flex items-center justify-center mx-8 px-6 py-3 text-sm rounded-xl backdrop-blur-sm border border-white/20 shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          <div className="float-right mr-4 mt-[20%]">
            <button className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-500 hover:via-purple-500 hover:to-pink-500 text-white text-xs py-2 px-4 rounded-xl border border-purple-400/30 shadow-lg backdrop-blur-sm transform hover:scale-105 transition-all duration-200">
              request withdrawal
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {side && (
        <div className="container backdrop-blur-xl bg-black/20 border-r border-white/10 pt-12 h-screen w-[100%] md:hidden relative transition-transform duration-300">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex flex-col items-center w-[100%]">
              <button onClick={() => setside(false)}>
                <HiArrowLongLeft className="absolute right-5 text-white top-5 h-7 w-7 mr-2 md:hidden hover:text-purple-300 transition-colors" />
              </button>

              <div className="mb-4 p-1 rounded-full bg-white/10 backdrop-blur-sm">
                <UserButton afterSignOutUrl="/" />
              </div>
              <div className="text-4xl text-white font-mono mb-4">{name}</div>
              <div className="text-lg text-emerald-300 px-7 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-400/30">
                Earning : {earning}
              </div>
            </div>

            {/* Same account info section as desktop but for mobile */}
            <div className="h-[45vh] m-1 mt-[15%] rounded-xl">
              <div className="text-xs text-white/50 ml-4 mb-3 font-medium tracking-wide">ACCOUNT INFO</div>
              <div className="flex flex-col gap-3 bg-white/10 backdrop-blur-md mx-3 p-4 pt-6 rounded-xl border border-white/20 shadow-2xl">
                <div className="space-y-2">
                  <div className="text-xs text-white/70 font-medium">Bank name</div>
                  {isediting ? (
                    <input
                      className="text-sm text-white bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 w-full border border-white/20 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all"
                      value={bank_name}
                      onChange={(e) => setBank_name(e.target.value)}
                    />
                  ) : (
                    <div className="text-sm text-white rounded-lg bg-white/5 backdrop-blur-sm py-2 px-4 w-full border border-white/10">
                      {bank_name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-white/70 font-medium">Account number</div>
                  {isediting ? (
                    <input
                      className="text-sm text-white bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 w-full border border-white/20 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all"
                      value={account_no}
                      onChange={(e) => setAccount_no(e.target.value)}
                    />
                  ) : (
                    <div className="text-sm text-white rounded-lg bg-white/5 backdrop-blur-sm py-2 px-4 w-full border border-white/10">
                      {account_no}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-white/70 font-medium">IFSC code</div>
                  {isediting ? (
                    <input
                      className="text-sm text-white bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 w-full border border-white/20 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all"
                      value={ifsc_code}
                      onChange={(e) => setIfsc_code(e.target.value)}
                    />
                  ) : (
                    <div className="text-sm text-white rounded-lg bg-white/5 backdrop-blur-sm py-2 px-4 w-full border border-white/10">
                      {ifsc_code}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-white/70 font-medium">Account holder name</div>
                  {isediting ? (
                    <input
                      className="text-sm text-white bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 w-full border border-white/20 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all"
                      value={user_name_in_bank}
                      onChange={(e) => setUser_name_in_bank(e.target.value)}
                    />
                  ) : (
                    <div className="text-sm text-white rounded-lg bg-white/5 backdrop-blur-sm py-2 px-4 w-full border border-white/10">
                      {user_name_in_bank}
                    </div>
                  )}
                </div>

                {isediting ? (
                  <button
                    onClick={handleUpdate}
                    className="bg-gradient-to-r from-emerald-500/80 to-teal-500/80 hover:from-emerald-500 hover:to-teal-500 text-white mt-6 mb-4 flex items-center justify-center mx-8 px-6 py-3 text-sm rounded-xl backdrop-blur-sm border border-emerald-400/30 shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Confirm Edit
                  </button>
                ) : (
                  <button
                    onClick={() => setisediting(true)}
                    className="bg-white/10 hover:bg-white/20 text-white mt-6 mb-4 flex items-center justify-center mx-8 px-6 py-3 text-sm rounded-xl backdrop-blur-sm border border-white/20 shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div className="float-right mr-4 mt-[15%]">
              <button className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-500 hover:via-purple-500 hover:to-pink-500 text-white text-xs py-2 px-4 rounded-xl border border-purple-400/30 shadow-lg backdrop-blur-sm transform hover:scale-105 transition-all duration-200">
                request withdrawal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area - Mobile */}
      {!side && (
        <div className="backdrop-blur-xl bg-white/10 border border-white/10 flex flex-col p-8 h-screen md:w-[79%] md:hidden w-[100%] relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <button onClick={() => setside(true)}>
                  <HiBars3 className="h-6 w-6 mr-3 text-white hover:text-purple-300 transition-colors md:hidden" />
                </button>
                <span className="text-2xl font-bold text-white font-sans">feedkaro</span>
              </div>

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
                <div className="h-[5vh] px-4 bg-gradient-to-r from-yellow-500/80 to-orange-500/80 hover:from-yellow-500 hover:to-orange-500 text-white text-sm rounded-xl flex justify-center items-center backdrop-blur-sm border border-yellow-400/30 shadow-lg transform hover:scale-105 transition-all duration-200">
                  Your Places
                </div>
              </Link>
            </div>

            <div className="mb-4 flex justify-center">
              <input
                type="text"
                placeholder="Search places..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full max-w-md px-4 py-3 text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 placeholder-white/50 shadow-lg transition-all"
              />
            </div>

            <div className="w-full h-[75%] overflow-y-auto space-y-4 scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-white/20">
              {places && places.length > 0 ? (
                places
                  .filter(place => !feedplaces.includes(place.id))
                  .filter(place => place.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((place, index) => (
                    <div
                      key={place.id}
                      className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-xl p-4 transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:shadow-2xl transform hover:scale-[1.02]"
                    >
                      <h3 className="text-lg font-semibold text-white truncate mb-2">
                        {place.name}
                      </h3>

                      <div className="flex items-center text-cyan-300 text-sm mb-3 hover:text-cyan-200 transition-colors">
                        <HiBars3 className="mr-2 h-4 w-4" />
                        <a
                          href={place.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          View on Map
                        </a>
                      </div>

                      <form
                        onSubmit={(e) => handleSubmit(e, place.id, id)}
                        className="flex items-center gap-3"
                      >
                        <div className="flex-1">
                          <label htmlFor={`image-${index}`} className="text-sm text-white/80 block mb-2">
                            Add screenshot
                          </label>
                          <input
                            type="file"
                            id={`image-${index}`}
                            name="image"
                            accept="image/*"
                            className="text-sm text-white file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-white/10 file:text-white file:backdrop-blur-sm file:border file:border-white/20 hover:file:bg-white/20 file:transition-all w-full"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-blue-500/80 to-indigo-500/80 hover:from-blue-500 hover:to-indigo-500 text-white text-sm px-4 py-2 rounded-lg backdrop-blur-sm border border-blue-400/30 shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                  ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-400 mb-4"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-xl"></div>
                  </div>
                  <p className="text-white text-xl font-semibold font-mono mb-2">Fetching new places...</p>
                <p className="text-white/60 text-sm">Hang tight, something cool is on the way!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .text-shadow-lg {
          text-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
        }

        /* Custom scrollbar styles */
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-track-white\/10::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
        }
        
        .scrollbar-thumb-white\/20::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
        }
        
        .scrollbar-thumb-white\/20::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }

        /* Enhanced glass morphism effects */
        .backdrop-blur-xl {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        
        .backdrop-blur-md {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        
        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        /* Smooth transitions for all interactive elements */
        * {
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 200ms;
        }

        /* Enhanced focus states */
        input:focus, button:focus {
          outline: 2px solid rgba(147, 51, 234, 0.5);
          outline-offset: 2px;
        }

        /* Improved file input styling */
        input[type="file"] {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          padding: 0.5rem;
        }

        /* Enhanced button hover effects */
        button:hover {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        /* Glassmorphism card hover effects */
        .hover\\:scale-\\[1\\.02\\]:hover {
          transform: scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Placelist;
