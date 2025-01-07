"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiX,
  FiImage,
  FiUser,
} from "react-icons/fi";
import Modal from "./Modal";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Events() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    imageUrl: "",
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    eventId: null,
  });
  const [showRegistrations, setShowRegistrations] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await fetch("/api/events");
    const data = await response.json();
    setEvents(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingEvent
      ? `/api/events/${editingEvent._id}`
      : "/api/events";

    // Include existing registrations when editing
    const body = editingEvent
      ? { ...formData, registrations: editingEvent.registrations }
      : formData;

    const response = await fetch(url, {
      method: editingEvent ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        imageUrl: "",
      });
      setShowForm(false);
      setEditingEvent(null);
      fetchEvents();
    }
  };

  const handleDelete = async (eventId) => {
    setDeleteModal({
      isOpen: true,
      eventId,
    });
  };

  const confirmDelete = async () => {
    const response = await fetch(`/api/events/${deleteModal.eventId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchEvents();
      setDeleteModal({ isOpen: false, eventId: null });
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0], // Keep existing date handling
      time: event.time || "", // Populate the time field
      imageUrl: event.imageUrl || "",
      registrations: event.registrations?.length || 0,
    });
    setShowForm(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
      });

      if (response.ok) {
        fetchEvents(); // Refresh the events list
      } else {
        const data = await response.json();
        alert(data.error || "Failed to register");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to register for event");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      imageUrl: "",
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-[500px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FiCalendar className="text-primary" />
          Your Events
        </h3>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? <FiX /> : <FiPlus />}
          {showForm ? "Cancel" : "Add Event"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-2xl z-[9999]"
              onClick={resetForm}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-2xl mx-auto bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-gray-700/50 shadow-xl overflow-y-auto max-h-[85vh]">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl font-semibold text-white">
                    {editingEvent ? "Edit Event" : "Create Event"}
                  </h2>

                  <div className="flex items-start space-x-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex-shrink-0 pt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-200">
                        <span className="font-medium">Important:</span> Please
                        use high-resolution images for the best display quality.
                        When specifying time, ensure to include{" "}
                        <span className="font-medium">AM / PM</span> for
                        clarity.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Event Title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="form-input"
                      required
                    />

                    <textarea
                      placeholder="Event Description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="form-input min-h-[80px]"
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="form-input"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Event Time"
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="imageUpload"
                        required={!formData.imageUrl}
                      />
                      <label
                        htmlFor="imageUpload"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer bg-gray-900/50 hover:bg-gray-700 text-white border border-gray-700"
                      >
                        <FiImage />
                        {uploading ? "Uploading..." : "Choose Image"}
                      </label>
                      {formData.imageUrl && (
                        <div className="relative w-16 h-16">
                          <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg border border-gray-700"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, imageUrl: "" }))
                            }
                            className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                          >
                            <FiX size={10} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                      disabled={uploading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg"
                    >
                      {editingEvent ? <FiEdit2 /> : <FiPlus />}
                      {uploading
                        ? "Please wait..."
                        : editingEvent
                        ? "Update Event"
                        : "Add Event"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-gray-800/50 rounded-lg overflow-hidden"
          >
            <div className="aspect-video w-full">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-semibold text-foreground">
                  {event.title}
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="text-gray-400 hover:text-primary transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <p className="text-gray-400 mb-4 line-clamp-3">
                {event.description}
              </p>
              <div className="text-sm text-gray-500">
                {new Date(event.date + "T00:00:00").toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
                {event.time && ` at ${event.time}`}{" "}
                {/* Display time if available */}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">
                      {event.registrations?.length || 0} registered
                    </p>
                  </div>
                  {!isDashboard && (
                    <Link
                      href={`/events/register/${event._id}`}
                      className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Register for Event
                    </Link>
                  )}
                </div>
                {isDashboard && event.registrations?.length > 0 && (
                  <div className="mt-3">
                    <Link
                      href={`/events/${event._id}/registrations`}
                      className="text-sm text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-2"
                    >
                      <FiUser className="w-4 h-4" />
                      View {event.registrations.length} Registration
                      {event.registrations.length !== 1 ? "s" : ""}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && !showForm && (
        <div className="text-center py-12 bg-gray-800/50 rounded-lg min-h-[400px] flex flex-col items-center justify-center">
          <FiCalendar className="mx-auto text-4xl text-primary mb-4" />
          <p className="text-gray-400">
            No events yet. Create your first event!
          </p>
        </div>
      )}

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, eventId: null })}
        onConfirm={confirmDelete}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete Event"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
