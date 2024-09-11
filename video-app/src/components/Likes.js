import React, { useEffect, useState } from 'react';
import { ref, runTransaction, onValue } from 'firebase/database'; // Firebase database operations
import likeLogo from '../assets/like.png';  // Import like image
import disLikeLogo from '../assets/dislike.png';  // Import dislike image

const Likes = ({ videoDatabase }) => {
    const [thumbsUp, setThumbsUp] = useState(null); // Initialize as null
    const [thumbsDown, setThumbsDown] = useState(null); // Initialize as null
    const [userVote, setUserVote] = useState(null); // Keeps track of user vote (null, 'like', 'dislike')

    useEffect(() => {
        // Load the user's vote status from localStorage
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
        });

        // Clean up listeners on component unmount
        return () => {
            fetchLikes();
            fetchDislikes();
        };
    }, [videoDatabase]);

    const handleThumbsUp = () => {
        if (userVote === 'like') return; // Prevent double voting
        if (userVote === 'dislike') {
            // Remove dislike if previously disliked
            const thumbsDownRef = ref(videoDatabase, 'dislikes');
            runTransaction(thumbsDownRef, (currentDislikes) => Math.max((currentDislikes || 0) - 1, 0));
        }

        const thumbsUpRef = ref(videoDatabase, 'likes');
        runTransaction(thumbsUpRef, (currentLikes) => (currentLikes || 0) + 1);

        // Store the vote in localStorage
        localStorage.setItem('userVote', 'like');
        setUserVote('like');
    };

    const handleThumbsDown = () => {
        if (userVote === 'dislike') return; // Prevent double voting
        if (userVote === 'like') {
            // Remove like if previously liked
            const thumbsUpRef = ref(videoDatabase, 'likes');
            runTransaction(thumbsUpRef, (currentLikes) => Math.max((currentLikes || 0) - 1, 0));
        }

        const thumbsDownRef = ref(videoDatabase, 'dislikes');
        runTransaction(thumbsDownRef, (currentDislikes) => (currentDislikes || 0) + 1);

        // Store the vote in localStorage
        localStorage.setItem('userVote', 'dislike');
        setUserVote('dislike');
    };

    return (
        <div className="social flex flex-col items-center">
            <div className="flex gap-2.5 mt-2">
                <button
                    onClick={handleThumbsUp}
                    className="flex items-center bg-gray-200 p-2 rounded hover:bg-gray-300 focus:outline-none"
                >
                    <img src={likeLogo} alt="Thumbs Up" className="w-5 h-5 mr-2" />
                    <span className="text-sm">
                        {thumbsUp !== null ? thumbsUp : ''} {/* Show nothing until value is loaded */}
                    </span>
                </button>
                <button
                    onClick={handleThumbsDown}
                    className="flex items-center bg-gray-200 p-2 rounded hover:bg-gray-300 focus:outline-none"
                >
                    <img src={disLikeLogo} alt="Thumbs Down" className="w-5 h-5 mr-2" />
                    <span className="text-sm">
                        {thumbsDown !== null ? thumbsDown : ''} {/* Show nothing until value is loaded */}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Likes;
