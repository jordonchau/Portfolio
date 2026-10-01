import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getMessages } from "../api/admin";

const inputClass =
  "w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2.5 text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none";

export default function Admin() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (checking) return <p className="text-gray-400">Loading...</p>;
  return session ? <Dashboard session={session} /> : <Login />;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  }

  return (
    <div className="max-w-sm flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-white">Admin Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputClass}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={inputClass}
        />
        {error && <p className="text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-white px-5 py-2.5 font-medium text-gray-950 hover:bg-gray-200 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}

function Dashboard({ session }) {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMessages(session.access_token)
      .then(setMessages)
      .catch((err) => setError(err.message));
  }, [session]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin</h1>
          <p className="text-gray-500 text-sm">Logged in as {session.user.email}</p>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="rounded-lg border border-gray-700 px-4 py-2 text-white hover:bg-gray-900"
        >
          Sign Out
        </button>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">
          Messages ({messages.length})
        </h2>
        {error && <p className="text-red-400">{error}</p>}
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <div key={m.id} className="rounded-lg border border-gray-800 bg-gray-900 p-4">
              <div className="flex flex-wrap justify-between gap-2">
                <p className="font-medium text-white">
                  {m.name} <span className="text-gray-500 font-normal">· {m.email}</span>
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
              <p className="mt-2 text-gray-300 whitespace-pre-wrap">{m.message}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}