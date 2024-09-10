import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/loader";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import videoCover from "../assets/videos/cover.mp4";
import { FaAnglesDown, FaHeadset } from "react-icons/fa6";
import { motion } from "framer-motion";
import { Slider } from "6pp";
import { TbTruckDelivery } from "react-icons/tb";
import { LuShieldCheck } from "react-icons/lu";
import one from "../assets/images/one.jpg";
import two from "../assets/images/two.jpg";
import three from "../assets/images/three.jpg";
import four from "../assets/images/four.jpg";
import five from "../assets/images/five.jpg";
import { useState } from "react";

const banners = [`${two}`, `${one}`, `${five}`, `${three}`, `${four}`];
const categories = [
  "CARGO MEN",
  "SHIRT MEN",
  "CARGO WOMEN",
  "TOP",
  "JEANS MEN",
  "JEANS WOMEN",
];

const services = [
  {
    icon: <TbTruckDelivery />,
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery within 24 hours",
  },
  {
    icon: <LuShieldCheck />,
    title: "SECURE PAYMENT",
    description: "100% secure payment",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 SUPPORT",
    description: "Get support 24/7",
  },
];

const Home = () => {
  const { data, isError, isLoading } = useLatestProductsQuery("");
  const [categorie, setCategort] = useState(categories);
  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  if (isError) toast.error("Cannot Fetch the Products");

  const coverMessage =
    "Fashion isn't just clothes; it's a vibrant language.a conversation starter with every bold print. It's a way to tell our story, a confidence booster. From elegance to rebellion, fashion lets us navigate the world in style.".split(
      " "
    );

  const menhandler = () => {
    setCategort(["CARGO MEN", "SHIRT MEN", "CARGO WOMEN"]);
  };

  const womenhandler = () => {
    setCategort(["CARGO WOMEN", "TOP", "JEANS MEN", "JEANS WOMEN"]);
  };

  return (
    <>
      <div className="home">
        <section></section>
  <h1>Collections</h1>
        <div>
          <aside className=" flex flex-col items-center p-1 ">
          
            <div className="flex  text-black text-1xl m-3">
            <button className=" bg-slate-100 rounded-lg p-1 m-1 w-min " onClick={menhandler}>MEN</button>
            <button className=" bg-slate-100 rounded-lg p-1 m-1 w-min" onClick={womenhandler}>WOMEN</button>
            </div>
          
            <ul>
              {categorie.map((i) => (
                <li key={i}>
                  <Link
                    to={`/search?category=${i.toLowerCase()}`}
                    className="text-black "
                  >
                    {i}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
          <Slider
            autoplay
            autoplayDuration={1500}
            showNav={false}
            images={banners}
          />
        </div>
        <h1>
          New Launches
          <Link
            to="/search"
            className="findmore  bg-slate-100 rounded-lg p-1 m-1"
          >
            More
          </Link>
        </h1>

        <main>
          {isLoading ? (
            <>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{ height: "25rem" }}>
                  <Skeleton width="18.75rem" length={1} height="20rem" />
                  <Skeleton width="18.75rem" length={2} height="1.95rem" />
                </div>
              ))}
            </>
          ) : (
            data?.products.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={addToCartHandler}
                photos={i.photos}
              />
            ))
          )}
        </main>
      </div>

      <article className="cover-video-container">
        <div className="cover-video-overlay"></div>
        <video autoPlay loop muted src={videoCover} />
        <div className="cover-video-content">
          <motion.h2
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            JENZIES
          </motion.h2>
          {coverMessage.map((el, i) => (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.25,
                delay: i / 10,
              }}
              key={i}
            >
              {el}{" "}
            </motion.span>
          ))}
        </div>
        <motion.span
          animate={{
            y: [0, 10, 0],
            transition: {
              duration: 1,
              repeat: Infinity,
            },
          }}
        >
          <FaAnglesDown />
        </motion.span>
      </article>

      <hr
        style={{
          backgroundColor: "rgba(0,0,0,0.1)",
          border: "none",
          height: "1px",
        }}
      />

      <article className="our-services">
        <ul>
          {services.map((service, i) => (
            <motion.li
              initial={{ opacity: 0, y: -100 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: i / 20,
                },
              }}
              key={service.title}
            >
              <div>{service.icon}</div>
              <section>
                <h3>{service.title}Y</h3>
                <p>{service.description}</p>
              </section>
            </motion.li>
          ))}
        </ul>
      </article>
    </>
  );
};

export default Home;
