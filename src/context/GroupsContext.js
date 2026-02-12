import React, { createContext, useState, useContext } from 'react';
import { MOCK_GROUPS } from '../data/mockData';

const COLORS = ['#1a365d', '#2c5282', '#2b6cb0', '#3182ce', '#4299e1', '#38a169', '#805ad5'];

const GroupsContext = createContext(null);

export function GroupsProvider({ children }) {
  const [groups, setGroups] = useState(MOCK_GROUPS);

  const addGroup = (name) => {
    const trimmed = (name || '').trim();
    if (!trimmed) return null;
    const icon = trimmed.length >= 2 ? trimmed.slice(0, 2).toUpperCase() : trimmed.toUpperCase();
    const color = COLORS[groups.length % COLORS.length];
    const id = String(Date.now());
    const newGroup = { id, name: trimmed, icon, color };
    setGroups((prev) => [...prev, newGroup]);
    return newGroup;
  };

  const updateGroup = (id, { name }) => {
    const trimmed = (name || '').trim();
    if (!trimmed) return null;
    const existing = groups.find((g) => g.id === id);
    if (!existing) return null;
    const updated = {
      ...existing,
      name: trimmed,
      icon: trimmed.length >= 2 ? trimmed.slice(0, 2).toUpperCase() : trimmed.toUpperCase(),
    };
    setGroups((prev) => prev.map((g) => (g.id === id ? updated : g)));
    return updated;
  };

  const deleteGroup = (id) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
    return id;
  };

  return (
    <GroupsContext.Provider value={{ groups, addGroup, updateGroup, deleteGroup }}>
      {children}
    </GroupsContext.Provider>
  );
}

export function useGroups() {
  const ctx = useContext(GroupsContext);
  if (!ctx) throw new Error('useGroups must be used within GroupsProvider');
  return ctx;
}
