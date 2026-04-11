"use client";
import { useState, useEffect } from "react";

export function useSnippets() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSnippets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/snippets", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setSnippets(data.snippets || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  const addSnippet = async (snippetData) => {
    const res = await fetch("/api/snippets", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(snippetData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create");
    setSnippets(prev => [data.snippet, ...prev]);
    return data.snippet;
  };

  const deleteSnippet = async (id) => {
    const res = await fetch(`/api/snippets/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to delete");
    }
    setSnippets(prev => prev.filter(s => s._id !== id));
  };

  const updateSnippet = async (id, newData) => {
    const res = await fetch(`/api/snippets/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update");
    setSnippets(prev => prev.map(s => s._id === id ? data.snippet : s));
    return data.snippet;
  };

  const getSnippet = (id) => snippets.find(s => s._id === id);

  return {
    snippets,
    loading,
    error,
    refetch: fetchSnippets,
    addSnippet,
    deleteSnippet,
    updateSnippet,
    getSnippet,
  };
}