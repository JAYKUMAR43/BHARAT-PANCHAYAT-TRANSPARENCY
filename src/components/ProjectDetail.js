import React, { useEffect, useState, useCallback } from "react";
import { fetchProjectDetail, listFeedback, submitFeedbackWithFile } from "../api";

export default function ProjectDetail({ projectId }) {
  const [project, setProject] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });

  const load = useCallback(async () => {
    const p = await fetchProjectDetail(projectId);
    setProject(p);
    const fb = await listFeedback(projectId);
    setFeedbacks(Array.isArray(fb) ? fb : []);
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }),
        console.warn
      );
    }
  }, []);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("latitude", location.lat);
    formData.append("longitude", location.lng);
    if (image) formData.append("image", image);

    await submitFeedbackWithFile(projectId, formData);
    setComment("");
    setImage(null);
    load();
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold">{project.name}</h2>

      <h3 className="mt-4 font-semibold">Submit Feedback</h3>

      <div className="space-y-2 mt-2">
        <select value={rating} onChange={(e)=>setRating(e.target.value)} className="border p-2 rounded">
          {[1,2,3,4,5].map(r=> <option key={r} value={r}>{r}⭐</option>)}
        </select>

        <input
          value={comment}
          onChange={(e)=>setComment(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Feedback comment"
        />

        <input type="file" onChange={(e)=>setImage(e.target.files[0])} />

        <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">
          Submit Feedback
        </button>
      </div>

      <hr className="my-4" />

      <h3 className="text-xl font-semibold mb-2">Feedbacks</h3>

      {feedbacks.map(fb => (
        <div key={fb.id} className="bg-gray-100 p-3 mb-3 rounded-lg">
          <p>⭐ {fb.rating}/5</p>
          <p>{fb.comment}</p>

          {fb.image_path && (
            <img
              src={`http://127.0.0.1:8000/uploads/${fb.image_path}`}
              className="w-40 mt-2 rounded border"
              alt="Proof"
            />
          )}

          {fb.latitude && fb.longitude && (
            <button
              className="text-blue-700 underline mt-1"
              onClick={() => window.open(`https://www.google.com/maps/?q=${fb.latitude},${fb.longitude}`)}
            >
              📍 View Location on Map
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
