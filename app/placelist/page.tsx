"use client";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { HiBars3, HiArrowLongLeft } from "react-icons/hi2";

interface Place {
  name: string;
  link: string;
  img: string;
  id: string;
}

interface UserData {
  id: string;
  clerk_id: string;
  name: string;
  earning: number;
  account_no: string;
  ifsc_code: string;
  bank_name: string;
  user_name_in_bank: string;
  feed_count: number;
  feedplaces: string[];
}

const Placelist = () => {
  const [user, setUser] = useState<UserData>({
    id: "",
    clerk_id: "",
    name: "-",
    earning: 0,
    account_no: "",
    ifsc_code: "",
    bank_name: "",
    user_name_in_bank: "",
    feed_count: 0,
    feedplaces: [],
  });

  const [places, setPlaces] = useState<Place[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [side, setSide] = useState(false);

  const fetchData = async () => {
    try {
      const userRes = await axios.get("/api/us");
      const userData = userRes.data;

      const placesRes = await axios.get("/api/fetchplaces", {
        params: { userId: userData.id },
      });

      setUser({
        id: userData.id,
        clerk_id: userData.clerk_id,
        name: userData.name,
        earning: userData.earning,
        account_no: userData.account_no,
        ifsc_code: userData.ifsc_code,
        bank_name: userData.bank_name,
        user_name_in_bank: userData.user_name_in_bank,
        feed_count: userData.feed_count,
        feedplaces: userData.feedplaces,
      });

      setPlaces(placesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const unvisitedPlaces = useMemo(
    () => places.filter((place) => !user.feedplaces.includes(place.id)),
    [places, user.feedplaces]
  );

  const handleSubmit = async (e: React.FormEvent, placeId: string) => {
    e.preventDefault();
    const fileInput = (e.target as HTMLFormElement).elements.namedItem(
      "image"
    ) as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) return alert("Please select an image.");

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = reader.result as string;

        await axios.post("/api/addfeed", {
          img: base64,
          placeId,
          userId: user.id,
        });

        alert("Feed uploaded successfully!");

        // ✅ Update user state directly
        setUser((prev) => ({
          ...prev,
          earning: prev.earning + 4,
          feed_count: prev.feed_count + 1,
          feedplaces: [...prev.feedplaces, placeId],
        }));
      } catch (error) {
        console.error("Error uploading feed:", error);
        alert("Upload failed.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    try {
      await axios.post("/api/updateuser", {
        ...user,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const Sidebar = (
    <div className="container bg-gradient-to-b from-[#000000] to-[#283618] pt-12 h-screen w-[100%] md:w-[21%]">
      <div className="flex flex-col items-center w-full relative">
        {side && (
          <button onClick={() => setSide(false)}>
            <HiArrowLongLeft className="absolute right-5 text-white top-5 h-7 w-7 md:hidden" />
          </button>
        )}
        <UserButton afterSignOutUrl="/" />
        <div className="text-4xl text-white font-mono">{user.name}</div>
        <div className="text-lg text-green-500 px-7 bg-[#606c38] rounded-sm">
          Earning: {user.earning}
        </div>
      </div>

      <div className="mt-10 px-4">
        <div className="text-xs text-[#425861a7] mb-1">ACCOUNT INFO</div>
        <div className="flex flex-col gap-2 bg-[#1b2510] p-4 rounded-md">
          {["bank_name", "account_no", "ifsc_code", "user_name_in_bank"].map((key) => (
            <div key={key}>
              <div className="text-xs text-[#536d77]">{key.replace(/_/g, " ")}</div>
              {isEditing ? (
                <input
                  className="text-xs text-white bg-[#425861] rounded-sm px-2 w-full h-5"
                  value={user[key as keyof UserData]}
                  onChange={(e) =>
                    setUser((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                />
              ) : (
                <div className="text-xs text-white bg-[#425861] rounded-sm px-2 w-full h-5 flex items-center">
                  {user[key as keyof UserData]}
                </div>
              )}
            </div>
          ))}
          <button
            onClick={isEditing ? handleUpdate : () => setIsEditing(true)}
            className="bg-[#517460] hover:bg-[#32483c] text-white mt-4 py-2 text-sm rounded-md"
          >
            {isEditing ? "Confirm Edit" : "Edit"}
          </button>
        </div>
        <div className="mt-6">
          <button className="bg-gradient-to-r from-[#4800ff] via-[#b300ff] to-[#ff006a] text-xs text-white py-2 px-4 rounded-xl border-2 border-pink-600 shadow-lg">
            Request Withdrawal
          </button>
        </div>
      </div>
    </div>
  );

  const Main = (
    <div className="bg-gradient-to-br from-[#c9d5df] to-[#e7c8d4] flex flex-col p-8 h-screen w-full md:w-[79%]">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={() => setSide(true)}>
            <HiBars3 className="h-6 w-6 mr-2 text-black md:hidden" />
          </button>
          <span className="text-2xl font-bold text-[#4368ffcb] font-sans">
            feedkaro
          </span>
        </div>
        <Link
          href={{
            pathname: "/yourplaces",
            query: {
              id: user.id,
              clerk_id: user.clerk_id,
              name: user.name,
            },
          }}
        >
          <div className="h-[5vh] w-[15vh] bg-[#C6CF10] hover:bg-[#BAC20C] hover:border-2 rounded-md flex justify-center items-center">
            Your Places
          </div>
        </Link>
      </div>

      <div className="w-full mt-4 h-[85%] overflow-y-scroll scroll">
        {unvisitedPlaces.length > 0 ? (
          unvisitedPlaces.map((place) => (
            <div
              key={place.id}
              className="bg-gradient-to-bl from-[#ececec] to-[#ffffff] p-4 rounded-lg mt-4 shadow-md"
            >
              <h3 className="text-xl text-black font-bold">{place.name}</h3>
              <a
                href={place.link}
                className="text-sm font-mono border border-gray-400 border-dotted w-full py-1 px-4 rounded-md mt-1 flex items-center bg-gray-100 text-blue-600"
              >
                {place.link}
              </a>
              <form onSubmit={(e) => handleSubmit(e, place.id)} className="mt-2">
                <label htmlFor="image" className="text-sm text-gray-400 mr-2">
                  Add screenshot
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="text-purple-500 text-sm font-mono"
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
  );

  return (
    <div className="flex flex-row">
      {side ? (
        <div className="md:hidden block w-full">{Sidebar}</div>
      ) : (
        <>
          <div className="hidden md:block">{Sidebar}</div>
          <div className="flex-1">{Main}</div>
        </>
      )}
    </div>
  );
};

export default Placelist;
