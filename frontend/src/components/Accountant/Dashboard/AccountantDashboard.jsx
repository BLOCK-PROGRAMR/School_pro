import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import Allapi from "../../../common";
import { jwtDecode } from "jwt-decode";
import { mycon } from "../../../store/Mycontext";
import { 
  Users, 
  DollarSign, 
  FileText, 
  Calendar, 
  CreditCard, 
  BookOpen, 
  TrendingUp, 
  AlertCircle 
} from "lucide-react";

const AccountantDashboard = () => {
  const { branchdet, c_acad } = useContext(mycon);
  const [c_user, setc_user] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setc_user(decoded);
        // We don't need to fetch branch details here anymore
        // as it's provided by the context
      } catch (error) {
        console.error("Error decoding token:", error);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-blue-800">
            Welcome, {c_user?.name || "Accountant"}!
          </h2>
          <p className="text-gray-600">
            Here's an overview of your branch's financial activities and statistics.
          </p>

          {/* Branch Details */}
          {branchdet && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Branch Details
              </h3>
              <p className="text-gray-800">
                <strong>Branch Name:</strong> {branchdet.name}
              </p>
              <p className="text-gray-800">
                <strong>Phone:</strong> {branchdet.phone}
              </p>
              <p className="text-gray-800">
                <strong>Address:</strong>{" "}
                {`${branchdet.street}, ${branchdet.colony}, ${branchdet.villageTown}`}
              </p>
              {c_acad && (
                <p className="text-gray-800">
                  <strong>Current Academic Year:</strong> {c_acad}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Branch Stats Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold">Total Students</h3>
            <p className="text-3xl mt-2">320</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold">Total Teachers</h3>
            <p className="text-3xl mt-2">20</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold">Total Classes</h3>
            <p className="text-3xl mt-2">10</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold">Fees Collected</h3>
            <p className="text-3xl mt-2">₹ 15,00,000</p>
          </div>
        </div>

        {/* Branch Activity & Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Class Attendance</h3>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">
              Student Grades Overview
            </h3>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Announcements for Branch */}
        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h3 className="text-xl font-semibold mb-4">Announcements</h3>
          <ul>
            <li className="mb-3">Upcoming Parent-Teacher Meetings.</li>
            <li className="mb-3">
              Branch staff meeting scheduled for Friday.
            </li>
            <li className="mb-3">Student field trip scheduled next month.</li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white p-4 shadow text-center">
        <p className="text-gray-600">
          &copy; 2024 Vidya Nidhi School -{" "}
          {branchdet ? branchdet.name : "Loading..."} Branch. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default AccountantDashboard; 