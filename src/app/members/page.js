"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import PublicNavbar from "@/components/PublicNavbar";
import Footer from "@/components/landing/Footer";
import * as THREE from "three";
import { SiLinkedin } from "react-icons/si";
import { FiMail } from "react-icons/fi";

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [groupedMembers, setGroupedMembers] = useState({});
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesConfig = {
    particles: {
      number: { value: 50, density: { enable: true, value_area: 1200 } },
      color: { value: "#8b5cf6" },
      opacity: { value: 0.8 },
      size: { value: 2 },
      move: { enable: true, speed: 0.8, random: true, out_mode: "out" },
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: true, mode: "grab" } },
    },
    retina_detect: true,
  };

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      import("vanta/dist/vanta.globe.min").then((GLOBE) => {
        setVantaEffect(
          GLOBE.default({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0x6d28d9,
            backgroundColor: 0x1e1b2e,
          })
        );
      });
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/members");
      const data = await response.json();

      const grouped = data.reduce((acc, member) => {
        if (!acc[member.position]) acc[member.position] = [];
        acc[member.position].push(member);
        return acc;
      }, {});

      setMembers(data);
      setGroupedMembers(grouped);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  if (members.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-gray-900">
      {/* Navbar */}
      <PublicNavbar />

      {/* Particles + Vanta background */}
      <div className="relative flex-grow">
        <Particles
          className="absolute inset-0 z-0"
          init={particlesInit}
          options={particlesConfig}
        />
        <motion.section
          ref={vantaRef}
          className="relative z-10 flex items-center justify-center min-h-screen"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80 z-0"></div>

          {/* Content Section */}
          <div className="relative z-10 container mx-auto px-6 py-24 sm:px-8 lg:px-12">
            {/* Page Heading */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-6xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-primary mb-6">
                Meet Our Team
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our dedicated team of professionals is here to make a
                difference.
              </p>
            </motion.div>

            {/* Members Grid */}
            <div className="space-y-16">
              {Object.keys(groupedMembers).map((role, index) => (
                <motion.section
                  key={role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-8"
                >
                  {/* Role Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                    <h2 className="text-3xl font-bold text-white px-4">
                      {role}
                    </h2>
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                  </div>

                  {/* Members List */}
                  <div className="flex flex-wrap gap-8 justify-center">
                    {groupedMembers[role].map((member) => (
                      <motion.div
                        key={member._id}
                        whileHover={{ scale: 1.02 }}
                        className="flex flex-col items-center text-center gap-4 w-full max-w-[300px]"
                      >
                        <div
                          className="w-48 h-48 rounded-full overflow-hidden border-2 border-primary/50 
                          group-hover:border-primary transition-colors duration-300 shadow-lg"
                        >
                          <img
                            src={member.imageUrl || "/placeholder.png"}
                            alt={`${member.name}'s profile`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-white hover:text-primary transition-colors">
                            {member.name}
                          </h3>
                          <p className="text-base text-gray-300">
                            {member.major}
                          </p>
                          <div className="flex items-center justify-center gap-3">
                            <a
                              href={`mailto:${member.email}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-gray-400 hover:text-primary transition-colors"
                            >
                              <FiMail className="w-5 h-5" />
                            </a>
                            {member.linkedinUrl && (
                              <a
                                href={member.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-[#0077b5] transition-colors"
                              >
                                <SiLinkedin className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                          {member.description && (
                            <p className="text-sm text-gray-400 mt-2">
                              {member.description}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              ))}
            </div>
          </div>
        </motion.section>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}