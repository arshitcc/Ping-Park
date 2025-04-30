"use client"

import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How secure is Ping-Park?",
    answer:
      "Ping-Park uses end-to-end encryption for all messages and files. Your data is encrypted on your device before it's sent, and only the intended recipients can decrypt it. We also employ industry-standard security practices and regular security audits.",
  },
  {
    question: "Can I use Ping-Park on multiple devices?",
    answer:
      "Yes! Ping-Park is available on all major platforms including iOS, Android, Windows, macOS, and web browsers. Your conversations will sync seamlessly across all your devices.",
  },
  {
    question: "Is there a limit to how many people can be in a group chat?",
    answer:
      "Our Free plan supports up to 20 people in a group chat. The Pro plan increases this to 100 people, and Enterprise plans have unlimited group sizes.",
  },
  {
    question: "Can I integrate Ping-Park with other tools?",
    answer:
      "Yes, Ping-Park offers integrations with popular tools like Slack, Google Workspace, Microsoft Teams, Jira, and more. Custom integrations are available on Pro and Enterprise plans.",
  },
  {
    question: "What happens to my data if I cancel my subscription?",
    answer:
      "You'll have 30 days to export your data after cancellation. After that period, your data will be permanently deleted from our servers in accordance with our privacy policy.",
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 sm:text-4xl"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Find answers to common questions about Ping-Park
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b-1 rounded-none border-gray-300">
                <AccordionTrigger className="text-left text-black font-semibold">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-black">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
