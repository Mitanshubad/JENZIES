// import { FormEvent, useEffect, useState } from "react";
// import axios from "axios"; // Import axios for API calls
// import AdminSidebar from "../../../components/admin/AdminSidebar";
// import { RootState, server } from "../../../redux/store";
// const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
// const allNumbers = "1234567890";
// const allSymbols = "!@#$%^&*()_+";

// const Coupon = () => {
//   const [size, setSize] = useState<number>(8);
//   const [prefix, setPrefix] = useState<string>("");
//   const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
//   const [includeCharacters, setIncludeCharacters] = useState<boolean>(false);

//   const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
//   const [isCopied, setIsCopied] = useState<boolean>(false);
//   const [coupon, setCoupon] = useState<string>("");
//   const [allCoupons, setAllCoupons] = useState<any[]>([]); // State to store all coupons

//   // Function to copy coupon to clipboard
//   const copyText = async (coupon: string) => {
//     await window.navigator.clipboard.writeText(coupon);
//     setIsCopied(true);
//   };

//   // Function to handle form submission and generate coupon code
//   const submitHandler = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!includeNumbers && !includeCharacters && !includeSymbols)
//       return alert("Please Select One At Least");

//     let result: string = prefix || "";
//     const loopLength: number = size - result.length;

//     for (let i = 0; i < loopLength; i++) {
//       let entireString: string = "";
//       if (includeCharacters) entireString += allLetters;
//       if (includeNumbers) entireString += allNumbers;
//       if (includeSymbols) entireString += allSymbols;

//       const randomNum: number = ~~(Math.random() * entireString.length);
//       result += entireString[randomNum];
//     }

//     setCoupon(result);
//   };

//   // Function to create a new coupon via API
//   const createCoupon = async () => {
//     if (!coupon) return alert("Generate a coupon code first!");

//     try {
//       const { data } = await axios.post(`${server}/api/v1/payment/coupon/new`, {
//         code: coupon,
//         amount: 10, // Example amount, adjust as needed
//       });

//       alert(data.message);
//       fetchCoupons(); // Refresh the list after creating a new coupon
//     } catch (error: any) {
//       console.error(error);
//       alert("Failed to create coupon: " + error.response?.data.message);
//     }
//   };

//   // Function to fetch all coupons from the backend
//   const fetchCoupons = async () => {
//     try {
//       const { data } = await axios.get(`${server}/api/v1/payment/coupon/all`);
//       setAllCoupons(data.coupons);
//     } catch (error: any) {
//       console.error(error);
//       alert("Failed to fetch coupons: " + error.response?.data.message);
//     }
//   };

//   // Function to apply a discount using a coupon code
//   const applyCoupon = async () => {
//     if (!coupon) return alert("Enter a coupon code first!");

//     try {
//       const { data } = await axios.get(`${server}/api/v1/payment/discount?coupon=${coupon}`);
//       alert(`Coupon applied! You got a discount of ${data.discount}`);
//     } catch (error: any) {
//       console.error(error);
//       alert("Invalid coupon code or error applying coupon.");
//     }
//   };

//   useEffect(() => {
//     setIsCopied(false);
//     fetchCoupons(); // Fetch all coupons on component mount
//   }, [coupon]);

//   return (
//     <div className="admin-container">
//       <AdminSidebar />
//       <main className="dashboard-app-container">
//         <h1>Coupon</h1>
//         <section>
//           <form className="coupon-form" onSubmit={submitHandler}>
//             <input
//               type="text"
//               placeholder="Text to include"
//               value={prefix}
//               onChange={(e) => setPrefix(e.target.value)}
//               maxLength={size}
//             />

//             <input
//               type="number"
//               placeholder="Coupon Length"
//               value={size}
//               onChange={(e) => setSize(Number(e.target.value))}
//               min={8}
//               max={25}
//             />

//             <fieldset>
//               <legend>Include</legend>

//               <input
//                 type="checkbox"
//                 checked={includeNumbers}
//                 onChange={() => setIncludeNumbers((prev) => !prev)}
//               />
//               <span>Numbers</span>

//               <input
//                 type="checkbox"
//                 checked={includeCharacters}
//                 onChange={() => setIncludeCharacters((prev) => !prev)}
//               />
//               <span>Characters</span>

//               <input
//                 type="checkbox"
//                 checked={includeSymbols}
//                 onChange={() => setIncludeSymbols((prev) => !prev)}
//               />
//               <span>Symbols</span>
//             </fieldset>
//             <button type="submit">Generate</button>
//           </form>

//           {coupon && (
//             <div>
//               <code>
//                 {coupon}{" "}
//                 <span onClick={() => copyText(coupon)}>
//                   {isCopied ? "Copied" : "Copy"}
//                 </span>{" "}
//               </code>
//               <button onClick={createCoupon}>Create Coupon</button>
//               <button onClick={applyCoupon}>Apply Coupon</button>
//             </div>
//           )}
//         </section>

//         {/* Display all coupons */}
//         <section>
//           <h2>All Coupons</h2>
//           <ul>
//             {allCoupons.map((coupon) => (
//               <li key={coupon._id}>{coupon.code} - {coupon.amount}</li>
//             ))}
//           </ul>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Coupon;
