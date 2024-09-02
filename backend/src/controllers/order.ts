import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { NewOrderRequestBody } from "../types/types.js";
import { reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";

// Get orders for a specific user
export const myOrders = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  const { id: user } = req.query;

  const key = `my-orders-${user}`;
  let orders;

  // Fetch from cache (if implemented)
  // orders = await redis.get(key);

  if (orders) {
    orders = JSON.parse(orders);
  } else {
    orders = await Order.find({ user });
    // Cache the result (if implemented)
    // await redis.setex(key, redisTTL, JSON.stringify(orders));
  }

  return res.status(200).json({
    success: true,
    orders,
  });
});

// Get all orders
export const allOrders = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  const key = `all-orders`;
  let orders;

  // Fetch from cache (if implemented)
  // orders = await redis.get(key);

  if (orders) {
    orders = JSON.parse(orders);
  } else {
    orders = await Order.find().populate("user", "name");
    // Cache the result (if implemented)
    // await redis.setex(key, redisTTL, JSON.stringify(orders));
  }

  return res.status(200).json({
    success: true,
    orders,
  });
});

// Get a single order
export const getSingleOrder = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const key = `order-${id}`;

  let order;
  // Fetch from cache (if implemented)
  // order = await redis.get(key);

  if (order) {
    order = JSON.parse(order);
  } else {
    order = await Order.findById(id).populate("user", "name");

    if (!order) return next(new ErrorHandler("Order Not Found", 404));

    // Cache the result (if implemented)
    // await redis.setex(key, redisTTL, JSON.stringify(order));
  }

  return res.status(200).json({
    success: true,
    order,
  });
});

// Create a new order
export const newOrder = TryCatch(async (req: Request<{}, {}, NewOrderRequestBody>, res: Response, next: NextFunction) => {
  const {
    shippingInfo,
    orderItems,
    user,
    subtotal,
    tax,
    shippingCharges,
    discount,
    total,
    isCOD, 
  } = req.body;
  console.log("Received order data:", req.body); // Log received data

console.log("hello i am eebkvkdfjv", 
  shippingInfo,
  orderItems,

  user,
  subtotal,
  tax,
  shippingCharges,
  discount,
  total,
  isCOD, )

  if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total)
    return next(new ErrorHandler("Please Enter All Fields", 400));

  try {
    // Create the order
    const order = await Order.create({
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
      isCOD, // Save the isCOD flag
    });
   
    // Reduce stock only if it's not COD
    if (!isCOD) {
      await reduceStock(orderItems);
    }

    // Invalidate cache (if implemented)
    // await invalidateCache({
    //   product: true,
    //   order: true,
    //   admin: true,
    //   userId: user,
    //   productId: order.orderItems.map((i) => String(i.productId)),
    // });
   console.log("printing order  ",order)
    return res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
    });
  } catch (error) {
    console.log("bbrkgkerj",error)
    return next(new ErrorHandler("Error creating order", 500));


  }
});

// Process an order (update its status)
export const processOrder = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) return next(new ErrorHandler("Order Not Found", 404));

  switch (order.status) {
    case "Processing":
      order.status = "Shipped";
      break;
    case "Shipped":
      order.status = "Delivered";
      break;
    default:
      order.status = "Delivered";
      break;
  }

  await order.save();

  // Invalidate cache (if implemented)
  // await invalidateCache({
  //   product: false,
  //   order: true,
  //   admin: true,
  //   userId: order.user,
  //   orderId: String(order._id),
  // });

  return res.status(200).json({
    success: true,
    message: "Order Processed Successfully",
  });
});

// Delete an order
export const deleteOrder = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) return next(new ErrorHandler("Order Not Found", 404));

  await order.deleteOne();

  // Invalidate cache (if implemented)
  // await invalidateCache({
  //   product: false,
  //   order: true,
  //   admin: true,
  //   userId: order.user,
  //   orderId: String(order._id),
  // });

  return res.status(200).json({
    success: true,
    message: "Order Deleted Successfully",
  });
});
