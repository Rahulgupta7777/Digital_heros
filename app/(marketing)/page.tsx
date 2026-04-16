'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Target, Trophy, Heart } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function LandingPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-warm-gradient overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-40" />

        <div className="relative flex items-center justify-between px-6 py-20 md:py-32">
          <motion.div
            className="flex-1 max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="mb-6 inline-block rounded-full bg-white/50 px-4 py-2 text-sm font-medium text-warm-deep backdrop-blur"
            >
              A new way to play
            </motion.div>

            <motion.h1 variants={itemVariants} className="mb-6 text-5xl font-display font-bold text-warm-deep leading-tight md:text-7xl">
              Play the game. <span className="italic text-warm-coral">Change a life.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mb-8 text-lg text-warm-deep/70 max-w-lg"
            >
              Subscribe to monthly prize draws, track your scores, and watch 10% minimum go to the charities you care about.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-4 font-medium rounded-full bg-warm-coral text-white hover:bg-[#FF5555] transition-all shadow-soft hover:shadow-soft-lg"
              >
                Start playing — start giving
              </Link>
              <Link
                href="/charities"
                className="inline-flex items-center justify-center px-8 py-4 font-medium rounded-full border-2 border-warm-deep text-warm-deep hover:bg-warm-deep hover:text-white transition-all"
              >
                Browse charities
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12 flex gap-8 flex-col sm:flex-row">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warm-coral/20">
                  <span className="text-sm font-bold text-warm-coral">10%</span>
                </div>
                <span className="text-sm text-warm-deep/70">Minimum to charity</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warm-sage/20">
                  <span className="text-sm font-bold text-warm-sage">$</span>
                </div>
                <span className="text-sm text-warm-deep/70">Monthly draws</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating cards */}
          <motion.div
            className="hidden lg:flex flex-col gap-4 flex-1 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="rounded-3xl bg-white/80 backdrop-blur p-6 shadow-soft-lg w-80"
            >
              <p className="text-sm text-warm-deep/60">This month&apos;s jackpot</p>
              <p className="mt-2 text-4xl font-display font-bold text-warm-coral">$24,580</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="rounded-3xl bg-white/80 backdrop-blur p-6 shadow-soft-lg w-80"
            >
              <p className="text-sm text-warm-deep/60">Total raised for charity</p>
              <p className="mt-2 text-4xl font-display font-bold text-warm-sage">$108,440</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="rounded-3xl bg-warm-deep p-6 shadow-soft-lg w-80"
            >
              <p className="text-sm text-white/70">Last month&apos;s winner</p>
              <p className="mt-2 text-2xl font-display font-bold text-white">Marcus T.</p>
              <p className="mt-1 text-sm text-white/60">Won $18,200 • Gave to Ocean Conservancy</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="px-6 py-20 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-display font-bold text-warm-deep md:text-5xl mb-4">
              How it works
            </h2>
            <p className="text-lg text-warm-deep/60">
              Four simple steps to play, win, and give
            </p>
          </motion.div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                num: '01',
                icon: Target,
                title: 'Subscribe',
                desc: 'Choose monthly or yearly. Pick a charity to support.',
              },
              {
                num: '02',
                icon: Sparkles,
                title: 'Enter scores',
                desc: 'Log your last 5 rounds. That&apos;s your draw entry.',
              },
              {
                num: '03',
                icon: Trophy,
                title: 'Match to win',
                desc: 'Win if your scores match the monthly draw numbers.',
              },
              {
                num: '04',
                icon: Heart,
                title: 'Give back',
                desc: '10% minimum of every sub goes to your chosen cause.',
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="rounded-3xl bg-warm-cream p-8 hover:shadow-soft-lg transition-shadow"
              >
                <p className="text-4xl font-display font-bold text-warm-coral mb-4">{step.num}</p>
                <step.icon className="h-8 w-8 text-warm-sage mb-4" />
                <h3 className="mb-2 font-display font-bold text-warm-deep">{step.title}</h3>
                <p className="text-sm text-warm-deep/60">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="bg-warm-deep bg-grain px-6 py-20 md:py-32 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-display font-bold mb-6 md:text-5xl">
                Real impact.
              </h2>
              <p className="mb-6 text-lg text-white/70">
                Every subscription counts. Every score entered. Every draw won. It all adds up to meaningful support for the causes you believe in.
              </p>
              <Link
                href="/charities"
                className="inline-flex items-center justify-center px-8 py-3 font-medium rounded-full bg-warm-coral text-white hover:bg-[#FF5555] transition-all"
              >
                See all charities
              </Link>
            </motion.div>

            <motion.div
              className="grid gap-6 md:grid-cols-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                { label: 'Active players', value: '2,840' },
                { label: 'Charities supported', value: '47' },
                { label: 'Total prizes paid', value: '$184K' },
                { label: 'Avg monthly impact', value: '$12K' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="rounded-3xl bg-white/5 backdrop-blur p-6 border border-white/10"
                >
                  <p className="text-sm text-white/60 mb-2">{stat.label}</p>
                  <p className="text-3xl font-display font-bold text-white">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-warm-gradient px-6 py-20 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-display font-bold text-warm-deep mb-6 md:text-5xl"
          >
            Ready to play with purpose?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 text-lg text-warm-deep/60"
          >
            Join thousands of players who are making a difference every month.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 font-medium rounded-full bg-warm-coral text-white hover:bg-[#FF5555] transition-all shadow-soft hover:shadow-soft-lg text-lg"
            >
              Get started today
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
