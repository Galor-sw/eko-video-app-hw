import React, { useEffect, useState, useCallback } from 'react';
import { ref, runTransaction, onValue } from 'firebase/database';
import likeLogo from '../assets/like.png';
import disLikeLogo from '../assets/dislike.png';

// Spinner component with inline Tailwind CSS classes
const Spinner = () => (
    <div className="w-6 h-6 border-2 border-t-2 border-gray-400 border-solid rounded-full animate-spin border-t-gray-600"></div>
);

const Likes = ({ videoDatabase }) => {
    const [thumbsUp, setThumbsUp] = useState(null);
    const [thumbsDown, setThumbsDown] = useState(null);
    const [userVote, setUserVote] = useState(null);
    const [loading, setLoading] = useState(true); // State to track loading status

    useEffect(() => {
        const storedVote = localStorage.getItem('userVote');
        setUserVote(storedVote);

        const thumbsUpRef = ref(videoDatabase, 'likes');
        const thumbsDownRef = ref(videoDatabase, 'dislikes');

        // Fetch and listen for thumbs up/down changes
        const fetchLikes = onValue(thumbsUpRef, (snapshot) => {
            const likes = snapshot.val() || 0;
            setThumbsUp(likes);
        });

        const fetchDislikes = onValue(thumbsDownRef, (snapshot) => {
            const dislikes = snapshot.val() || 0;
            setThumbsDown(dislikes);
            setLoading(false);
        });

        return () => {
            fetchLikes();
            fetchDislikes();
        };
    }, [videoDatabase]);

    const handleThumbsUp = useCallback(() => {
        if (userVote === 'like') return;
        if (userVote === 'dislike') {
            const thumbsDownRef = ref(videoDatabase, 'dislikes');
            runTransaction(thumbsDownRef, (currentDislikes) => Math.max((currentDislikes || 0) - 1, 0));
        }

        const thumbsUpRef = ref(videoDatabase, 'likes');
        runTransaction(thumbsUpRef, (currentLikes) => (currentLikes || 0) + 1);

        // Store the vote in localStorage
        localStorage.setItem('userVote', 'like');
        setUserVote('like');
    }, [userVote, videoDatabase]);

    const handleThumbsDown = useCallback(() => {
        if (userVote === 'dislike') return;
        if (userVote === 'like') {
            const thumbsUpRef = ref(videoDatabase, 'likes');
            runTransaction(thumbsUpRef, (currentLikes) => Math.max((currentLikes || 0) - 1, 0));
        }

        const thumbsDownRef = ref(videoDatabase, 'dislikes');
        runTransaction(thumbsDownRef, (currentDislikes) => (currentDislikes || 0) + 1);

        // Store the vote in localStorage
        localStorage.setItem('userVote', 'dislike');
        setUserVote('dislike');
    }, [userVote, videoDatabase]);

    return (
        <div className="social flex flex-col items-center">
            <div className="flex gap-2.5 mt-2">
                <button
                    onClick={handleThumbsUp}
                    className="flex items-center bg-gray-200 p-2 rounded hover:bg-gray-300 focus:outline-none"
                >
                    <img src={likeLogo} alt="Thumbs Up" className="w-5 h-5 mr-2" />
                    <span className="text-sm">
                        {loading ? (
                            <div className="ml-1">
                                <Spinner />
                            </div>
                        ) : (
                            thumbsUp !== null ? thumbsUp : ''
                        )}
                    </span>
                </button>
                <button
                    onClick={handleThumbsDown}
                    className="flex items-center bg-gray-200 p-2 rounded hover:bg-gray-300 focus:outline-none"
                >
                    <img src={disLikeLogo} alt="Thumbs Down" className="w-5 h-5 mr-2" />
                    <span className="text-sm">
                        {loading ? (
                            <div className="ml-1">
                                <Spinner />
                            </div>
                        ) : (
                            thumbsDown !== null ? thumbsDown : ''
                        )}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Likes;
