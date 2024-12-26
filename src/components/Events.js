import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FiCalendar, FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";

export default function Events() {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
  });

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
    const response = await fetch(url, {
      method: editingEvent ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setFormData({ title: "", description: "", date: "" });
      setShowForm(false);
      setEditingEvent(null);
      fetchEvents();
    }
  };

  const handleDelete = async (eventId) => {
    if (confirm("Are you sure you want to delete this event?")) {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchEvents();
      }
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0],
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FiCalendar className="text-green-500" />
          Your Events
        </h3>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingEvent(null);
            setFormData({ title: "", description: "", date: "" });
          }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          {showForm ? <FiX /> : <FiPlus />}
          {showForm ? "Cancel" : "Add Event"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/50 rounded-lg p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Event Title
            </label>
            <input
              type="text"
              placeholder="Enter event title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter event description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-green-500 min-h-[100px]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-green-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            {editingEvent ? "Update Event" : "Create Event"}
          </button>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-gray-800/50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-xl font-semibold text-foreground">
                {event.title}
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="text-gray-400 hover:text-green-500 transition-colors"
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
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && !showForm && (
        <div className="text-center py-12 bg-gray-800/50 rounded-lg">
          <FiCalendar className="mx-auto text-4xl text-gray-500 mb-4" />
          <p className="text-gray-400">
            No events yet. Create your first event!
          </p>
        </div>
      )}
    </div>
  );
}
