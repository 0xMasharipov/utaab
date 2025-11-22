import { Play } from 'lucide-react';
import { MITLecture } from '@/data/mitOcwLectures';

interface LecturePlaylistProps {
  lectures: MITLecture[];
  currentLectureId: number;
  onLectureSelect: (id: number) => void;
}

export const LecturePlaylist = ({ lectures, currentLectureId, onLectureSelect }: LecturePlaylistProps) => {
  return (
    <div className="glass rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-foreground font-montserrat font-semibold text-lg">
          Course Lectures
        </h3>
        <p className="text-muted-foreground text-sm mt-1">
          {lectures.length} lectures
        </p>
      </div>

      <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
        {lectures.map((lecture) => {
          const isActive = lecture.id === currentLectureId;
          
          return (
            <button
              key={lecture.id}
              onClick={() => onLectureSelect(lecture.id)}
              className={`w-full p-4 flex items-start gap-3 transition-all duration-200 border-b border-white/5 last:border-b-0 ${
                isActive 
                  ? 'bg-accent/10 border-l-4 border-l-accent' 
                  : 'hover:bg-white/5 border-l-4 border-l-transparent'
              }`}
            >
              {/* Lecture Number Badge */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-montserrat font-semibold transition-colors ${
                isActive 
                  ? 'bg-accent text-white' 
                  : 'bg-white/10 text-muted-foreground'
              }`}>
                {lecture.id.toString().padStart(2, '0')}
              </div>

              {/* Lecture Info */}
              <div className="flex-1 text-left">
                <h4 className={`font-montserrat font-medium text-sm leading-tight mb-1 ${
                  isActive ? 'text-accent' : 'text-foreground'
                }`}>
                  {lecture.title}
                </h4>
                
                {lecture.description && (
                  <p className="text-muted-foreground text-xs line-clamp-2 mb-1">
                    {lecture.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-muted-foreground text-xs font-montserrat">
                    {lecture.duration}
                  </span>
                  
                  {isActive && (
                    <span className="flex items-center gap-1 text-accent text-xs font-montserrat font-semibold">
                      <Play className="h-3 w-3" fill="currentColor" />
                      Now Playing
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--accent));
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--accent) / 0.8);
        }
      `}</style>
    </div>
  );
};
