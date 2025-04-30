"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CTA() {
  const router = useRouter();

  return (
    <section className="py-20 bg-emerald-50">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-16 sm:p-16"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your communication?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-emerald-50">
              Join thousands of teams and individuals who have already made the
              switch to Ping-Park. Start for free today!
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button
                size="lg"
                className="bg-white text-emerald-600 hover:bg-emerald-50"
                onClick={() => router.push("/account/auth?tab=signup")}
              >
                Get Started for Free
              </Button>
              <Button size="lg" variant="link" className="text-white">
                Contact Sales
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
