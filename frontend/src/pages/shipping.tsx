
import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingInfo, resetCart } from "../redux/reducer/cartReducer";
import { RootState, server } from "../redux/store";
import { useNewOrderMutation } from "../redux/api/orderAPI";
import { NewOrderRequest } from "../types/api-types";
import { responseToast } from "../utils/features";

const Shipping = () => {
  const { cartItems, total, subtotal, tax, discount, shippingCharges } = useSelector(
    (state: RootState) => state.cartReducer
  );

  const { user } = useSelector((state: RootState) => state.userReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [newOrder] = useNewOrderMutation();

  const [shippingDetails, setShippingDetails] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const createOrder = async (isCOD: boolean) => {
    dispatch(saveShippingInfo(shippingDetails));
  
    try {
      setIsProcessing(true);
  
      // Order data to be saved in the backend after payment
      const orderData: NewOrderRequest = {
        shippingInfo: shippingDetails,
        orderItems: cartItems,
        subtotal,
        tax,
        discount,
        shippingCharges,
        total,
        user: user?._id!,
        isCOD, // Setting the isCOD flag based on button clicked
      };
     
      if (isCOD) {
        // Handle Cash on Delivery - directly create order without payment
        console.log(orderData)
        const res = await newOrder(orderData);
        // if (res.error) {
        //   console.error("Error creating order with COD:", res.error);
        //   toast.error("Failed to create order with Cash on Delivery.",res.error);
        //   return;
        // }
        dispatch(resetCart());
        responseToast(res, navigate, "/orders");
      } else {
        // Handle Online Payment
        const { data } = await axios.post(
          `${server}/api/v1/payment/create`,
          {
            amount: total,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        console.log(data);
        console.log(data.orderId);
  
        // Razorpay options for checkout
        const options = {
          key: "rzp_test_IRmBqsIvqK7xXK", // Replace with your Razorpay key ID
          amount: total * 100, // Amount should be in paise
          currency: "INR",
          name: "Junkiess",
          description: "Test Transaction",
          image: "/your_logo.png", // Replace with your company logo
          order_id: data.orderId, // Order ID created in backend
          handler: async function (response: any) {
            // This function is triggered when payment is successful
            console.log(response);
            toast.success("Payment Successful!");
  
            // After payment is successful, save the order in the backend
            const res = await newOrder(orderData);
            // if (res.error) {
            //   console.error("Error creating order after payment:", res.error);
            //   toast.error("Failed to create order after payment.");
            //   return;
            // }
            dispatch(resetCart());
            responseToast(res, navigate, "/orders");
          },
          prefill: {
            name: "Customer Name",
            email: "customer@example.com",
            contact: "9999999999",
          },
          notes: {
            address: shippingDetails.address,
          },
          theme: {
            color: "#000000", // Customize checkout screen theme color
          },
        };
  
        // Open Razorpay checkout
        const razorpayInstance = new (window as any).Razorpay(options);
        console.log(razorpayInstance);
        razorpayInstance.open();
      }
  
    } catch (error) {
      console.error("Error during order creation:", error);
      toast.error("Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

 

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createOrder(false); // False indicates online payment
  };

  const handleCOD = () => {
    createOrder(true); // True indicates COD
  };

  useEffect(() => {
    if (cartItems.length <= 0) return navigate("/orders");
  }, [cartItems]);

  return (
    <div className="shipping">
      <button className="back-btn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>

      <form onSubmit={submitHandler}>
        <h1>Shipping Address</h1>

        <input
          required
          type="text"
          placeholder="Address"
          name="address"
          value={shippingDetails.address}
          onChange={changeHandler}
        />

        <input
          required
          type="text"
          placeholder="City and State"
          name="city"
          value={shippingDetails.city}
          onChange={changeHandler}
        />

        <input
          required
          type="text"
          placeholder="Mobile Number"
          name="state"
          value={shippingDetails.state}
          onChange={changeHandler}
        />

        <select
          name="country"
          required
          value={shippingDetails.country}
          onChange={changeHandler}
        >
          <option value="">Choose Country</option>
          <option value="india">India</option>
        </select>

        <input
          required
          type="number"
          placeholder="Pin Code"
          name="pinCode"
          value={shippingDetails.pinCode}
          onChange={changeHandler}
        />

        {/* Pay Now Button for Online Payment */}
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>

        {/* Cash on Delivery Button */}
        <button type="button" disabled={isProcessing} onClick={handleCOD}>
          {isProcessing ? "Processing..." : "Cash on Delivery"}
        </button>
      </form>
    </div>
  );
};

export default Shipping;
