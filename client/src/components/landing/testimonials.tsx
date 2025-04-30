"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "TechCorp",
    content:
      "Ping-Park has transformed how our team communicates. The interface is intuitive and the features are exactly what we needed.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Software Developer",
    company: "DevStudio",
    content:
      "As a developer, I appreciate the attention to detail and performance. The API is also excellent for our custom integrations.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "CreativeAgency",
    content:
      "We've tried many chat platforms, but Ping-Park stands out with its beautiful design and reliability. Our team loves it!",
    rating: 4,
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 sm:text-4xl"
          >
            What Our Users Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Join thousands of satisfied users who love Ping-Park
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-zinc-100">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mb-6 text-gray-700">{testimonial.content}</p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-emerald-600 font-medium">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">{testimonial.name}</h4>
                      <p className="text-xs text-gray-500">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
