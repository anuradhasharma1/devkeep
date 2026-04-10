"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "devkeep_snippets";

export function useSnippets() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);

  // load snippets
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSnippets(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Snippet load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // helper
  const persist = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  // create
  const addSnippet = (snippet) => {
    const newSnippet = {
      ...snippet,
      _id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const updated = [newSnippet, ...snippets];
    setSnippets(updated);
    persist(updated);

    return newSnippet;
  };

  // delete
  const deleteSnippet = (id) => {
    const updated = snippets.filter((s) => s._id !== id);
    setSnippets(updated);
    persist(updated);
  };

  // update
  const updateSnippet = (id, newData) => {
    const updated = snippets.map((s) =>
      s._id === id ? { ...s, ...newData } : s
    );

    setSnippets(updated);
    persist(updated);
  };

  // get one (useful later)
  const getSnippet = (id) => {
    return snippets.find((s) => s._id === id);
  };

  return {
    snippets,
    loading,
    addSnippet,
    deleteSnippet,
    updateSnippet,
    getSnippet,
  };
}