import React, { useState, useEffect, useContext } from "react";
import { mycon } from "../../../store/Mycontext";
import Allapi from "../../../common";
import { Bus, Users, MapPin } from "lucide-react";

const ShowReport = () => {
  const { branchdet } = useContext(mycon);
  const curr_Acad = branchdet?.academicYears?.[0] || "";
  const token = localStorage.getItem("token");

  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBusDetails, setSelectedBusDetails] = useState(null);

  useEffect(() => {
    if (curr_Acad) {
      fetchBuses();
    }
  }, [curr_Acad]);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await fetch(Allapi.getAllBuses.url(curr_Acad), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch buses");
      }

      const res = await response.json();
      if (res.success) {
        setBuses(res.data);
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedBus) return;

    const fetchVehicleReport = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          Allapi.getVehicleStudents.url(selectedBus),
          {
            method: Allapi.getVehicleStudents.method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch vehicle report");
        }

        const data = await response.json();
        if (data.success) {
          const processedData = processReportData(data.data);
          setReportData(processedData);

          const busDetails = buses.find((bus) => bus._id === selectedBus);
          setSelectedBusDetails(busDetails);
        }
      } catch (error) {
        console.error("Error fetching vehicle report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleReport();
  }, [selectedBus]);

  const processReportData = (data) => {
    const grouped = data.reduce((acc, student) => {
      const key = `${student.class.name}-${student.section.name}`;
      if (!acc[key]) {
        acc[key] = {
          classSection: key,
          students: [],
          towns: new Set(),
          halts: new Set(),
          totalFeeDue: 0,
        };
      }

      acc[key].students.push({
        name: `${student.name} ${student.surname || ""}`,
        town: student.transportDetails?.town || "N/A",
        halt: student.transportDetails?.halt || "N/A",
        feeDue: calculateTransportFeeDue(student.feeDetails),
      });

      if (student.transportDetails?.town) {
        acc[key].towns.add(student.transportDetails.town);
      }
      if (student.transportDetails?.halt) {
        acc[key].halts.add(student.transportDetails.halt);
      }

      acc[key].totalFeeDue += calculateTransportFeeDue(student.feeDetails);

      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) =>
      a.classSection.localeCompare(b.classSection)
    );
  };

  const calculateTransportFeeDue = (feeDetails) => {
    const transportFee = feeDetails?.find(
      (fee) => fee.name === "Transport-fee"
    );
    if (!transportFee) return 0;
    return transportFee.amount - (transportFee.paid || 0);
  };

  const handleBusChange = (event) => {
    setSelectedBus(event.target.value);
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Bus className="w-10 h-10 text-blue-600" />
          <h1 className="text-3xl font-bold text-blue-900">
            Vehicle Wise Report
          </h1>
        </div>

        <div className="mb-8 bg-white p-6 rounded-lg shadow-lg border border-blue-100">
          <label
            className="block text-blue-800 font-semibold mb-2 text-lg"
            htmlFor="busSelect"
          >
            Select Vehicle
          </label>
          <select
            id="busSelect"
            className="w-full p-3 border-2 border-blue-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-bold-yellow-900"
            value={selectedBus}
            onChange={handleBusChange}
            disabled={loading}
          >
            <option value="">-- Select a Vehicle --</option>
            {buses.map((bus) => (
              <option key={bus._id} value={bus._id}>
                {bus.busNo} - {bus.vehicleNo} ({bus.destination})
              </option>
            ))}
          </select>
        </div>

        {selectedBusDetails && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-lg border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
                <Bus className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">
                    Bus Number
                  </p>
                  <p className="text-lg font-bold text-blue-900">
                    {selectedBusDetails.busNo}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg">
                <Users className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-green-600 font-medium">Driver</p>
                  <p className="text-lg font-bold text-green-900">
                    {selectedBusDetails.driverName}
                  </p>
                  <p className="text-sm text-green-700">
                    {selectedBusDetails.driverPhone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-red-50 p-4 rounded-lg">
                <MapPin className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-red-600 font-medium">Route</p>
                  <p className="text-lg font-bold text-red-900">
                    {selectedBusDetails.destination}
                  </p>
                  <p className="text-sm text-red-700">
                    Via: {selectedBusDetails.viaTowns.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )}

        {!loading && selectedBus && reportData.length > 0 && (
          <div className="space-y-8">
            {reportData.map((group, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg border border-blue-100 overflow-hidden"
              >
                <div className="bg-blue-600 p-4">
                  <h2 className="text-xl font-bold text-white">
                    {group.classSection}
                  </h2>
                  <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-blue-100">
                    <p>Students: {group.students.length}</p>
                    <p>Towns: {group.towns.size}</p>
                    <p>Halts: {group.halts.size}</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-blue-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-6  py-3  text-left text-sm font-bold text-blue-900 uppercase">
                          Student Name
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-blue-900 uppercase">
                          Town
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-blue-900 uppercase">
                          Halt Point
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-blue-900 uppercase">
                          Fee Due
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-100 ">
                      {group.students.map((student, studentIndex) => (
                        <tr
                          key={studentIndex}
                          className="hover:bg-blue-50 transition-colors"
                        >
                          <td className="px-6  py-4 text-xl  text-left text-blue-900 font-bold">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 text-xl text-left text-blue-800 font-bold">
                            {student.town}
                          </td>
                          <td className="px-6 py-4 text-xl text-left text-blue-800 font-bold">
                            {student.halt}
                          </td>
                          <td className="px-6 py-4 text-xl  text-left text-blue-900 font-bold">
                            ₹{student.feeDue.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-blue-50 font-bold">
                        <td
                          colSpan="3"
                          className="px-6 py-4 text-sm text-blue-900 text-right"
                        >
                          Total Fee Due:
                        </td>
                        <td className="px-6 py-4 text-xl text-blue-900">
                          ₹{group.totalFeeDue.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && selectedBus && reportData.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-lg border border-blue-100">
            <Bus className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <p className="text-xl font-semibold text-blue-900">
              No students found for this vehicle
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowReport;
