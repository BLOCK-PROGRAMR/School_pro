import React, { useState, useEffect, useContext } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { mycon } from "../../../store/Mycontext";
import Allapi from "../../../common";

const AddTown = () => {
  const { branchdet } = useContext(mycon);
  const curr_Acad = branchdet?.academicYears?.[0] || "";
  const token = localStorage.getItem("token");
  const [townName, setTownName] = useState("");
  const [amount, setAmount] = useState("");
  const [halt, setHalt] = useState("");
  const [halts, setHalts] = useState([]);
  const [towns, setTowns] = useState([]);
  const [editingTown, setEditingTown] = useState(null);

  // Fetch towns on component load
  const fetchTowns = async (curr_Acad) => {
    if (!curr_Acad) return; // Exit if curr_Acad is not valid

    try {
      const response = await fetch(Allapi.getallTowns.url(curr_Acad), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch towns");
      }

      const res = await response.json();
      if (res.success) {
        setTowns(res.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (branchdet?.academicYears?.length > 0) {
      const currentAcademicYear = branchdet.academicYears[0];
      fetchTowns(currentAcademicYear);
    }
  }, [branchdet]);

  // Add halt (route) to the town
  const addHalt = () => {
    if (halt && !halts.includes(halt)) {
      setHalts([...halts, halt]);
      setHalt("");
    }
  };

  // Add or update a town
  const addOrUpdateTown = async () => {
    if (!amount || halts.length === 0) {
      toast.error("Please fill out all fields.");
      return;
    }

    const newTown = { townName, amount, halts, academicId: curr_Acad };

    try {
      if (editingTown) {
        // Update existing town
        const response = await fetch(Allapi.editTown.url(editingTown._id), {
          method: Allapi.editTown.method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newTown),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update town");
        }

        toast.success("Town updated successfully");
        setEditingTown(null);
      } else {
        // Add new town
        const response = await fetch(Allapi.addTown.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newTown),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }

        toast.success("Town added successfully");
      }

      // Fetch the updated list of towns
      await fetchTowns(curr_Acad);

      // Clear form fields
      setTownName("");
      setAmount("");
      setHalts([]);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete a specific halt
  const deleteHalt = (index) => {
    setHalts(halts.filter((_, haltIndex) => haltIndex !== index));
  };

  // Delete an entire town with confirmation
  const deleteTown = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this town?"
    );
    if (!confirmed) {
      return; // Exit if the user cancels the deletion
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(Allapi.deleteTown.url(id), {
        method: Allapi.deleteTown.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete town");
      }

      // If the request is successful, update the state
      setTowns(towns.filter((town) => town._id !== id));
      toast.success("Town deleted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Edit town
  const editTown = (town) => {
    setTownName(town.townName);
    setAmount(town.amount);
    setHalts(town.halts);
    setEditingTown(town);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-indigo-700">
          {editingTown ? "Edit Town" : "Add Town"}
        </h2>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Town Name"
            value={townName}
            onChange={(e) => setTownName(e.target.value)}
            className="border p-3 rounded w-full focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-3 rounded w-full focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-6 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Add Halt (Route)"
            value={halt}
            onChange={(e) => setHalt(e.target.value)}
            className="border p-3 rounded flex-grow focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={addHalt}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow"
          >
            <FaPlus className="inline-block mr-2" /> Add Halt
          </button>
        </div>

        {halts.length > 0 && (
          <ul className="list-disc pl-6 mb-6 text-black">
            {halts.map((halt, index) => (
              <li
                key={index}
                className="mb-2 flex justify-between items-center"
              >
                {halt}
                <button
                  onClick={() => deleteHalt(index)}
                  className="ml-3 text-red-500 hover:text-red-700"
                >
                  <FaTrashAlt />
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={addOrUpdateTown}
          className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded shadow mb-6 w-full"
        >
          {editingTown ? "Update Town" : "Add Town"}
        </button>

        <h3 className="text-xl font-semibold mb-4 text-gray-800">All Towns</h3>
        {towns.length > 0 ? (
          towns.map((town) => (
            <div
              key={town._id}
              className="border p-4 rounded-lg shadow mb-6 bg-gray-50"
            >
              <h4 className="text-lg font-semibold text-indigo-700">
                {town.townName}
              </h4>
              <p className="text-gray-600">Amount: {town.amount}</p>
              <p className="text-gray-600">Halts:</p>
              <ul className="list-disc pl-6 mb-4">
                {town.halts.map((halt, index) => (
                  <li key={index} className="text-gray-600">
                    {halt}
                  </li>
                ))}
              </ul>
              <div className="flex space-x-4">
                <button
                  onClick={() => editTown(town)}
                  className="text-yellow-500 hover:text-yellow-600"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => deleteTown(town._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrashAlt /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No towns added yet.</p>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddTown;
