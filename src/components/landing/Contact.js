import { motion } from "framer-motion";
import {
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiArrowRight,
} from "react-icons/fi";
import Link from "next/link";

export default function Contact() {
  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute inset-0 opacity-5 bg-[url('/grid.svg')] bg-center"></div>
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-6xl font-bold mb-20 text-center group cursor-pointer relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Link
            href="/contact"
            className="flex items-center justify-center gap-4 hover:gap-6 transition-all duration-300"
          >
            <div className="relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-primary">
                Contact Us
              </span>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-purple-400 rounded-full"></div>
            </div>
            <FiArrowRight className="transition-all duration-300 text-primary text-4xl" />
          </Link>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <motion.div
            className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl p-10 rounded-2xl border border-gray-700/50 hover:border-primary/50 transition-all duration-500"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex flex-col items-center text-center relative">
              <div className="w-20 h-20 mb-8 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FiMail className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Email</h3>
              <a
                href="mailto:info@fintechcalgary.com"
                className="text-lg text-gray-300 hover:text-primary transition-colors duration-300"
              >
                info@fintechcalgary.com
              </a>
            </div>
          </motion.div>

          <motion.div
            className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl p-10 rounded-2xl border border-gray-700/50 hover:border-primary/50 transition-all duration-500"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex flex-col items-center text-center relative">
              <div className="w-20 h-20 mb-8 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FiMapPin className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Location</h3>
              <div className="text-lg text-gray-300 space-y-2">
                <p>University of Calgary</p>
                <p>2500 University Dr NW</p>
                <p>Calgary, AB T2N 1N4</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl p-10 rounded-2xl border border-gray-700/50 hover:border-primary/50 transition-all duration-500"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex flex-col items-center text-center relative">
              <div className="w-20 h-20 mb-8 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FiMessageSquare className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Social Media
              </h3>
              <p className="text-lg text-gray-300">
                Follow us for the latest updates
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
