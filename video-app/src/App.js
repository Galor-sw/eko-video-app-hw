import React from 'react';
import './App.css';
import VideoPlayer from './components/VideoPlayer';
import Likes from './components/Likes';
import Views from './components/Views';
import { database } from './firebaseConfig';

function App() {
  return (
    <div className="flex flex-col items-center p-4">
      <VideoPlayer videoDatabase={database} />
      <Views videoDatabase={database} /> 
      <Likes videoDatabase={database} />
    </div>
  );
}

export default App;
