import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Allapi from "../../../common/index";
import { Link } from "react-router-dom";

const CreateBranch = () => {
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [colony, setColony] = useState("");
  const [villageTown, setVillageTown] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!name || !street || !colony || !villageTown || !phone) {
      toast.error("Please fill out all fields.");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const response = await fetch(Allapi.createBranch.url, {
        method: Allapi.createBranch.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, street, colony, villageTown, phone }),
      });

      if (response.ok) {
        // Reset form fields
        setName("");
        setStreet("");
        setColony("");
        setVillageTown("");
        setPhone("");

        toast.success("Branch created successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to create branch.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <ToastContainer />

      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl">
        <h2 className="text-3xl font-semibold text-blue-700 mb-6 text-center">
          Create Branch
        </h2>

        {/* Form Layout */}
        <div className="grid md:grid-cols-2 gap-5">
          <input
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Branch Name"
          />

          <input
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Street"
          />

          <input
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
            type="text"
            value={colony}
            onChange={(e) => setColony(e.target.value)}
            placeholder="Colony"
          />

          <input
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
            type="text"
            value={villageTown}
            onChange={(e) => setVillageTown(e.target.value)}
            placeholder="Village/Town"
          />

          <input
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
            type="text"
            value={phone}
            onChange={(e) => {
              const input = e.target.value.slice(0, 10); // Limit input to 10 characters
              setPhone(input);
            }}
            placeholder="Phone Number"
          />
          <Link
            to={"/admin/branch/view"}
            className="bg-blue-500 text-white p-4 rounded hover:bg-blue-700 hover:text-white"
          >
            view all Branches
          </Link>
        </div>

        <button
          className="mt-6 w-full bg-blue-950 hover:bg-blue-900 text-white font-semibold p-3 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out flex items-center justify-center"
          onClick={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          ) : (
            "Create Branch"
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateBranch;
