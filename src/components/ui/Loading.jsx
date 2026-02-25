/**
 * Loading.jsx — Component hiển thị trạng thái đang tải
 *
 * Props:
 *  - text: string (thông báo hiển thị, mặc định: "Đang tải...")
 *  - fullScreen: boolean (chiếm toàn màn hình hay không)
 */
import { Loader2 } from 'lucide-react';

export default function Loading({ text = 'Đang tải...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Spinner icon xoay liên tục */}
      <Loader2 size={32} className="animate-spin text-primary" />
      {/* Text thông báo */}
      <p className="text-sm text-slate-500 font-medium">{text}</p>
    </div>
  );

  // Nếu fullScreen = true → chiếm toàn bộ viewport
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  // Mặc định: hiển thị trong khu vực cha
  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
}
