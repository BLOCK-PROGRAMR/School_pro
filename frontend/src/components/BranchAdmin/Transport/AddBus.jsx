import React, { useState, useEffect, useContext } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { mycon } from "../../../store/Mycontext";
import Allapi from "../../../common";

const AddBus = () => {
  const { branchdet } = useContext(mycon);
  const curr_Acad = branchdet?.academicYears?.[0] || "";
  const token = localStorage.getItem("token");

  const [busNo, setBusNo] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [destination, setDestination] = useState("");
  const [viaTowns, setViaTowns] = useState([]);
  const [selectedViaTown, setSelectedViaTown] = useState("");
  const [towns, setTowns] = useState([]);
  const [buses, setBuses] = useState([]);
  const [editingBusId, setEditingBusId] = useState(null);

  // Fetch towns and buses
  useEffect(() => {
    if (branchdet?.academicYears?.length > 0) {
      const currentAcademicYear = branchdet.academicYears[0];
      fetchTowns(currentAcademicYear);
      fetchBuses(currentAcademicYear);
    }
  }, [branchdet]);

  const fetchTowns = async (curr_Acad) => {
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

  const fetchBuses = async (curr_Acad) => {
    try {
      const response = await fetch(Allapi.getAllBuses.url(curr_Acad), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch buses");
      }

      const res = await response.json();
      if (res.success) {
        setBuses(res.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Add this validation function
  const validateDriverPhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  // Update the addOrUpdateBus function to include phone validation
  const addOrUpdateBus = async () => {
    if (
      !busNo ||
      !vehicleNo ||
      !driverName ||
      !driverPhone ||
      !destination ||
      viaTowns.length === 0
    ) {
      toast.error("Please fill out all fields.");
      return;
    }

    // Add phone number validation
    if (!validateDriverPhone(driverPhone)) {
      toast.error("Driver phone number must be exactly 10 digits.");
      return;
    }

    const newBus = {
      busNo,
      vehicleNo,
      driverName,
      driverPhone,
      destination,
      viaTowns,
      academicId: curr_Acad,
    };

    try {
      const response = await fetch(
        editingBusId ? Allapi.updateBus.url(editingBusId) : Allapi.addBus.url,
        {
          method: editingBusId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newBus),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      toast.success(
        editingBusId ? "Bus updated successfully" : "Bus added successfully"
      );

      // Clear form fields and refresh buses list
      resetForm();
      fetchBuses(curr_Acad);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete a bus
  const deleteBus = async (busId) => {
    if (window.confirm("Do you want to delete the bus?")) {
      try {
        const response = await fetch(Allapi.deleteBus.url(busId), {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }

        toast.success("Bus deleted successfully");
        fetchBuses(curr_Acad); // Refresh buses list
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  // Prefill form for editing
  const editBus = (bus) => {
    setBusNo(bus.busNo);
    setVehicleNo(bus.vehicleNo);
    setDriverName(bus.driverName);
    setDriverPhone(bus.driverPhone);
    setDestination(bus.destination);
    setViaTowns(bus.viaTowns);
    setEditingBusId(bus._id);
  };

  // Reset form fields
  const resetForm = () => {
    setBusNo("");
    setVehicleNo("");
    setDriverName("");
    setDriverPhone("");
    setDestination("");
    setViaTowns([]);
    setSelectedViaTown("");
    setEditingBusId(null);
  };

  // Update the addViaTown function to prevent duplicate entries
  const addViaTown = () => {
    if (selectedViaTown && !viaTowns.includes(selectedViaTown)) {
      setViaTowns([...viaTowns, selectedViaTown]);
      setSelectedViaTown("");
    } else if (selectedViaTown && viaTowns.includes(selectedViaTown)) {
      toast.warning("This town is already added as a via town");
      setSelectedViaTown("");
    }
  };

  // Delete a specific via town
  const deleteViaTown = (index) => {
    setViaTowns(viaTowns.filter((_, townIndex) => townIndex !== index));
  };

  return (
    <div className="min-h-screen bg-blue-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-blue-700">
          {editingBusId ? "Edit Bus" : "Add Bus"}
        </h2>

        {/* Form Fields */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Bus Number"
            value={busNo}
            onChange={(e) => setBusNo(e.target.value)}
            className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Vehicle Number"
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value)}
            className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Driver Name"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Driver Phone"
            value={driverPhone}
            onChange={(e) => {
              // Only allow numeric input
              const value = e.target.value.replace(/\D/g, '');
              // Limit to 10 characters
              if (value.length <= 10) {
                setDriverPhone(value);
              }
            }}
            maxLength={10}
            pattern="[0-9]{10}"
            className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Destination Town</option>
            {towns.map((town) => (
              <option key={town._id} value={town.townName}>
                {town.townName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6 flex items-center space-x-4">
          <select
            value={selectedViaTown}
            onChange={(e) => setSelectedViaTown(e.target.value)}
            className="border p-3 rounded flex-grow focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Via Town</option>
            {towns
              .map((town) => (
                <option key={town._id} value={town.townName}>
                  {town.townName}
                </option>
              ))}
          </select>
          <button
            onClick={addViaTown}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow"
          >
            <FaPlus className="inline-block mr-2" /> Add Via Town
          </button>
        </div>

        {viaTowns.length > 0 && (
          <ul className="list-disc pl-6 mb-6 text-black">
            {viaTowns.map((town, index) => (
              <li
                key={index}
                className="mb-2 flex justify-between items-center"
              >
                {town}
                <button
                  onClick={() => deleteViaTown(index)}
                  className="ml-3 text-red-500 hover:text-red-700"
                >
                  <FaTrashAlt />
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={addOrUpdateBus}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded shadow mb-6 w-full"
        >
          {editingBusId ? "Update Bus" : "Add Bus"}
        </button>
        <ToastContainer />

        {/* Display all buses */}
        <h2 className="text-2xl font-bold mt-8 text-blue-700">All Buses</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Bus No</th>
                <th className="px-4 py-2">Vehicle No</th>
                <th className="px-4 py-2">Driver Name</th>
                <th className="px-4 py-2">Driver Phone</th>
                <th className="px-4 py-2">Destination</th>
                <th className="px-4 py-2">Via Towns</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus._id} className="border-b">
                  <td className="px-4 py-2">{bus.busNo}</td>
                  <td className="px-4 py-2">{bus.vehicleNo}</td>
                  <td className="px-4 py-2">{bus.driverName}</td>
                  <td className="px-4 py-2">{bus.driverPhone}</td>
                  <td className="px-4 py-2">{bus.destination}</td>
                  <td className="px-4 py-2">{bus.viaTowns.join(", ")}</td>
                  <td className="px-4 py-2 flex items-center space-x-4">
                    <button
                      onClick={() => editBus(bus)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteBus(bus._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddBus;
