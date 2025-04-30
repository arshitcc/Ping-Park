"use client"

import { motion } from "framer-motion"
import { UserPlus, MessageCircle, Settings } from "lucide-react"

const steps = [
  {
    icon: <UserPlus className="h-8 w-8 text-white" />,
    title: "Create an Account",
    description: "Sign up in seconds with your email or social media accounts.",
    color: "bg-emerald-500",
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-white" />,
    title: "Start Chatting",
    description: "Invite friends or colleagues and start messaging right away.",
    color: "bg-teal-500",
  },
  {
    icon: <Settings className="h-8 w-8 text-white" />,
    title: "Customize Your Experience",
    description: "Personalize your chat settings, notifications, and appearance.",
    color: "bg-cyan-500",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 sm:text-4xl"
          >
            How Ping-Park Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Get started with Ping-Park in just a few simple steps
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full ${step.color}`}>
                {step.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
                  <div className="h-1 w-8 bg-gray-200"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
