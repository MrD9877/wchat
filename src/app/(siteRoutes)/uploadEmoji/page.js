"use client";
import React, { useState } from "react";

const UploadEmojiPage = () => {
  const [loading, setLoading] = useState({});
  const [sub, setSub] = useState([]);
  const [query, setQuery] = useState();
  const [searchResult, setResult] = useState(null);
  const [key, setKey] = useState();

  // Function to handle the search when user submits a query
  const handleSub = async () => {
    setLoading((pre) => ({ ...pre, sub: true }));
    try {
      const response = await fetch(`https://emoji-api.com/categories?access_key=cfbbd47e3e201f31752974e60d9b6214396926fd`);
      const results = await response.json();
      setSub(results || []); // Assuming the response contains an 'items' array
    } catch (error) {
      console.error("Error fetching API data:", error);
    } finally {
      setLoading((pre) => ({ ...pre, sub: false }));
    }
  };

  const handleGetCategory = async () => {
    try {
      setLoading((pre) => ({ ...pre, search: true }));
      const res = await fetch(`https://emoji-api.com//categories/${query}?access_key=cfbbd47e3e201f31752974e60d9b6214396926fd`);
      const data = await res.json();
      console.log(data);
      setResult(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading((pre) => ({ ...pre, search: false }));
    }
  };

  const handleUploadToDb = async () => {
    try {
      setLoading((pre) => ({ ...pre, upload: true }));
      const res = await fetch("/api/uploadEmote", { method: "POST", body: JSON.stringify({ obj: searchResult, key, query }) });
      if (res.status !== 200) {
        console.log(res.status);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading((pre) => ({ ...pre, upload: false }));
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center ">
      <div className="max-w-4xl mx-auto p-6 bg-weblue rounded-lg shadow-md min-w-[50vw]">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">API Search</h1>

        {/* Search and API Key Input */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="flex flex-col gap-1 items-end">
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Category" className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="flex gap-5">
                {searchResult && <span className="py-1 px-2 bg-green-500 text-white rounded-lg">done</span>}
                <button onClick={handleGetCategory} disabled={loading.search} className="w-fit px-2 py-1 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {loading.search ? "Loading..." : "Search"}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <input type="text" value={key} onChange={(e) => setKey(e.target.value)} placeholder="key" className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={handleUploadToDb} disabled={loading.upload} className="w-fit px-2 py-1 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
                {loading.upload ? "Loading..." : "Upload"}
              </button>
            </div>
            {/* <button onClick={handleSearch} disabled={loading} className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {loading ? "Loading..." : "Search"}
            </button> */}
          </div>
        </div>
        <div className="mt-6 max-h-[30vh] overflow-scroll">
          <button onClick={handleSub} disabled={loading.sub} className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {loading.sub ? "Loading..." : "Get Sub"}
          </button>
          <h2 className="text-xl font-semibold text-gray-800">sub categories</h2>
          {sub.length > 0 && (
            <ul className="space-y-2 mt-4">
              {sub.map((item, index) => (
                <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-gray-200">
                  {item.slug} {/* Adjust according to your API response */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadEmojiPage;
