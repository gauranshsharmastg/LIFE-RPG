"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";

const inputClass =
  "w-full rounded-xl border border-[#2a2a2a] bg-[#111] px-3 py-2.5 text-sm text-white outline-none focus:border-[#39ff14]";

export default function HabitFormModal({ open, onClose, onSave, habit }) {
  const isEdit = !!habit;
  const [name, setName] = useState("");
  const [points, setPoints] = useState(10);
  const [frequency, setFrequency] = useState("daily");
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (habit) {
      setName(habit.name);
      setPoints(habit.points);
      setFrequency(habit.frequency || "daily");
      setIsReading(habit.type === "reading");
    } else {
      setName("");
      setPoints(10);
      setFrequency("daily");
      setIsReading(false);
    }
  }, [open, habit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name,
      points: isReading ? 1 : points,
      frequency,
      type: isReading ? "reading" : "standard",
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Habit" : "Create Habit"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-500">
            Habit Name
          </label>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Morning Run"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-zinc-500">
            <input
              type="checkbox"
              checked={isReading}
              onChange={(e) => setIsReading(e.target.checked)}
              className="accent-[#39ff14]"
            />
            Reading habit (1 page = 1 XP)
          </label>
        </div>

        {!isReading && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">
              Point Value
            </label>
            <input
              type="number"
              min={1}
              className={inputClass}
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-500">
            Frequency
          </label>
          <div className="grid grid-cols-2 gap-2">
            {["daily", "weekly"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFrequency(f)}
                className={`rounded-xl border py-2.5 text-sm font-medium capitalize transition ${
                  frequency === f
                    ? "border-[#39ff14] bg-[#39ff14]/15 text-[#39ff14]"
                    : "border-[#2a2a2a] text-zinc-400 hover:border-[#39ff14]/40"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#39ff14] py-3 text-sm font-bold text-black hover:bg-[#2dd40f]"
        >
          {isEdit ? "Save Changes" : "Create Habit"}
        </button>
      </form>
    </Modal>
  );
}
