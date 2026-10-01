import { useState } from "react";
import { sendMessage } from "../api/contact";

const empty = { name: "", email: "", message: "", website: "" };

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await sendMessage(form);
      setStatus("sent");
      setForm(empty);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2.5 text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none";

  return (
    <div className="max-w-xl flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Contact</h1>
        <p className="mt-2 text-gray-400">
          Hiring for an analyst role or want to talk data? Send me a message.
        </p>
      </div>

      {status === "sent" ? (
        <div className="rounded-lg border border-emerald-800 bg-emerald-950 p-4 text-emerald-300">
          Thanks! Your message was sent. I'll get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            maxLength={100}
            className={inputClass}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            maxLength={200}
            className={inputClass}
          />
          <textarea
            name="message"
            placeholder="Message (at least 10 characters)"
            value={form.message}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={5000}
            rows={6}
            className={inputClass}
          />

          {/* Hidden spam trap: humans never see or fill this */}
          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
          />

          {error && <p className="text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-lg bg-white px-5 py-2.5 font-medium text-gray-950 hover:bg-gray-200 disabled:opacity-50"
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}