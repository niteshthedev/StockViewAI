import React from "react";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const ServicesData = [
  {
    id: 1,
    title: (
      <>
        <span className="font-bold">Realtime</span>
        <span className="text-secondary font-bold"> Market Updates</span>
      </>
    ),
    icon: (
      <DotLottieReact
        src="https://lottie.host/4fa6dea1-00ae-4270-92bb-707e0dca85f7/y1RKT1FFCn.lottie"
        loop
        autoplay
        className="w-32 h-32"
      />
    ),
    delay: 0.2,
  },
  {
    id: 2,
    title: (
      <>
        <span className="font-bold">Customized</span>
        <span className="text-secondary font-bold"> Stock Price Alert</span>
      </>
    ),
    icon: (
      <DotLottieReact
        src="https://lottie.host/b232939e-b958-4a19-9f25-ce2e12d33923/YNndLv3k0B.lottie"
        loop
        autoplay
        className="w-32 h-32"
      />
    ),
    delay: 0.3,
  },
  {
    id: 3,
    title: (
      <>
        <span className="font-bold">Stock</span>
        <span className="text-secondary font-extrabold">ViewAI</span>-driven
        market foresight
      </>
    ),
    icon: (
      <DotLottieReact
        src="https://lottie.host/f2bda5a4-fc8e-4d6c-bd1f-ccca217d2660/j1B7QqZJIN.lottie"
        loop
        autoplay
        className="w-32 h-32"
      />
    ),
    delay: 0.4,
  },
  {
    id: 4,
    title: (
      <>
        <span className="font-bold">24/7</span>
        <span className="text-secondary font-bold"> Support</span>
      </>
    ),
    icon: (
      <DotLottieReact
        src="https://lottie.host/0d8206df-73ad-46b7-b90e-ccd96f032125/fb6WijLU4O.lottie"
        loop
        autoplay
        className="w-40 h-32"
      />
    ),
    delay: 0.5,
  },
];

const SlideLeft = (delay) => ({
  initial: { opacity: 0, x: 50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay, ease: "easeInOut" },
  },
});

const Services = () => {
  return (
    <section id="services" className="bg-white">
      <div className="container pb-14 pt-16">
        <h2 className="text-4xl font-bold text-left pb-10">
          Services we provide
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 p-6">
          {ServicesData.map((service) => (
            <motion.div
              key={service.id}
              variants={SlideLeft(service.delay)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="bg-[#f4f4f4] rounded-2xl flex flex-col gap-4 items-center justify-center p-4 py-7 hover:bg-white hover:scale-110 duration-300 hover:shadow-2xl"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-lg font-semibold text-center px-3">
                {service.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
