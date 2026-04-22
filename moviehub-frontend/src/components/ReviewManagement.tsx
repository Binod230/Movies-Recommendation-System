/* SUBEDI RABIN M25W0465 */
import React, { useState, useEffect } from "react";
import api from "../api/axios";
import ConfirmModal from "./ConfirmModal";
import { Star, CheckCircle, AlertCircle, Trash2, Check } from "lucide-react";

// --- Updated Interface to match Backend DTO ---
interface Review {
  id: number;
  comment: string;
  rating: number;
  status: "PENDING" | "APPROVED";
  userName: string;
  movieTitle: string; // Ensure your ReviewResponse includes this!
  createdAt: string;
}

const ReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  // --- FETCH PENDING REVIEWS ---
  const fetchReviews = async () => {
    try {
      setLoading(true);
      // This hits the Admin endpoint that returns only PENDING reviews
      const res = await api.get<Review[]>("/reviews/pending");
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
      setMessage({ type: "error", text: "Could not load review queue" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Notification Timer
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const closeModal = () => setModal((prev) => ({ ...prev, show: false }));

  // --- ACTION LOGIC ---
  const handleAction = (review: Review, action: "approve" | "delete") => {
    setModal({
      show: true,
      title: action === "approve" ? "Approve Review" : "Delete Review",
      message: `Are you sure you want to ${action} the review for "${review.movieTitle}" by ${review.userName}?`,
      onConfirm: async () => {
        try {
          if (action === "approve") {
            // PUT /api/admin/reviews/{id}/approve
            await api.put(`/reviews/${review.id}/approve`);
            setMessage({ type: "success", text: "Review approved and now live!" });
          } else {
            // DELETE /api/admin/reviews/{id}
            await api.delete(`/reviews/${review.id}`);
            setMessage({ type: "error", text: "Review deleted successfully" });
          }
          fetchReviews(); // Refresh list after action
          closeModal();
        } catch (err) {
          console.error(err);
          setMessage({ type: "error", text: "Operation failed. Check permissions." });
          closeModal();
        }
      },
    });
  };

  return (
    <div className="p-4">
      <ConfirmModal
        isOpen={modal.show}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={closeModal}
      />

      {/* NOTIFICATION TOAST */}
      {message.text && (
        <div className={`fixed top-10 right-10 z-[100] flex flex-col overflow-hidden rounded-xl shadow-2xl animate-in slide-in-from-right duration-300 ${
          message.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white`}>
          <div className="flex items-center gap-3 px-6 py-4">
            {message.type === 'success' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
            <span className="font-black uppercase text-[10px] tracking-widest">{message.text}</span>
          </div>
          <div className="h-1 bg-black/20 w-full">
            <div className="h-full bg-white/40 animate-progress" style={{ animationDuration: '4s' }} />
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-red-600 rounded-full"></div>
            <h3 className="text-3xl font-black uppercase tracking-tighter text-white italic">
              Review <span className="text-red-600">Queue</span>
            </h3>
        </div>
        <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-2 font-bold ml-5">
          Moderate pending user feedback ({reviews.length})
        </p>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-3xl border border-white/5 bg-zinc-900/20 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-gray-500 text-[10px] uppercase tracking-[0.4em] font-black">
              <th className="py-6 pl-8">Reviewer</th>
              <th className="py-6">Movie Target</th>
              <th className="py-6">Rating</th>
              <th className="py-6">Comment Content</th>
              <th className="py-6 pr-8 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-32 text-center">
                  <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <span className="text-zinc-600 font-black uppercase text-[10px] tracking-[0.3em]">Querying Database...</span>
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-32 text-center">
                  <div className="text-zinc-700 font-black uppercase text-[10px] tracking-[0.3em] italic">
                    All clear! No pending reviews to moderate.
                  </div>
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="group hover:bg-white/[0.02] transition-all">
                  <td className="py-8 pl-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-zinc-800 to-zinc-900 text-red-600 rounded-xl flex items-center justify-center font-black text-sm border border-white/5 shadow-lg group-hover:scale-110 transition-transform">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-xs uppercase tracking-tight text-white">
                          {review.userName}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase">
                            {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-8">
                    <span className="text-xs text-red-600 font-black uppercase italic tracking-tighter">
                      {review.movieTitle}
                    </span>
                  </td>

                  <td className="py-8">
                    <div className="flex items-center gap-1 bg-black/40 w-fit px-3 py-1 rounded-full border border-white/5">
                      <Star size={10} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-[10px] font-black text-white">{review.rating}/5</span>
                    </div>
                  </td>

                  <td className="py-8 max-w-sm">
                    <p className="text-xs text-gray-400 line-clamp-2 italic leading-relaxed pr-10">
                      "{review.comment}"
                    </p>
                  </td>

                  <td className="py-8 pr-8 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleAction(review, "approve")}
                        className="p-2.5 bg-white text-black hover:bg-green-600 hover:text-white rounded-xl transition-all shadow-xl flex items-center gap-2 group/btn"
                        title="Approve Review"
                      >
                        <Check size={14} strokeWidth={3} />
                      </button>
                      <button 
                        onClick={() => handleAction(review, "delete")}
                        className="p-2.5 bg-zinc-800 text-zinc-400 hover:bg-red-600 hover:text-white rounded-xl transition-all flex items-center gap-2 group/btn"
                        title="Reject & Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        @keyframes progress { from { width: 100%; } to { width: 0%; } }
        .animate-progress { animation: progress linear forwards; }
      `}</style>
    </div>
  );
};

export default ReviewManagement;