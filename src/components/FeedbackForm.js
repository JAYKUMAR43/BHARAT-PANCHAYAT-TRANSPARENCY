import React, { useState } from "react";
import { submitFeedback, submitFeedbackWithFile } from "../api";

export default function FeedbackForm({ projectId, onSubmitted }) {
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (file) {
        const form = new FormData();
        form.append("file", file);
        form.append("rating", rating);
        form.append("comment", comment);

        await submitFeedbackWithFile(projectId, form);
      } else {
        await submitFeedback(projectId, {
          rating: Number(rating),
          comment,
        });
      }

      setRating(4);
      setComment("");
      setFile(null);

      if (onSubmitted) onSubmitted();
    } catch (err) {
      alert("Feedback submission failed");
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="border p-2 rounded w-20"
      />

      <textarea
        className="border p-2 rounded w-full"
        rows={3}
        placeholder="Write feedback..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}
