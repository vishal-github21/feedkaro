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
  const [user_name_in_bank, setUser_name_in_bank] = useState("username in bank");
  const [feed_count, setFeed_count] = useState(0);
  const [places, setplaces] = useState<Place[]>([]);
  const [side, setside] = useState(false);

  const handleSubmit = async (e: React.FormEvent, placeid: string, id: string) => {
    e.preventDefault();
    const fileInput = (e.target as HTMLFormElement).elements.namedItem("image") as HTMLInputElement;
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
          userId: id,
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
          params: { userId: id },
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
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated background effects */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse top-10 left-10" />
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse bottom-10 right-10 delay-1000" />
      </div>

      <div className="flex flex-row relative z-10">
        {/* Desktop Sidebar */}
        <div className="backdrop-blur-xl bg-black/20 border-r border-white/10 pt-12 h-screen w-[21%] md:block hidden">
          <div className="flex flex-col items-center w-[100%]">
            <div className="mb-4">
              <UserButton afterSignOutUrl="/" />
            </div>
            <div className="text-3xl text-white font-bold mb-3">{name}</div>
            <div className="backdrop-blur-md bg-green-500/20 border border-green-400/30 text-green-300 px-6 py-2 rounded-xl font-semibold">
              Earning: ₹{earning}
            </div>
          </div>

          {/* Account Info Glass Card */}
          <div className="m-4 mt-16">
            <div className="text-sm text-purple-300/70 mb-3 font-medium">ACCOUNT INFO</div>
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 space-y-4">
              <div>
                <div className="text-sm text-purple-300 mb-1">Bank name</div>
                {isediting ? (
                  <input
                    className="w-full px-3 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                    value={bank_name}
                    onChange={(e) => setBank_name(e.target.value)}
                  />
                ) : (
                  <div className="w-full px-3 py-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg text-white/80">
                    {bank_name}
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm text-purple-300 mb-1">Account number</div>
                {isediting ? (
                  <input
                    className="w-full px-3 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                    value={account_no}
                    onChange={(e) => setAccount_no(e.target.value)}
                  />
                ) : (
                  <div className="w-full px-3 py-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg text-white/80">
                    {account_no}
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm text-purple-300 mb-1">IFSC code</div>
                {isediting ? (
                  <input
                    className="w-full px-3 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                    value={ifsc_code}
                    onChange={(e) => setIfsc_code(e.target.value)}
                  />
                ) : (
                  <div className="w-full px-3 py-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg text-white/80">
                    {ifsc_code}
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm text-purple-300 mb-1">Account holder name</div>
                {isediting ? (
                  <input
                    className="w-full px-3 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                    value={user_name_in_bank}
                    onChange={(e) => setUser_name_in_bank(e.target.value)}
                  />
                ) : (
                  <div className="w-full px-3 py-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg text-white/80">
                    {user_name_in_bank}
                  </div>
                )}
              </div>

              {isediting ? (
                <button
                  onClick={handleUpdate}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Confirm Edit
                </button>
              ) : (
                <button
                  onClick={() => setisediting(true)}
                  className="w-full backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* Withdrawal Button */}
          <div className="absolute bottom-8 right-4">
            <button className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:opacity-90 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
              Request Withdrawal
            </button>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {side && (
          <div className="backdrop-blur-xl bg-black/30 border-r border-white/10 pt-12 h-screen w-[100%] md:hidden fixed z-50 transition-transform">
            <div className="flex flex-col items-center w-[100%]">
              <button onClick={() => setside(false)}>
                <HiArrowLongLeft className="absolute right-5 text-white top-5 h-7 w-7 mr-2 md:hidden" />
              </button>

              <div className="mb-4">
                <UserButton afterSignOutUrl="/" />
              </div>
              <div className="text-3xl text-white font-bold mb-3">{name}</div>
              <div className="backdrop-blur-md bg-green-500/20 border border-green-400/30 text-green-300 px-6 py-2 rounded-xl font-semibold">
                Earning: ₹{earning}
              </div>
            </div>

            {/* Mobile Account Info */}
            <div className="m-4 mt-16">
              <div className="text-sm text-purple-300/70 mb-3 font-medium">ACCOUNT INFO</div>
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 space-y-4">
                <div>
                  <div className="text-sm text-purple-300 mb-1">Bank name</div>
                  {isediting ? (
                    <input
                      className="w-full px-3 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                      value={bank_name}
                      onChange={(e) => setBank_name(e.target.value)}
                    />
                  ) : (
                    <div className="w-full px-3 py-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg text-white/80">
                      {bank_name}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-sm text-purple-300 mb-1">Account number</div>
                  {isediting ? (
                    <input
                      className="w-full px-3 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                      value={account_no}
                      onChange={(e) => setAccount_no(e.target.value)}
                    />
                  ) : (
                    <div className="w-full px-3 py-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg text-white/80">
                      {account_no}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-sm text-purple-300 mb-1">IFSC code</div>
                  {isediting ? (
                    <input
                      className="w-full px-3 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                      value={ifsc_code}
                      onChange={(e) => setIfsc_code(e.target.value)}
                    />
                  ) : (
                    <div className="w-full px-3 py-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg text-white/80">
                      {ifsc_code}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-sm text-purple-300 mb-1">Account holder name</div>
                  {isediting ? (
                    <input
                      className="w-full px-3 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                      value={user_name_in_bank}
                      onChange={(e) => setUser_name_in_bank(e.target.value)}
                    />
                  ) : (
                    <div className="w-full px-3 py-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg text-white/80">
                      {user_name_in_bank}
                    </div>
                  )}
                </div>

                {isediting ? (
                  <button
                    onClick={handleUpdate}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Confirm Edit
                  </button>
                ) : (
                  <button
                    onClick={() => setisediting(true)}
                    className="w-full backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div className="absolute bottom-8 right-4">
              <button className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:opacity-90 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                Request Withdrawal
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area - Mobile */}
        {!side && (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 flex flex-col p-6 h-screen md:w-[79%] md:hidden w-[100%]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <button onClick={() => setside(true)}>
                  <HiBars3 className="h-6 w-6 mr-3 text-white md:hidden" />
                </button>
                <span className="text-2xl font-bold text-white">
                  feed<span className="text-purple-300">karo</span>
                </span>
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
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-sm">
                  Your Places
                </div>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search places..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
              />
            </div>

            {/* Places List */}
            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
              {places && places.length > 0 ? (
                places
                  .filter((place) => !feedplaces.includes(place.id))
                  .filter((place) => place.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((place, index) => (
                    <div
                      key={place.id}
                      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 transition-all duration-300 hover:bg-white/20 hover:scale-[1.02]"
                    >
                      <h3 className="text-lg font-semibold text-white mb-2 truncate">{place.name}</h3>

                      <div className="flex items-center text-blue-300 text-sm mb-4 hover:text-blue-200 transition-colors">
                        <HiBars3 className="mr-2 h-4 w-4" />
                        <a href={place.link} target="_blank" rel="noopener noreferrer">
                          View on Map
                        </a>
                      </div>

                      <form onSubmit={(e) => handleSubmit(e, place.id, id)} className="flex items-center gap-3">
                        <label htmlFor={`image-${index}`} className="text-sm text-white/80 flex-shrink-0">
                          Add screenshot:
                        </label>
                        <input
                          type="file"
                          id={`image-${index}`}
                          name="image"
                          accept="image/*"
                          className="flex-1 text-xs text-white/70 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:backdrop-blur-md file:bg-white/10 file:text-white file:cursor-pointer hover:file:bg-white/20 transition-colors"
                        />
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-sm"
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                  ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-400 mb-4"></div>
                  <p className="text-purple-300 text-lg font-semibold">Fetching new places...</p>
                  <p className="text-white/60 text-sm">Hang tight, something cool is on the way!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content Area - Desktop */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 flex flex-col p-8 h-screen w-[79%] md:block hidden">
          <div className="flex items-center justify-between mb-8">
            <span className="text-3xl font-bold text-white">
              feed<span className="text-purple-300">karo</span>
            </span>

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
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                Your Places
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search places..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md mx-auto block px-6 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>

          {/* Places List */}
          <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar">
            {places && places.length > 0 ? (
              places
                .filter((place) => !feedplaces.includes(place.id))
                .filter((place) => place.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((place, index) => (
                  <div
                    key={place.id}
                    className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] shadow-xl"
                  >
                    <h3 className="text-xl font-semibold text-white mb-3 truncate">{place.name}</h3>

                    <div className="flex items-center text-blue-300 text-sm mb-4 hover:text-blue-200 transition-colors">
                      <HiBars3 className="mr-2 h-4 w-4" />
                      <a href={place.link} target="_blank" rel="noopener noreferrer">
                        View on Map
                      </a>
                    </div>

                    <form onSubmit={(e) => handleSubmit(e, place.id, id)} className="flex items-center gap-4">
                      <label htmlFor={`image-${index}`} className="text-sm text-white/80 flex-shrink-0">
                        Add screenshot:
                      </label>
                      <input
                        type="file"
                        id={`image-${index}`}
                        name="image"
                        accept="image/*"
                        className="flex-1 text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:backdrop-blur-md file:bg-white/10 file:text-white file:cursor-pointer hover:file:bg-white/20 transition-colors"
                      />
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400 mb-6"></div>
                <p className="text-purple-300 text-xl font-semibold mb-2">Fetching new places...</p>
                <p className="text-white/60">Hang tight, something cool is on the way!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Placelist;
