import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FeaturedProducts, {
  FeaturedProductsSkeleton,
} from "./components/FeaturedProducts";
import background from "@/public/assests/Background.png";
import springs from "@/public/assests/springs.png";
import tea from "@/public/assests/tea.png";
import food from "@/public/assests/food.png";
import juno from "@/public/assests/juno.png";
import farms from "@/public/assests/farms.png";
import chocolates from "@/public/assests/chocolates.png";
import { MoveRight } from "lucide-react";
import value from "@/public/assests/value.png";

const categoryItems = [
  { title: "Secret Springs", image: springs, alt: "Secret Springs" },
  { title: "Akwaaba Foods", image: food, alt: "Golden Oils" },
  { title: "Juno Shea", image: juno, alt: "Herbal Roots" },
  { title: "Akwaaba Farms", image: farms, alt: "Daily Harvest" },
  { title: "Bliss Tea, Cofee & Cocoa", image: tea, alt: "Crafted Spices" },
  { title: "Bliss Chocolates", image: chocolates, alt: "Crafted Spices" },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-between bg-(--dark) text-(--white) px-6 sm:px-12 lg:px-20 py-12 gap-10">
        <div className="w-full lg:w-auto text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Welcome to Akwaaba <br /> Africa's Marketplace.
          </h1>
          <p className="text-base sm:text-lg mb-8 text-(--gray-text)">
            Thousands of vendors. Millions of products. <br />
            One trusted platform for shoppers and sellers across the continent.
          </p>
          <Link
            href="/shop"
            className="bg-(--primary) text-white py-2 px-4 rounded-lg transition duration-300"
          >
            Shop Now
          </Link>
          <div className="mt-10">
            <ul className="flex justify-center lg:justify-start space-x-10 text-center">
              <li className="font-bold text-xl sm:text-2xl flex flex-col">
                12,400+{" "}
                <span className="font-normal text-base text-(--gray-text)">
                  Vendors
                </span>
              </li>
              <li className="font-bold text-xl sm:text-2xl flex flex-col">
                1.2M{" "}
                <span className="font-normal text-base text-(--gray-text)">
                  Products
                </span>
              </li>
              <li className="font-bold text-xl sm:text-2xl flex flex-col">
                54{" "}
                <span className="font-normal text-base text-(--gray-text)">
                  Countries
                </span>
              </li>
            </ul>
          </div>
        </div>
        <Image
          src={background}
          alt="Marketplace"
          width={600}
          height={400}
          className="rounded-lg shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-xl hidden sm:block"
        />
      </main>
      <section className="px-6 sm:px-12 lg:px-20 text-(--dark) py-12 lg:py-20 w-full">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl lg:text-3xl">Shop by categories</h2>
          <p className="text-(--primary) flex items-center gap-2 text-sm sm:text-base">
            View All <MoveRight size={16} />
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 py-8">
          {categoryItems.map((category) => (
            <div
              key={category.title}
              className="border border-(--gray) rounded-md flex flex-col items-center p-6 text-center"
            >
              <div className="h-14 w-14 p-2 rounded-full flex items-center justify-center">
                <Image
                  src={category.image}
                  alt={category.alt}
                  className="h-full w-full"
                />
              </div>
              <h4 className="mt-3 font-semibold text-sm">{category.title}</h4>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 sm:px-12 lg:px-20 text-(--dark) py-12 lg:py-20 w-full">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl lg:text-3xl">Featured Products</h2>
          <Link
            href="/shop"
            className="text-(--primary) flex items-center gap-2 text-sm sm:text-base"
          >
            See more <MoveRight size={16} />
          </Link>
        </div>
        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </section>
      <section className="bg-(--dark) px-6 sm:px-12 lg:px-20 py-12 lg:py-20 flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-20 my-10">
        <div className="text-white w-full lg:w-1/2">
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl my-3">
            Our Core Values
          </h2>
          <h3 className="font-bold text-xl lg:text-2xl">Quality Excellence</h3>
          <p className="mb-2 text-sm sm:text-base text-(--gray-text)">
            We believe that excellence must be intentional not accidental and
            that every product carrying the Akwaaba name must exceed
            expectations.
          </p>
          <h3 className="font-bold text-xl lg:text-2xl mb-3">Sustainability</h3>
          <p className="mb-2 text-sm sm:text-base text-(--gray-text)">
            We see sustainability not just as a responsibility but as a way of
            life. Our operations are grounded in eco-conscious practices that
            protect the environment
          </p>
          <h3 className="font-bold text-xl lg:text-2xl mb-3">
            Community Empowerment
          </h3>
          <p className="mb-2 text-sm sm:text-base text-(--gray-text)">
            Our success is deeply connected to the people who till the soil,
            harvest the crops, and craft our products
          </p>
          <h3 className="font-bold text-xl lg:text-2xl mb-3">
            Integrity & Transparency
          </h3>
          <p className="mb-2 text-sm sm:text-base text-(--gray-text)">
            We believe that trust is earned through honesty, consistency, and
            accountability values that are embedded in our products.
          </p>
          <h3 className="font-bold text-xl lg:text-2xl mb-3">
            Customer Commitment
          </h3>
          <p className="mb-2 text-sm sm:text-base text-(--gray-text)">
            Our customers are the heartbeat of our business. We strive to
            anticipate their needs, exceed their expectations, and build
            relationships based on reliability and satisfaction
          </p>
          <h3 className="font-bold text-xl lg:text-2xl mb-3">
            Innovation & Tradition
          </h3>
          <p className="mb-2 text-sm sm:text-base text-(--gray-text)">
            We honor the time tested recipes and agricultural wisdom passed down
            through generations while infusing them with innovation
          </p>
        </div>
        <Image
          src={value}
          alt="Our core values"
          className="w-full max-w-xs sm:max-w-sm lg:max-w-md"
        />
      </section>
      <Footer />
    </>
  );
}
