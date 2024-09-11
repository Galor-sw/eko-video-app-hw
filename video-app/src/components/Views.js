import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database'; // Firebase database operations

const Views = ({ videoDatabase }) => {
    const [views, setViews] = useState(null); // Initialize as null to avoid showing 0 initially

    useEffect(() => {
        const viewsRef = ref(videoDatabase, 'views');

        // Fetch and listen for view count changes
        const unsubscribe = onValue(viewsRef, (snapshot) => {
            const viewsCount = snapshot.val() || 0;
            setViews(viewsCount);
        });

        // Clean up listener on component unmount
        return () => {
            unsubscribe(); // Unsubscribe from the listener
        };
    }, [videoDatabase]);

    return (
        <div className="viewsContainer text-gray-700 font-semibold">
            <span className="viewsCaption">Views:</span>
            <span className="views ml-1">{views !== null ? views : ''}</span> {/* Show nothing until views are loaded */}
        </div>
    );
};

export default Views;
