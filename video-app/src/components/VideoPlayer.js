import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ref, runTransaction } from 'firebase/database';
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

    // Increment the view count
    const incrementViews = useCallback(() => {
        const viewsRef = ref(videoDatabase, 'views');
        runTransaction(viewsRef, (currentViews) => (currentViews || 0) + 1);
    }, [videoDatabase]);

    useEffect(() => {
        incrementViews();
    }, [incrementViews]);

    useEffect(() => {
        const video = videoRef.current;

        const updateTime = () => {
            if (!isDragging) {
                setCurrentTime(video.currentTime);
            }
        };

        const updateDuration = () => {
            setDuration(video.duration);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setIsEnded(true);
            setIconType('replay'); // Set to replay when video ends
        };

        video.addEventListener('timeupdate', updateTime);
        video.addEventListener('loadedmetadata', updateDuration);
        video.addEventListener('ended', handleEnded);
        video.addEventListener('play', () => {
            setIsPlaying(true);
            setIsEnded(false);
            setIconType('pause'); // Set to pause when video is playing
        });
        video.addEventListener('pause', () => {
            setIsPlaying(false);
            setIconType('play'); // Set to play when video is paused
        });

        return () => {
            video.removeEventListener('timeupdate', updateTime);
            video.removeEventListener('loadedmetadata', updateDuration);
            video.removeEventListener('ended', handleEnded);
        };
    }, [isDragging]);

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
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Function to seek the video when clicking on the timeline
    const handleTimelineClick = (e) => {
        const timeline = timelineRef.current;
        const rect = timeline.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newTime = (clickX / rect.width) * duration;
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    // Handle drag start for the timeline
    const handleDragStart = (e) => {
        setIsDragging(true);
    };

    // Handle dragging the timeline toggle
    const handleDragging = (e) => {
        if (!isDragging) return;

        const timeline = timelineRef.current;
        const rect = timeline.getBoundingClientRect();
        const dragX = e.clientX - rect.left;
        const newTime = Math.max(0, Math.min((dragX / rect.width) * duration, duration));
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    // Handle drag end for the timeline
    const handleDragEnd = () => {
        setIsDragging(false);
    };

    // Handle click on video
    const handleVideoClick = () => {
        if (isEnded) {
            handlePlayAgain();
        } else {
            handlePlayPause();
        }
        setShowOverlayIcon(true);
        setTimeout(() => setShowOverlayIcon(false), 1000); // Show icon for 1 second
    };

    // Determine which icon to display on video click
    const getVideoOverlayIcon = () => {
        if (isEnded) return replayIcon;
        return isPlaying ? pauseIcon : playIcon;
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

                {/* Video Overlay Icon */}
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
                        src={iconType === 'play' ? pauseIcon : iconType === 'pause' ? playIcon : replayIcon}
                        alt={iconType === 'play' ? 'Play' : iconType === 'pause' ? 'Pause' : 'Replay'}
                        className="w-8 h-8 cursor-pointer"
                    />
                </button>
                <div>
                    <span className="text-gray-600">{formatTime(currentTime)}</span>
                    <span className="mx-1">/</span>
                    <span className="text-gray-900 font-semibold">{formatTime(duration)}</span>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
