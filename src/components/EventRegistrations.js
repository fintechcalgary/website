"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiMail,
  FiCalendar,
  FiUser,
  FiMessageSquare,
} from "react-icons/fi";

export default function EventRegistrations({ eventId }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) throw new Error("Event not found");
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-8 shadow-xl mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{event?.title}</h1>
          <p className="text-gray-400 flex items-center">
            <FiCalendar className="mr-2" />
            {new Date(event?.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-lg shadow-xl">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <FiUser />
              Registrations ({event?.registrations?.length || 0})
            </h2>
          </div>

          <div className="divide-y divide-gray-700">
            {event?.registrations?.map((reg, index) => (
              <div
                key={index}
                className="p-6 hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium text-white">
                      {reg.name}
                    </h3>
                    <p className="text-gray-400 flex items-center gap-2">
                      <FiMail className="flex-shrink-0" />
                      {reg.userEmail}
                    </p>
                    {reg.comments && (
                      <div className="mt-3 text-gray-400">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <FiMessageSquare />
                          Comments
                        </div>
                        <p className="pl-6">{reg.comments}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {new Date(reg.registeredAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            ))}

            {event?.registrations?.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                No registrations yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}