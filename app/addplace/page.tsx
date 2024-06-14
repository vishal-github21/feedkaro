"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const AddPlace = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [placename, setPlacename] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const router=useRouter()
  const handleUpdate = async (event: FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await axios.post("/api/addplace", {
        UserId: id,
        name: placename,
        link: link,
        img: img,
      });
      console.log(response.data);
      router.push(`/yourplaces?id=${id}`)
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImg(reader.result as string);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <main>
      <div className="min-h-screen flex justify-center bg-gray-300 items-center">
        <div className="mx-[8%] my-20 rounded-lg shadow-xl bg-white min-h-[75vh] w-full">
          <div className="h-[32vh] bg-violet-950 shadow-md rounded-t-lg text-5xl flex items-center px-24">
            <div className="flex-col">
              <div>Add Place</div>
              <div className="text-base mt-2 pl-1">user id : {id}</div>
            </div>
            <div className="float-right w-[60%]"></div>
          </div>
          <div className="p-8">
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="placename" className="block text-sm font-medium text-gray-700">
                    Place Name
                  </label>
                  <input
                    type="text"
                    id="placename"
                    value={placename}
                    onChange={(e) => setPlacename(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="img" className="block text-sm font-medium text-gray-700">
                    Image
                  </label>
                  <input
                    type="file"
                    id="img"
                    onChange={handleImageChange}
                    className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                  Link
                </label>
                <input
                  type="text"
                  id="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Place
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddPlace;
