import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';

const Spinner = () => (
    <div className="w-6 h-6 border-2 border-t-2 border-gray-400 border-solid rounded-full animate-spin border-t-gray-600"></div>
);

const Views = ({ videoDatabase }) => {
    const [views, setViews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const viewsRef = ref(videoDatabase, 'views');
        const unsubscribe = onValue(viewsRef, (snapshot) => {
            const viewsCount = snapshot.val() || 0;
            setViews(viewsCount);
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, [videoDatabase]);

    return (
        <div className="viewsContainer text-gray-700 font-semibold flex items-center">
            <span className="viewsCaption">Views:</span>
            {loading ? (
                <div className="ml-1">
                    <Spinner />
                </div>
            ) : (
                <span className="views ml-1">{views !== null ? views : ''}</span>
            )}
        </div>
    );
};

export default Views;
