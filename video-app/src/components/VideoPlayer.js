import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ref, runTransaction, onValue } from 'firebase/database';
import playIcon from '../assets/play.png';
import pauseIcon from '../assets/pause.png';
import replayIcon from '../assets/replay.png';

const VideoPlayer = ({ videoDatabase }) => {
    const videoRef = useRef(null);
    const timelineRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isEnded, setIsEnded] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [iconType, setIconType] = useState('play');
    const [showOverlayIcon, setShowOverlayIcon] = useState(false);
    const [hasPlayed, setHasPlayed] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state
    const [views, setViews] = useState(0); // Add views state

    // Increment the view count if not already done
    const incrementViews = useCallback(() => {
        const viewsRef = ref(videoDatabase, 'views');
        runTransaction(viewsRef, (currentViews) => {
            if (currentViews === null) {
                return 1; // Initial value if not present
            }
            return (currentViews || 0) + 1;
        }).then(() => {
            // Fetch the updated view count
            onValue(viewsRef, (snapshot) => {
                setViews(snapshot.val() || 0);
                setLoading(false); // Set loading to false once view count is updated
            });
        });
    }, [videoDatabase]);

    useEffect(() => {
        const video = videoRef.current;
        const videoId = 'uniqueVideoId'; // Use a unique identifier for the video
        const hasViewed = localStorage.getItem(`hasViewed_${videoId}`);

        // Check if the video has already been viewed
        if (!hasViewed) {
            localStorage.setItem(`hasViewed_${videoId}`, 'true');
            incrementViews(); // Increment views if not viewed
        } else {
            // Fetch the current view count if already viewed
            const viewsRef = ref(videoDatabase, 'views');
            onValue(viewsRef, (snapshot) => {
                setViews(snapshot.val() || 0);
                setLoading(false); // Set loading to false once view count is updated
            });
        }

        const updateTime = () => {
            if (!isDragging) {
                setCurrentTime(video.currentTime);
            }
        };

        const updateDuration = () => {
            setDuration(video.duration);
            setLoading(false); // Set loading to false once duration is set
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setIsEnded(true);
            setIconType('replay'); // Set to replay when video ends
        };

        const handlePlay = () => {
            setIsPlaying(true);
            setIsEnded(false);
            setIconType('pause'); // Set to pause when video is playing
            if (!hasPlayed) {
                setHasPlayed(true); // Mark as played
            }
        };

        const handlePause = () => {
            setIsPlaying(false);
            setIconType('play'); // Set to play when video is paused
        };

        video.addEventListener('timeupdate', updateTime);
        video.addEventListener('loadedmetadata', updateDuration);
        video.addEventListener('ended', handleEnded);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);

        return () => {
            video.removeEventListener('timeupdate', updateTime);
            video.removeEventListener('loadedmetadata', updateDuration);
            video.removeEventListener('ended', handleEnded);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
        };
    }, [isDragging, incrementViews, hasPlayed]);

    const handlePlayPause = () => {
        const video = videoRef.current;
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };

    const handlePlayAgain = () => {
        const video = videoRef.current;
        video.currentTime = 0;
        video.play();
        setIsPlaying(true);
        setIsEnded(false);
        setIconType('pause'); // Set to pause after replay
        setHasPlayed(false); // Reset played status for counting views again
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleTimelineClick = (e) => {
        const timeline = timelineRef.current;
        const rect = timeline.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newTime = (clickX / rect.width) * duration;
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleDragStart = (e) => {
        setIsDragging(true);
    };

    const handleDragging = (e) => {
        if (!isDragging) return;

        const timeline = timelineRef.current;
        const rect = timeline.getBoundingClientRect();
        const dragX = e.clientX - rect.left;
        const newTime = Math.max(0, Math.min((dragX / rect.width) * duration, duration));
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const handleVideoClick = () => {
        if (isEnded) {
            handlePlayAgain();
        } else {
            handlePlayPause();
        }
        setShowOverlayIcon(true);
        setTimeout(() => setShowOverlayIcon(false), 1000); // Show icon on video for 1 second
    };

    const getVideoOverlayIcon = () => {
        if (isEnded) return replayIcon;
        return isPlaying ? playIcon : pauseIcon;
    };

    return (
        <div className="relative flex flex-col items-start p-4">
            <div className="relative">
                <video
                    ref={videoRef}
                    muted
                    className="w-full max-w-2xl shadow-lg rounded-lg mb-2 cursor-pointer"
                    onClick={handleVideoClick}
                >
                    <source src="https://storage.eko.com/efu/homework-assignment/Oreo_try_1_vid.webm" type="video/webm" />
                    <source src="https://storage.eko.com/efu/homework-assignment/Oreo_try_1_vid.mp4" type="video/mp4" />
                </video>
                {showOverlayIcon && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative flex items-center justify-center">
                            <div
                                className="w-28 h-28 rounded-full bg-white opacity-60 absolute flex items-center justify-center"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                            >
                                <img
                                    src={getVideoOverlayIcon()}
                                    alt="Video Icon"
                                    className="w-16 h-16 animate-fade-in-out"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div
                className="w-full bg-gray-200 rounded-full h-2 mb-2 relative cursor-pointer"
                ref={timelineRef}
                onClick={handleTimelineClick}
                onMouseMove={handleDragging}
                onMouseUp={handleDragEnd}
            >
                <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
                <div
                    className="absolute bg-white border-2 border-blue-500 rounded-full w-4 h-4 top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{ left: `${(currentTime / duration) * 100}%` }}
                    onMouseDown={handleDragStart}
                ></div>
            </div>

            <div className="flex items-center w-full justify-between">
                <button
                    onClick={handlePlayPause}
                    className="focus:outline-none"
                >
                    <img
                        src={iconType === 'play' ? playIcon : iconType === 'pause' ? pauseIcon : replayIcon}
                        alt={iconType === 'play' ? 'Play' : iconType === 'pause' ? 'Pause' : 'Replay'}
                        className="w-8 h-8 cursor-pointer"
                    />
                </button>
                <div>
                    {loading ? (
                        <span className="text-gray-600">Loading...</span>
                    ) : (
                        <>
                            <span className="text-gray-600">{formatTime(currentTime)}</span>
                            <span className="mx-1">/</span>
                            <span className="text-gray-900 font-semibold">{formatTime(duration)}</span>
                        </>
                    )}
                </div>
                <div className="text-gray-900 font-semibold">
                    {loading ? 'Fetching views...' : `${views} Views`}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
