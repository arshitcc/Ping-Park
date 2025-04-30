"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {

  const router = useRouter();

  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 gap-8 lg:md:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Connect Instantly with</span>
            <span className="block text-emerald-500">Ping-Park Chat</span>
          </h1>
          <p className="mt-6 max-w-lg text-xl text-gray-600">
            The modern chat platform designed for teams and friends. Seamless
            communication, powerful features, and beautiful design.
          </p>
        </motion.div>
        <motion.div>
          <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
              onClick={() => router.push('/account/auth?tab=signup')}
            >
              Get Started for Free
            </Button>
            <Button size="lg" variant="outline">
              See How It Works
            </Button>
          </div>
          <div className="mt-8 flex items-center">
            <div className="flex -space-x-2">
              {[
                "https://res.cloudinary.com/arshitcc/image/upload/v1744752700/ping-park/iowekip5aoysgrvd53n2.jpg",
                "https://gravatar.com/avatar/b82976a4a4c041837e2bc41d635ae49a?s=400&d=robohash&r=x",
                "https://gravatar.com/avatar/0841d12c853448bddb15fcc641434b6f?s=400&d=robohash&r=x",
                "https://gravatar.com/avatar/264d2aa3935065f2a20bb5d45564180b?s=400&d=robohash&r=x",
              ].map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="inline-block h-8 w-8 rounded-full border-2 border-white bg-gray-200"
                />
              ))}
            </div>
            <p className="ml-4 text-sm text-gray-600">
              Join over <span className="font-medium">10,000+</span> users
              already using Ping-Park
            </p>
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
