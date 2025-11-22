import { useState, useEffect } from 'react';
import { EducationNavbar } from '@/components/education/EducationNavbar';
import { AppleStyleVideoPlayer } from '@/components/learning/AppleStyleVideoPlayer';
import { LecturePlaylist } from '@/components/learning/LecturePlaylist';
import { mitBlockchainLectures, MITLecture } from '@/data/mitOcwLectures';
import { Info, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const BlockchainAndMoney = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentLecture, setCurrentLecture] = useState<MITLecture>(mitBlockchainLectures[0]);
  const [isPlaylistVisible, setIsPlaylistVisible] = useState(true);

  // Initialize lecture from URL or localStorage
  useEffect(() => {
    const lectureIdFromUrl = searchParams.get('lecture');
    const savedLectureId = localStorage.getItem('mitocw-last-lecture');
    
    let lectureId = 1;
    if (lectureIdFromUrl) {
      lectureId = parseInt(lectureIdFromUrl);
    } else if (savedLectureId) {
      lectureId = parseInt(savedLectureId);
    }
    
    const lecture = mitBlockchainLectures.find(l => l.id === lectureId) || mitBlockchainLectures[0];
    setCurrentLecture(lecture);
  }, []);

  const handleLectureSelect = (id: number) => {
    const lecture = mitBlockchainLectures.find(l => l.id === id);
    if (lecture) {
      setCurrentLecture(lecture);
      setSearchParams({ lecture: id.toString() });
      localStorage.setItem('mitocw-last-lecture', id.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleVideoEnd = () => {
    const currentIndex = mitBlockchainLectures.findIndex(l => l.id === currentLecture.id);
    if (currentIndex < mitBlockchainLectures.length - 1) {
      handleLectureSelect(mitBlockchainLectures[currentIndex + 1].id);
    }
  };

  const goToPrevious = () => {
    const currentIndex = mitBlockchainLectures.findIndex(l => l.id === currentLecture.id);
    if (currentIndex > 0) {
      handleLectureSelect(mitBlockchainLectures[currentIndex - 1].id);
    }
  };

  const goToNext = () => {
    const currentIndex = mitBlockchainLectures.findIndex(l => l.id === currentLecture.id);
    if (currentIndex < mitBlockchainLectures.length - 1) {
      handleLectureSelect(mitBlockchainLectures[currentIndex + 1].id);
    }
  };

  const currentIndex = mitBlockchainLectures.findIndex(l => l.id === currentLecture.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < mitBlockchainLectures.length - 1;

  return (
    <div className="min-h-screen bg-background">
      <EducationNavbar />
      
      {/* Course Header */}
      <div className="relative gradient-mesh py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/180px-MIT_logo.svg.png"
                alt="MIT Logo"
                className="h-12 w-auto"
              />
              <div className="h-8 w-px bg-white/20" />
              <span className="text-muted-foreground font-montserrat text-sm">
                MIT Sloan School of Management
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-foreground mb-4">
              Blockchain and Money
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-3xl mb-4 font-montserrat">
              Explore the fundamental principles of blockchain technology, cryptocurrencies, 
              and their implications for the future of money and financial systems.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-montserrat">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Instructor:</span>
                Prof. Gary Gensler
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Course:</span>
                15.S12 (Fall 2018)
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Lectures:</span>
                {mitBlockchainLectures.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Player Section */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in">
            {/* Mobile Playlist Toggle */}
            <button
              onClick={() => setIsPlaylistVisible(!isPlaylistVisible)}
              className="lg:hidden w-full glass rounded-xl p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <span className="font-montserrat font-semibold text-foreground">
                Course Lectures
              </span>
              <Menu className="h-5 w-5 text-accent" />
            </button>

            {/* Current Lecture Title */}
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-accent font-montserrat text-sm font-semibold">
                    Lecture {currentLecture.id.toString().padStart(2, '0')}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mt-1">
                    {currentLecture.title}
                  </h2>
                  {currentLecture.description && (
                    <p className="text-muted-foreground mt-2 font-montserrat">
                      {currentLecture.description}
                    </p>
                  )}
                </div>
                <span className="text-muted-foreground text-sm font-montserrat flex-shrink-0">
                  {currentLecture.duration}
                </span>
              </div>
            </div>

            {/* Video Player */}
            <AppleStyleVideoPlayer
              videoUrl={currentLecture.videoUrl}
              title={currentLecture.title}
              onVideoEnd={handleVideoEnd}
            />

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={goToPrevious}
                disabled={!hasPrevious}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-montserrat text-foreground"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </button>

              <button
                onClick={goToNext}
                disabled={!hasNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-montserrat text-white"
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Playlist Section */}
          <div className={`lg:col-span-1 animate-fade-in ${isPlaylistVisible ? 'block' : 'hidden lg:block'}`}>
            <LecturePlaylist
              lectures={mitBlockchainLectures}
              currentLectureId={currentLecture.id}
              onLectureSelect={handleLectureSelect}
            />
          </div>
        </div>

        {/* Attribution Footer */}
        <div className="mt-12 glass rounded-2xl p-6 border border-accent/20 max-w-4xl mx-auto animate-fade-in">
          <div className="flex items-start gap-4">
            <Info className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
            <div className="space-y-3 text-sm text-muted-foreground font-montserrat">
              <p className="font-semibold text-foreground text-base">
                MIT OpenCourseWare Attribution
              </p>
              <p>
                These videos are from MIT OpenCourseWare course{' '}
                <a 
                  href="https://ocw.mit.edu/courses/15-s12-blockchain-and-money-fall-2018/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  15.S12 "Blockchain and Money"
                </a>{' '}
                taught by Prof. Gary Gensler (Fall 2018).
              </p>
              <p>
                <span className="font-semibold text-foreground">License:</span>{' '}
                Creative Commons BY-NC-SA 4.0
                <br />
                <span className="font-semibold text-foreground">Source:</span>{' '}
                <a 
                  href="https://ocw.mit.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  MIT OpenCourseWare
                </a>
              </p>
              <p className="text-xs">
                UTAAB EDU streams this content directly from archive.org for non-commercial 
                educational purposes. All rights remain with MIT. This course is made available 
                under a Creative Commons license, which allows for free use with proper attribution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
