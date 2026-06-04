"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";

const inputClass =
  "w-full rounded-xl border border-[#2a2a2a] bg-[#111] px-3 py-2.5 text-sm text-white outline-none focus:border-[#39ff14]";

export default function RewardFormModal({ open, onClose, onSave, reward }) {
  const isEdit = !!reward;
  const [name, setName] = useState("");
  const [cost, setCost] = useState(100);

  useEffect(() => {
    if (!open) return;
    if (reward) {
      setName(reward.name);
      setCost(reward.cost);
    } else {
      setName("");
      setCost(100);
    }
  }, [open, reward]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name, cost });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Reward" : "Create Reward"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-500">
            Reward Name
          </label>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. New Shoes"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-500">
            Coin Cost
          </label>
          <input
            type="number"
            min={1}
            className={inputClass}
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-[#39ff14] py-3 text-sm font-bold text-black hover:bg-[#2dd40f]"
        >
          {isEdit ? "Save Changes" : "Create Reward"}
        </button>
      </form>
    </Modal>
  );
}
