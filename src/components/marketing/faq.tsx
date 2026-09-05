// src/components/marketing/faq.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";

const faqs = [
  {
    q: "Can BrandPilot post to WhatsApp?",
    a: "It can schedule WhatsApp broadcast messages to your saved contacts using approved message templates. WhatsApp doesn't have a public feed, so it isn't a 'post' the way Instagram or X are.",
  },
  {
    q: "Do I need my own OpenAI account?",
    a: "No — generation runs through BrandPilot's own API integration. You just connect your website and channels.",
  },
  {
    q: "Can I edit AI-generated content before it's scheduled?",
    a: "Yes. Every generation lands in your content library first — you can edit, save, or discard before scheduling it anywhere.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="border-t border-border/50 bg-secondary/30 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            <HelpCircle className="h-3 w-3" />
            Got questions?
          </div>
          <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
            Frequently asked <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">questions</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Everything you need to know about BrandPilot.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 space-y-3"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`flex w-full items-start justify-between gap-4 rounded-2xl border border-border/50 bg-background p-6 text-left transition-all duration-300 hover:border-foreground/20 hover:shadow-md ${
                  openIndex === index ? "border-foreground/20 shadow-md" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 hidden sm:block">
                      <MessageCircle className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                    </div>
                    <span className="text-base font-medium text-foreground">
                      {faq.q}
                    </span>
                  </div>
                  <AnimatePresence mode="wait">
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                    openIndex === index
                      ? "bg-foreground/10"
                      : "bg-secondary/50 group-hover:bg-secondary"
                  }`}
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-colors ${
                      openIndex === index
                        ? "text-foreground"
                        : "text-muted-foreground/60 group-hover:text-foreground"
                    }`}
                  />
                </motion.div>
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="rounded-2xl border border-border/50 bg-background p-8">
            <h3 className="text-base font-medium">Still have questions?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Can't find what you're looking for? Reach out to our team.
            </p>
            <a
              href="mailto:hello@brandpilot.com"
              className="group mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-all hover:bg-foreground/90 hover:shadow-lg"
            >
              Contact us
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </motion.div>

        {/* Footer decorative element */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-border" />
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground/40">
              We're here to help
            </span>
            <span className="h-px w-8 bg-border" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}