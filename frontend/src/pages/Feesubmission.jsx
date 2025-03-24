import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

function FeeSubmission() {
  const [formData, setFormData] = useState({
    class: "",
    studentName: "",
    admissionNumber: "",
    session: "2025-2026",
    feeAmount: "", // New feeAmount field
  });
  const [isStudentFound, setIsStudentFound] = useState(null); // null for initial state
  const [isPaymentVisible, setIsPaymentVisible] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate searching for a student
    const studentExists =
      formData.studentName === "John Doe" ||
      formData.admissionNumber === "12345"; // Mock student search

    if (studentExists) {
      setIsStudentFound(true);
      setIsPaymentVisible(true);
    } else {
      setIsStudentFound(false);
      setIsPaymentVisible(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const loadRazorpay = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => {
      alert("Razorpay SDK failed to load. Are you online?");
    };
    script.onload = async () => {
      try {
        const options = {
          key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay key ID
          amount: formData.feeAmount * 100, // Multiply by 100 to convert to paisa
          currency: "INR",
          name: "Vidyanidhi",
          description: "Fee Payment",
          handler: function (response) {
            alert(
              "Payment Successful! Payment ID: " + response.razorpay_payment_id
            );
          },
          prefill: {
            name: formData.studentName,
            email: "student@example.com", // You can make this dynamic
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (error) {
        console.error("Razorpay Error:", error);
      }
    };
    document.body.appendChild(script);
  };

  return (
    <>
      <Header />
      <div className="min-w-[85vw] overflow-hidden bg-slate-200 mt-44 mx-auto  sm:w-full sm:min-w-[90vw] ">
        <div className="w-full   flex flex-col items-center  ">
          <main
            className="container mx-auto px-4 py-8 flex flex-col items-center justify-center sm:min-w-[30vw] sm:max-w-[40vw]"
            data-aos="fade-up"
          >
            <h2 className="text-3xl font-bold mb-2">Online Fee Submission</h2>
            <p className="text-xl text-gray-600 mb-6">
              Submit your fees online
            </p>

            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-lg shadow-md min-w-[70vw] max-w-[90vw]"
            >
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  School:
                </label>
                <p className="text-gray-900">Vidya Nidhi</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Session:
                </label>
                <select
                  name="session"
                  value={formData.session}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option>Select session</option>
                  <option value="2024-25">2024-25</option>
                  <option value="2025-26">2025-26</option>
                  <option value="2026-27">2026-27</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Class:
                </label>
                <div className="relative">
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option>Select Class</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                  </select>
                </div>
              </div>

              {/* New Fee Amount Section */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Fee Amount:
                </label>
                <input
                  type="number"
                  name="feeAmount"
                  value={formData.feeAmount}
                  onChange={handleInputChange}
                  placeholder="Enter fee amount"
                  className="w-full px-3 py-2 border rounded text-gray-900"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Student Name:
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  placeholder="Enter student name"
                  className="w-full px-3 py-2 border rounded text-gray-900"
                />
              </div>
              <div className="mb-4 text-center text-gray-600">OR</div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Admission Number:
                </label>
                <input
                  type="text"
                  name="admissionNumber"
                  value={formData.admissionNumber}
                  onChange={handleInputChange}
                  placeholder="Enter student Admission Number"
                  className="w-full px-3 py-2 border rounded text-gray-900"
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Search
                </button>
              </div>
            </form>

            {isStudentFound === false && (
              <p className="text-red-500 text-lg mt-4">
                No student found. Please try again.
              </p>
            )}

            {isPaymentVisible && (
              <div className="mt-6" data-aos="fade-up">
                <h3 className="text-2xl font-bold mb-4">Payment Options</h3>
                <button
                  onClick={loadRazorpay}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Pay with Razorpay
                </button>
              </div>
            )}

            {/* About the School Section */}
            <div className="mt-12" data-aos="fade-up">
              <h2 className="text-2xl font-semibold">About Our School</h2>
              <p className="mt-4 text-gray-600">
                Our school is committed to excellence in academics, sports, and
                co-curricular activities. We believe in nurturing every student
                to achieve their full potential.
              </p>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default FeeSubmission;
