"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Shield,
  Zap,
  Globe,
  Users,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: <MessageSquare className="h-6 w-6 text-emerald-500" />,
    title: "Real-time Messaging",
    description:
      "Send and receive messages instantly with our lightning-fast infrastructure.",
  },
  {
    icon: <Shield className="h-6 w-6 text-emerald-500" />,
    title: "End-to-End Encryption",
    description:
      "Your conversations are secure with our advanced encryption technology.",
  },
  {
    icon: <Users className="h-6 w-6 text-emerald-500" />,
    title: "Group Conversations",
    description:
      "Create group chats with unlimited members for team collaboration.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 sm:text-4xl"
          >
            Powerful Features for Modern Communication
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Everything you need to stay connected with your team and friends
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
