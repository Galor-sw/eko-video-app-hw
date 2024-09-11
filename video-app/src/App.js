import React from 'react';
import './App.css';
import VideoPlayer from './components/VideoPlayer';
import Likes from './components/Likes';
import Views from './components/Views'; // Import Views component
import { database } from './firebaseConfig'; // Adjust path if needed

function App() {
  return (
    <div className="flex flex-col items-center p-4">
      <VideoPlayer videoDatabase={database} />
      <Views videoDatabase={database} /> {/* Add Views component here */}
      <Likes videoDatabase={database} />
    </div>
  );
}

export default App;
