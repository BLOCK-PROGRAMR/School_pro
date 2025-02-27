// import React from "react";
// import { useState } from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { IoCloseSharp } from "react-icons/io5";
// import Allapi from "../common";
// import { toast } from "react-toastify";
// const Addadmin = ({ onclose }) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [admindet, setadmindet] = useState({
//     username: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const handleTogglePassword = () => {
//     setShowPassword(!showPassword);
//   };
//   function handlechange(e) {
//     const { name, value } = e.target;
//     setadmindet((prevstate) => {
//       return {
//         ...prevstate,
//         [name]: value,
//       };
//     });
//     console.log(admindet);
//   }
//   async function handleSubmit(e) {
//     e.preventDefault();
//     console.log(admindet);
//     if (admindet.password == admindet.confirmPassword) {
//       const admincall = await fetch(Allapi.admin.url, {
//         method: Allapi.admin.method,
//         headers: {
//           "content-type": "application/json",
//         },
//         body: JSON.stringify(admindet),
//       });
//       const adminres = await admincall.json();
//       console.log("adminres is", adminres);
//       if (adminres.success) {
//         toast.success(adminres.message);
//         onclose();
//       }
//       if (adminres.error) {
//         toast.error(adminres.message);
//       }
//     } else {
//       toast.error("Password and Confirm Password should be same");
//     }
//   }
//   return (
//     <div>
//       <div className="add_admin absolute top-0 left-0 right-0 bottom-0 h-[100vh] w-full bg-slate-500 bg-opacity-35 flex justify-center items-center">
//         {/* <div className=" "> */}
//         <div className="flex items-center justify-center w-[50%] h-[80%] bg-red-500">
//           <div className=" relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//             <div className="absolute right-1 top-2">
//               <span>
//                 <IoCloseSharp
//                   className="text-2xl bg-red-500 rounded-full text-white p-1 font-bold cursor-pointer"
//                   onClick={onclose}
//                 />
//               </span>
//             </div>

//             <h2 className="text-2xl font-bold mb-6 text-center">
//               Admin Signup
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Username Input */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   name="username"
//                   value={admindet.username}
//                   onChange={handlechange}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   required
//                 />
//               </div>

//               {/* Password Input */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <input
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   value={admindet.password}
//                   onChange={handlechange}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   required
//                 />
//                 <div
//                   onClick={handleTogglePassword}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </div>
//               </div>

//               {/* Confirm Password Input */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Confirm Password
//                 </label>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="confirmPassword"
//                   value={admindet.confirmPassword}
//                   onChange={handlechange}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   required
//                 />
//                 <div
//                   onClick={handleTogglePassword}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <div>
//                 <button
//                   type="submit"
//                   className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//                 >
//                   Add admin
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//         {/* </div> */}
//       </div>
//     </div>
//   );
// };

// export default Addadmin;

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import Allapi from "../common";
import { toast } from "react-toastify";

const Addadmin = ({ onclose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [admindet, setadmindet] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  function handlechange(e) {
    const { name, value } = e.target;
    setadmindet((prevstate) => {
      return {
        ...prevstate,
        [name]: value,
      };
    });
    console.log(admindet);
  }

  // Password validation function
  const validatePassword = (password) => {
    const uppercaseRegExp = /[A-Z]/;
    const lowercaseRegExp = /[a-z]/;
    const numberRegExp = /[0-9]/;
    const minLengthRegExp = /.{6,}/;

    if (!minLengthRegExp.test(password)) {
      return "Password must be at least 6 characters long.";
    }
    if (!uppercaseRegExp.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!lowercaseRegExp.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!numberRegExp.test(password)) {
      return "Password must contain at least one number.";
    }
    return null;
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const passwordError = validatePassword(admindet.password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (admindet.password !== admindet.confirmPassword) {
      toast.error("Password and Confirm Password should be the same.");
      return;
    }

    const admincall = await fetch(Allapi.admin.url, {
      method: Allapi.admin.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(admindet),
    });
    const adminres = await admincall.json();
    console.log("adminres is", adminres);

    if (adminres.success) {
      toast.success(adminres.message);
      onclose();
    }
    if (adminres.error) {
      toast.error(adminres.message);
    }
  }

  return (
    <div>
      <div className="add_admin absolute top-0 left-0 right-0 bottom-0 h-[100vh] w-full bg-slate-500 bg-opacity-35 flex justify-center items-center">
        <div className="flex items-center justify-center w-[50%] h-[80%] ">
          <div className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <div className="absolute right-1 top-2">
              <span>
                <IoCloseSharp
                  className="text-2xl bg-red-500 rounded-full text-white p-1 font-bold cursor-pointer"
                  onClick={onclose}
                />
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-center">
              Admin Signup
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-md font-bold text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={admindet.username}
                  onChange={handlechange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div className="text-slate-800 text-sm">
                <p>
                  <span className="text-slate-900 font-semibold">
                    Instructions
                  </span>
                  <br />
                  1.Password must be at least 6 characters long.
                  <br />
                  2.Password must contain at least one uppercase letter.
                  <br />
                  3.Password must contain at least one lowercase letter.
                  <br />
                  4.Password must contain at least one digit.
                  <br />
                </p>
              </div>
              <div className="relative">
                <label className="block text-md  text-gray-700 font-bold">
                  Password
                </label>

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={admindet.password}
                  onChange={handlechange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
                <div
                  onClick={handleTogglePassword}
                  className="absolute inset-y-0 right-1 top-4 pr-3 flex items-center cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              <div className="relative">
                <label className="block text-md font-bold text-gray-700">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={admindet.confirmPassword}
                  onChange={handlechange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
                <div
                  onClick={handleTogglePassword}
                  className="absolute inset-y-0 right-1 top-4 pr-3 flex items-center cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Add admin
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addadmin;
