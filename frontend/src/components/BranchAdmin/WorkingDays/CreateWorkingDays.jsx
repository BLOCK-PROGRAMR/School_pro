import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Allapi from "../../../common";
import { mycon } from "../../../store/Mycontext";

const WorkingDays = () => {
  const { branchdet } = useContext(mycon);
  const [acid, setAcid] = useState("");
  const [currentAcademicYear, setCurrentAcademicYear] = useState("");
  const [workingDays, setWorkingDays] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMonth, setEditingMonth] = useState(null);
  const [formData, setFormData] = useState({
    june: "",
    july: "",
    august: "",
    september: "",
    october: "",
    november: "",
    december: "",
    january: "",
    february: "",
    march: "",
    april: "",
  });

  // Fetch current academic year
  const curracad = async (bid) => {
    try {
      const response = await fetch(Allapi.getAcademicYears.url(bid), {
        method: Allapi.getAcademicYears.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch academic years");

      const res = await response.json();
      if (res.success && res.data.length > 0) {
        const latestAcademicYear = res.data
          .sort((a, b) => {
            const [startA, endA] = a.year.split("-").map(Number);
            const [startB, endB] = b.year.split("-").map(Number);
            return startB - startA || endB - endA;
          })[0];

        setAcid(latestAcademicYear._id);
        setCurrentAcademicYear(latestAcademicYear.year);
      }
    } catch (error) {
      toast.error("Failed to fetch academic year");
    }
  };

  const fetchWorkingDays = async (branchId, academicId) => {
    try {
      const response = await fetch(
        Allapi.getWorkingDays.url(branchId, academicId),
        {
          method: Allapi.getWorkingDays.method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setWorkingDays(result.data);
        setFormData(result.data.months);
      } else {
        // If no working days are set, we're in initial setup mode
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error fetching working days:", error);
      // If there's an error, we might be in initial setup mode
      setIsEditing(true);
    }
  };

  const handleInputChange = (month, value) => {
    // Remove leading zeros and ensure value is between 0 and 30
    const sanitizedValue = value.replace(/^0+/, "");
    const numValue = sanitizedValue === "" ? "" : Math.min(Math.max(Number(sanitizedValue), 0), 30);

    setFormData((prev) => ({
      ...prev,
      [month]: numValue.toString(),
    }));
  };

  const handleEditMonth = (month) => {
    setEditingMonth(month);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditingMonth(null);
    setIsEditing(false);
    // Reset form data to original values
    if (workingDays) {
      setFormData(workingDays.months);
    }
  };

  const handleSubmitMonth = async (month) => {
    try {
      // Validate the input
      const monthValue = parseInt(formData[month], 10) || 0;
      if (monthValue < 0 || monthValue > 30) {
        toast.error("Working days must be between 0 and 30");
        return;
      }

      // Prepare the payload - preserve existing months if updating
      let monthData = {};
      
      if (workingDays && workingDays.months) {
        // Start with existing months data
        monthData = { ...workingDays.months };
      }
      
      // Update or add the current month
      monthData[month] = monthValue;

      const payload = {
        branchId: branchdet._id,
        academicId: acid,
        months: monthData
      };

      const isUpdate = workingDays !== null;
      const apiConfig = isUpdate ? Allapi.updateWorkingDays : Allapi.addWorkingDays;
      const url = isUpdate 
        ? apiConfig.url(branchdet._id, acid)
        : apiConfig.url;

      const response = await fetch(url, {
        method: apiConfig.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(isUpdate ? { months: monthData } : payload),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Working days for ${month} ${isUpdate ? 'updated' : 'added'} successfully`);
        setWorkingDays(result.data);
        setEditingMonth(null);
        setIsEditing(false);
      } else {
        toast.error(result.message || `Failed to ${isUpdate ? 'update' : 'add'} working days`);
      }
    } catch (error) {
      toast.error(`An unexpected error occurred while updating working days for ${month}`);
      console.error("Submit error:", error);
    }
  };

  const handleSubmitAll = async () => {
    try {
      const payload = {
        branchId: branchdet._id,
        academicId: acid,
        months: Object.fromEntries(
          Object.entries(formData).map(([month, value]) => [
            month,
            parseInt(value, 10) || 0,
          ])
        ),
      };

      const isUpdate = workingDays !== null;
      const apiConfig = isUpdate ? Allapi.updateWorkingDays : Allapi.addWorkingDays;
      const url = isUpdate 
        ? apiConfig.url(branchdet._id, acid)
        : apiConfig.url;

      const response = await fetch(url, {
        method: apiConfig.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(isUpdate ? { months: payload.months } : payload),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`All working days ${isUpdate ? 'updated' : 'added'} successfully`);
        setWorkingDays(result.data);
        setIsEditing(false);
        setEditingMonth(null);
      } else {
        toast.error(result.message || `Failed to ${isUpdate ? 'update' : 'add'} working days`);
      }
    } catch (error) {
      toast.error(`An unexpected error occurred while ${workingDays ? 'updating' : 'adding'} working days`);
      console.error("Submit error:", error);
    }
  };

  useEffect(() => {
    if (branchdet?._id) {
      curracad(branchdet._id);
    }
  }, [branchdet]);

  useEffect(() => {
    if (branchdet?._id && acid) {
      fetchWorkingDays(branchdet._id, acid);
    }
  }, [branchdet, acid]);

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100">
      <div className="p-8 mx-auto bg-white rounded-lg shadow-lg max-w-7xl">
        <h2 className="mb-6 text-3xl font-bold text-gray-800">
          {workingDays ? "Manage Working Days" : "Set Working Days"}
        </h2>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Academic Year
          </label>
          <input
            type="text"
            value={currentAcademicYear}
            disabled
            className="w-full p-3 text-gray-700 border rounded bg-gray-50"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-collapse border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-4 font-semibold text-left text-gray-700 border-r border-gray-300">
                  Month
                </th>
                <th className="p-4 font-semibold text-left text-gray-700">
                  Working Days
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(formData).map((month) => {
                const isMonthSet = workingDays && workingDays.months[month] !== undefined;
                const showInput = !isMonthSet || isEditing && (editingMonth === month || editingMonth === null);
                
                return (
                  <tr key={month} className={editingMonth === month ? "bg-blue-50" : ""}>
                    <td className="p-4 font-medium text-gray-700 border-r border-gray-300">
                      {month.charAt(0).toUpperCase() + month.slice(1)}
                    </td>
                    <td className="p-4">
                      {showInput ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            max="30"
                            value={formData[month]}
                            onChange={(e) => handleInputChange(month, e.target.value)}
                            className="w-full p-3 text-black bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter days (0-30)"
                          />
                          {isEditing && editingMonth === month && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSubmitMonth(month)}
                                className="px-3 py-1 text-white bg-green-600 rounded hover:bg-green-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-3 py-1 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                          {!isMonthSet && !isEditing && (
                            <button
                              onClick={() => handleSubmitMonth(month)}
                              className="px-3 py-1 text-white bg-green-600 rounded hover:bg-green-700"
                            >
                              Save
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-black">
                            {workingDays.months[month]}
                          </span>
                          <button
                            onClick={() => handleEditMonth(month)}
                            className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                            disabled={isEditing && editingMonth !== month}
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-6">
          {!workingDays ? (
            <button
              onClick={handleSubmitAll}
              className="px-6 py-3 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
            >
              Save All Working Days
            </button>
          ) : !isEditing ? (
            <button
              onClick={() => {
                setIsEditing(true);
                setEditingMonth(null); // Set to null to edit all months
              }}
              className="px-6 py-3 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
            >
              Edit All Working Days
            </button>
          ) : editingMonth === null ? (
            <div className="flex space-x-4">
              <button
                onClick={handleCancelEdit}
                className="px-6 py-3 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAll}
                className="px-6 py-3 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
              >
                Save All Changes
              </button>
            </div>
          ) : (
            <div></div> // Empty div to maintain layout when editing individual month
          )}
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default WorkingDays;