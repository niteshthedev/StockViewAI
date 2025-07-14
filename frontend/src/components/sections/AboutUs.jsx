import React from "react";
import BannerPng from "../../assets/banner.png";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="about-us">
      <div className="container py-14 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-8 space-y-6 md:space-y-0">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <div className="text-center md:text-left space-y-4 lg:max-w-[450px]">
            <h1 className="text-4xl font-bold !leading-snug">
              Join Our Community to Start your Journey
            </h1>
            <p className="text-dark2">
              <span className="font-bold">Welcome to StockView</span> – your
              go-to platform for seamless stock market insights and intelligent
              investing. We provide real-time access to Indian stocks and mutual
              funds, along with personalized buy/sell price alerts. Powered by
              **StockView AI**, our predictive analytics engine analyzes
              portfolios, market trends, and historical data to deliver accurate
              stock and mutual fund forecasts. Engage in our **community forum**
              to share strategies, explore **web stories** from experienced
              investors, and refine your portfolio. With **24/7 customer
              support**, we ensure you’re always informed and supported. Join
              StockView today and invest smarter with data-driven insights!
            </p>
            <a
              href="https://chat.whatsapp.com/randommm"
              className="primary-btn !mt-8"
            >
              Join Now
            </a>
          </div>
        </motion.div>

        <div className="flex justify-center items-center">
          <motion.img
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            src={BannerPng}
            alt=""
            className="w-[350px] md:max-w-[450px] object-cover drop-shadow"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
