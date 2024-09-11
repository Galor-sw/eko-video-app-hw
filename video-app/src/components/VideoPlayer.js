import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ref, runTransaction } from 'firebase/database'; // Firebase functions for interacting with Realtime Database

const VideoPlayer = ({ videoDatabase }) => {
    const videoRef = useRef(null);
    const [isEnded, setIsEnded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Function to increment the view count
    const incrementViews = useCallback(() => {
        const viewsRef = ref(videoDatabase, 'views'); 

        runTransaction(viewsRef, (currentViews) => {
            return (currentViews || 0) + 1;
        });
    }, [videoDatabase]);

    useEffect(() => {
        incrementViews();
    }, [incrementViews]);

    useEffect(() => {
        const video = videoRef.current;

        const updateTime = () => {
            setCurrentTime(video.currentTime);
        };

        const updateDuration = () => {
            setDuration(video.duration);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setIsEnded(true);
        };

        video.addEventListener('timeupdate', updateTime);
        video.addEventListener('loadedmetadata', updateDuration);
        video.addEventListener('ended', handleEnded);
        video.addEventListener('play', () => setIsPlaying(true));
        video.addEventListener('pause', () => setIsPlaying(false));

        return () => {
            video.removeEventListener('timeupdate', updateTime);
            video.removeEventListener('loadedmetadata', updateDuration);
            video.removeEventListener('ended', handleEnded);
            video.removeEventListener('play', () => setIsPlaying(true));
            video.removeEventListener('pause', () => setIsPlaying(false));
        };
    }, []);

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
        video.currentTime = 0; // Reset video to start
        video.play(); // Start playing again
        setIsPlaying(true);
        setIsEnded(false);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-start p-4">
            <video ref={videoRef} muted className="w-full max-w-2xl shadow-lg rounded-lg mb-2">
                <source src="https://storage.eko.com/efu/homework-assignment/Oreo_try_1_vid.webm" type="video/webm" />
                <source src="https://storage.eko.com/efu/homework-assignment/Oreo_try_1_vid.mp4" type="video/mp4" />
            </video>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2 relative">
                <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
            </div>
            <div className="flex items-center w-full justify-between">
                <button
                    onClick={isEnded ? handlePlayAgain : handlePlayPause}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
                >
                    {isEnded ? 'Play Again' : isPlaying ? 'Pause' : 'Play'}
                </button>
                <div>
                    <span className="text-gray-600">{formatTime(currentTime)}</span>/
                    <span className="text-gray-900 font-semibold">{formatTime(duration)}</span>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
