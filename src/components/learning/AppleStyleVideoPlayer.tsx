import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Subtitles } from 'lucide-react';

interface AppleStyleVideoPlayerProps {
  videoUrl: string;
  title?: string;
  onVideoEnd?: () => void;
  autoplay?: boolean;
  subtitles?: {
    en?: string;
    tr?: string;
    ru?: string;
    ar?: string;
  };
  /** Resume position in seconds, applied once metadata is loaded. */
  startAt?: number;
  /** Fired on every timeupdate with watched percentage and current time. */
  onProgress?: (percent: number, currentTime: number) => void;
  /** Fired when playback starts / stops. */
  onPlayStateChange?: (playing: boolean) => void;
  /** Increment this number to force the video to pause (e.g. to show a gate dialog). */
  pauseSignal?: number;
}

export const AppleStyleVideoPlayer = ({ 
  videoUrl, 
  title, 
  onVideoEnd,
  autoplay = false,
  subtitles,
  startAt,
  onProgress,
  onPlayStateChange,
  pauseSignal
}: AppleStyleVideoPlayerProps) => {

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCaptionsMenu, setShowCaptionsMenu] = useState(false);
  const [selectedCaption, setSelectedCaption] = useState<string>('en');
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const inactivityTimerRef = useRef<NodeJS.Timeout>();

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Reset inactivity timer
  const resetInactivityTimer = () => {
    setShowControls(true);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (isPlaying) {
      inactivityTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  useEffect(() => {
    resetInactivityTimer();
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [isPlaying]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onVideoEnd?.();
    };

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = (e: Event) => {
      console.error('Video error:', e);
      setError('Failed to load video');
      setIsLoading(false);
    };
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => setIsLoading(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
    };
  }, [onVideoEnd]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipTime(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipTime(10);
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const togglePlay = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          // Ensure video is ready to play
          if (videoRef.current.readyState >= 2) {
            await videoRef.current.play();
            setIsPlaying(true);
          } else {
            setError('Video not ready yet. Please wait...');
            setTimeout(() => setError(null), 2000);
          }
        } catch (error) {
          console.error('Failed to play video:', error);
          // Don't show error for user-initiated pause during play attempt
          if ((error as Error).name !== 'AbortError') {
            setError('Failed to play video. Please try again.');
            setTimeout(() => setError(null), 3000);
          }
        }
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    const newTime = (percentage / 100) * duration;
    
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setProgress(percentage);
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const changePlaybackSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Manage caption tracks
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tracks = video.textTracks;
    
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      if (track.language === selectedCaption && captionsEnabled) {
        track.mode = 'showing';
      } else {
        track.mode = 'hidden';
      }
    }
  }, [selectedCaption, captionsEnabled]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group"
      onMouseMove={resetInactivityTimer}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        onClick={togglePlay}
        autoPlay={autoplay}
      >
        {subtitles?.en && (
          <track
            kind="subtitles"
            src={subtitles.en}
            srcLang="en"
            label="English"
            default={selectedCaption === 'en'}
          />
        )}
        {subtitles?.tr && (
          <track
            kind="subtitles"
            src={subtitles.tr}
            srcLang="tr"
            label="Türkçe"
            default={selectedCaption === 'tr'}
          />
        )}
        {subtitles?.ru && (
          <track
            kind="subtitles"
            src={subtitles.ru}
            srcLang="ru"
            label="Русский"
            default={selectedCaption === 'ru'}
          />
        )}
        {subtitles?.ar && (
          <track
            kind="subtitles"
            src={subtitles.ar}
            srcLang="ar"
            label="العربية"
            default={selectedCaption === 'ar'}
          />
        )}
      </video>

      {/* Loading Spinner */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent border-t-transparent" />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-white mb-4">{error}</p>
            <button 
              onClick={() => {
                setError(null);
                setIsLoading(true);
                videoRef.current?.load();
              }}
              className="px-4 py-2 bg-accent rounded-lg text-white hover:bg-accent/90"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Center Play Icon */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
          !isPlaying && !isLoading && !error ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={togglePlay}
          className="pointer-events-auto w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-200"
        >
          <Play className="h-10 w-10 text-white ml-1" fill="white" />
        </button>
      </div>

      {/* Controls Bar */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent backdrop-blur-xl p-4 transition-all duration-300 ${
          showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div 
          className="w-full h-1.5 bg-white/20 rounded-full mb-3 cursor-pointer group/progress hover:h-2 transition-all"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-accent rounded-full relative transition-all"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Left Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="text-white hover:text-accent transition-colors"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>

            <button
              onClick={toggleMute}
              className="text-white hover:text-accent transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            />

            <span className="text-white text-sm font-montserrat">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Speed Control */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="text-white hover:text-accent transition-colors flex items-center gap-1"
              >
                <Settings className="h-5 w-5" />
                <span className="text-sm font-montserrat">{playbackSpeed}x</span>
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-xl rounded-lg border border-white/20 overflow-hidden">
                  {speeds.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => changePlaybackSpeed(speed)}
                      className={`block w-full px-4 py-2 text-sm font-montserrat text-left hover:bg-white/10 transition-colors ${
                        playbackSpeed === speed ? 'text-accent' : 'text-white'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Captions Control */}
            {subtitles && (
              <div className="relative">
                <button
                  onClick={() => setShowCaptionsMenu(!showCaptionsMenu)}
                  className={`text-white hover:text-accent transition-colors flex items-center gap-1 ${
                    captionsEnabled ? 'text-accent' : ''
                  }`}
                  aria-label="Toggle captions"
                >
                  <Subtitles className="h-5 w-5" />
                </button>

                {showCaptionsMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-xl rounded-lg border border-white/20 overflow-hidden min-w-[140px]">
                    <button
                      onClick={() => {
                        setCaptionsEnabled(!captionsEnabled);
                        setShowCaptionsMenu(false);
                      }}
                      className="block w-full px-4 py-2 text-sm font-montserrat text-left hover:bg-white/10 transition-colors text-white"
                    >
                      {captionsEnabled ? 'Disable CC' : 'Enable CC'}
                    </button>
                    
                    <div className="h-px bg-white/20 my-1" />
                    
                    {Object.entries(subtitles).map(([lang, url]) => (
                      url && (
                        <button
                          key={lang}
                          onClick={() => {
                            setSelectedCaption(lang);
                            setCaptionsEnabled(true);
                            setShowCaptionsMenu(false);
                          }}
                          className={`block w-full px-4 py-2 text-sm font-montserrat text-left hover:bg-white/10 transition-colors ${
                            selectedCaption === lang ? 'text-accent' : 'text-white'
                          }`}
                        >
                          {lang.toUpperCase()}
                        </button>
                      )
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-accent transition-colors"
            >
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Title Overlay */}
      {title && (
        <div 
          className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 transition-all duration-300 ${
            showControls ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
        >
          <h3 className="text-white font-montserrat font-semibold text-lg">{title}</h3>
        </div>
      )}
    </div>
  );
};
