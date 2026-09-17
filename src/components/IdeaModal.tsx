import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Heart } from 'lucide-react';

interface IdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IdeaModal: React.FC<IdeaModalProps> = ({ isOpen, onClose }) => {
  const [botName, setBotName] = useState('');
  const [category, setCategory] = useState('Học tập & Công việc');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!botName.trim()) return;

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('user_bot_suggestions') || '[]');
      existing.push({
        botName,
        category,
        description,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('user_bot_suggestions', JSON.stringify(existing));
    } catch {
      // ignore
    }

    setIsSubmitted(true);
    setTimeout(() => {
      // auto close or let user close
    }, 2000);
  };

  const handleReset = () => {
    setBotName('');
    setDescription('');
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      id="idea-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-pink-100 rounded-3xl shadow-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-200"
        id="idea-modal-dialog"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 mx-auto mb-4 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Cảm ơn bạn đã gửi ý tưởng!
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto mb-6">
              Thị Ngọc và Cộng đồng GGAI đã ghi nhận đóng góp của bạn. Rất mong sớm ra mắt chatbot này!
            </p>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm shadow-xs transition cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-pink-600 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Đóng góp ý kiến</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Gợi ý ý tưởng Chatbot mới
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Bạn mong muốn Thị Ngọc phát triển thêm chatbot thông minh nào tiếp theo? Hãy để lại ý tưởng nhé!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tên hoặc chủ đề Bot bạn mong muốn *
                </label>
                <input
                  type="text"
                  required
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  placeholder="Ví dụ: Trợ lý ôn thi IELTS, Gia sư toán, Cố vấn phong cách..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-pink-400 focus:bg-white rounded-xl px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Lĩnh vực
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-pink-400 focus:bg-white rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-hidden transition"
                >
                  <option value="Tâm lý & Đời sống">Tâm lý & Đời sống</option>
                  <option value="Học tập & Công việc">Học tập & Công việc</option>
                  <option value="Giải trí & Nghệ thuật">Giải trí & Nghệ thuật</option>
                  <option value="Tình cảm & Kết nối">Tình cảm & Kết nối</option>
                  <option value="Khác">Lĩnh vực khác</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mô tả ngắn về tính năng bạn muốn Bot có
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Bot có thể làm được gì, tính cách ra sao..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-pink-400 focus:bg-white rounded-xl px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden transition resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!botName.trim()}
                  className="px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 disabled:opacity-50 text-white shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Heart className="w-4 h-4 fill-white/20" />
                  <span>Gửi ý tưởng</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
