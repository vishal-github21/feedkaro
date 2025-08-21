"use client";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { HiBars3, HiArrowLongLeft, HiMapPin, HiMagnifyingGlass, HiPhoto, HiCreditCard, HiPencilSquare, HiCheckCircle } from "react-icons/hi2";

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
  const [uploading, setUploading] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // useEffect(() => {
  //   const handleMouseMove = (e: MouseEvent) => {
  //     setMousePosition({ x: e.clientX, y: e.clientY });
  //   };

  //   window.addEventListener('mousemove', handleMouseMove);
  //   return () => window.removeEventListener('mousemove', handleMouseMove);
  // }, []);

  const handleSubmit = async (e: React.FormEvent, placeid: string, id: string) => {
    e.preventDefault();
    setUploading(placeid);
    
    const fileInput = (e.target as HTMLFormElement).elements.namedItem("image") as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      alert("Please select an image.");
      setUploading(null);
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
      } finally {
        setUploading(null);
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
        setplaces(data);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchplaces();
  }, [id]);

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

  const filteredPlaces = places
    .filter(place => !feedplaces.includes(place.id))
    .filter(place => place.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const Sidebar = ({ isMobile = false }) => (
  <div
    className={`${isMobile ? 'fixed inset-0 z-50' : 'relative'} 
      bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 
      ${isMobile ? 'w-full' : 'w-80 md:w-72'} 
      h-screen overflow-hidden`}
  >
    {/* Animated background */}
    <div className="absolute inset-0">
      <div
        className="absolute w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
        style={{
          left: mousePosition.x * 0.01 + 'px',
          top: mousePosition.y * 0.01 + 'px',
          transition: 'all 0.5s ease-out'
        }}
      />
      <div className="absolute w-full h-full bg-gradient-to-b from-transparent via-black/20 to-black/40" />
    </div>

    <div className="relative z-10 p-6 md:p-4 h-full flex flex-col">
      {/* Close button for mobile */}
      {isMobile && (
        <button
          onClick={() => setside(false)}
          className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
        >
          <HiArrowLongLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {/* User Profile Section */}
      <div className="text-center mb-8 mt-8 md:mt-4 md:mb-4">
        <div className="mb-4 flex justify-center">
          <div className="p-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
        <h2 className="text-2xl md:text-lg font-bold text-white mb-2">{name}</h2>
        <div className="inline-flex items-center gap-2 px-4 py-2 md:px-3 md:py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 rounded-full">
          <HiCreditCard className="w-5 h-5 md:w-4 md:h-4 text-green-400" />
          <span className="text-green-400 font-semibold text-sm md:text-xs">₹{earning}</span>
        </div>
      </div>

      {/* Account Info Card */}
      <div className="flex-1 mb-6 md:mb-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 md:p-4 shadow-2xl">
          <h3 className="text-white/80 text-sm md:text-xs font-medium mb-4 flex items-center gap-2">
            <HiCreditCard className="w-4 h-4" />
            ACCOUNT INFO
          </h3>

          <div className="space-y-4 md:space-y-3">
            {/* Bank Name */}
            <div>
              <label className="text-white/60 text-xs block mb-1">Bank Name</label>
              {isediting ? (
                <input
                  key="bank_name_input"
                  className="w-full px-3 py-2 md:py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-white text-sm md:text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={bank_name}
                  onChange={(e) => setBank_name(e.target.value)}
                  readOnly={!isediting}
                />
              ) : (
                <div className="w-full px-3 py-2 md:py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/90 text-sm md:text-xs">
                  {bank_name}
                </div>
              )}
            </div>

            {/* Account Number */}
            <div>
              <label className="text-white/60 text-xs block mb-1">Account Number</label>
              {isediting ? (
                <input
                  key="account_no_input"
                  className="w-full px-3 py-2 md:py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-white text-sm md:text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={account_no}
                  onChange={(e) => setAccount_no(e.target.value)}
                  readOnly={!isediting}
                />
              ) : (
                <div className="w-full px-3 py-2 md:py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/90 text-sm md:text-xs">
                  {account_no}
                </div>
              )}
            </div>

            {/* IFSC Code */}
            <div>
              <label className="text-white/60 text-xs block mb-1">IFSC Code</label>
              {isediting ? (
                <input
                  key="ifsc_code_input"
                  className="w-full px-3 py-2 md:py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-white text-sm md:text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={ifsc_code}
                  onChange={(e) => setIfsc_code(e.target.value)}
                  readOnly={!isediting}
                />
              ) : (
                <div className="w-full px-3 py-2 md:py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/90 text-sm md:text-xs">
                  {ifsc_code}
                </div>
              )}
            </div>

            {/* Account Holder Name */}
            <div>
              <label className="text-white/60 text-xs block mb-1">Account Holder Name</label>
              {isediting ? (
                <input
                  key="account_holder_name_input"
                  className="w-full px-3 py-2 md:py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-white text-sm md:text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={user_name_in_bank}
                  onChange={(e) => setUser_name_in_bank(e.target.value)}
                  readOnly={!isediting}
                />
              ) : (
                <div className="w-full px-3 py-2 md:py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/90 text-sm md:text-xs">
                  {user_name_in_bank}
                </div>
              )}
            </div>

            {/* Edit/Save Button */}
            <button
              onClick={isediting ? handleUpdate : () => setisediting(true)}
              className="w-full mt-4 md:mt-3 px-4 py-2 md:px-3 md:py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-sm md:text-xs font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {isediting ? (
                <>
                  <HiCheckCircle className="w-4 h-4" />
                  Confirm Edit
                </>
              ) : (
                <>
                  <HiPencilSquare className="w-4 h-4" />
                  Edit Info
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Withdrawal Button */}
      <button className="group relative overflow-hidden px-6 md:px-4 py-3 md:py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold text-sm md:text-xs rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
        <span className="relative z-10">Request Withdrawal</span>
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
    </div>
  </div>
);


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 via-purple-50 to-blue-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {side && (
        <div className="lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setside(false)} />
          <Sidebar isMobile={true} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div 
            className="absolute w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse"
            style={{
              right: (window.innerWidth - mousePosition.x) * 0.02 + 'px',
              top: mousePosition.y * 0.01 + 'px',
              transition: 'all 0.3s ease-out'
            }}
          />
        </div>

        <div className="relative z-10 h-screen flex flex-col">
          {/* Header */}
          <div className="backdrop-blur-xl bg-white/10 border-b border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setside(true)}
                  className="lg:hidden p-2 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <HiBars3 className="w-6 h-6 text-gray-700" />
                </button>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  feedkaro
                </div>
              </div>

              <Link
                href={{
                  pathname: "/yourplaces",
                  query: { id, clerk_id, name },
                }}
              >
                <button className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                  Your Places
                </button>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-6 pb-4">
            <div className="relative max-w-md mx-auto">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search places..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 backdrop-blur-xl bg-white/60 border border-white/30 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/30 transition-all duration-300"
              />
            </div>
          </div>

          {/* Places List */}
          <div className="flex-1 px-6 pb-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              {filteredPlaces.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                  {filteredPlaces.map((place, index) => (
                    <div
                      key={place.id}
                      className="group backdrop-blur-xl bg-white/20 border border-white/30 rounded-xl p-6 shadow-lg hover:bg-white/30 hover:scale-[1.02] transition-all duration-300"
                    >
                      {/* Place Info */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-gray-900 transition-colors duration-300">
                            {place.name}
                          </h3>
                          <a
                            href={place.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm mt-1 transition-colors duration-300"
                          >
                            <HiMapPin className="w-4 h-4" />
                            View on Map
                          </a>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Reward</div>
                          <div className="text-lg font-bold text-green-600">+₹4</div>
                        </div>
                      </div>

                      {/* Upload Form */}
                      <form onSubmit={(e) => handleSubmit(e, place.id, id)} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <label htmlFor={`image-${index}`} className="flex-1">
                            <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-lg hover:from-blue-100 hover:to-purple-100 hover:border-blue-400 transition-all duration-300 cursor-pointer">
                              <HiPhoto className="w-5 h-5 text-blue-600" />
                              <span className="text-blue-700 font-medium">Choose Screenshot</span>
                            </div>
                            <input
                              type="file"
                              id={`image-${index}`}
                              name="image"
                              accept="image/*"
                              className="hidden"
                            />
                          </label>
                          
                          <button
                            type="submit"
                            disabled={uploading === place.id}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                          >
                            {uploading === place.id ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Uploading...
                              </div>
                            ) : (
                              'Submit'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-600 rounded-full animate-spin animate-reverse" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-700 mt-4 mb-2">Discovering Amazing Places</h3>
                  <p className="text-gray-600 text-center max-w-md">
                    We&apos;re fetching the latest places for you to explore and earn from.
                    Something exciting is coming your way!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Placelist;
