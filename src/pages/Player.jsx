// noinspection DuplicatedCode

import React, {useEffect, useState, useRef} from "react";
import Hls from 'hls.js';
import { useParams } from "react-router-dom";


const Player = () => {
  const [isPlayerVisible, changePlayerVisibility] = useState(false);
  const [audioTracks, setAudioTracks] = useState({ isLoaded: false, list: [], selectedAudio: 0});
  const params = useParams();
  const stored = JSON.parse(localStorage.getItem(params.href));
  const playerRef = useRef(null);
  const hls = new Hls();

  useEffect(() => {
    hls.loadSource(stored.playlist);
    hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (evt, data) => {
      setAudioTracks((prev) => ({
        ...prev,
        isLoaded: true,
        list: data.audioTracks,
      }));
      hls.audioTrack = audioTracks.selectedAudio;
      hls.attachMedia(playerRef.current);
      playerRef.current.requestFullscreen();
    });

    return () => {
      hls.stopLoad();
      hls.destroy();
    };
  }, [stored.playlist, isPlayerVisible]);


  return (
    isPlayerVisible ? (
      <div className="player">
        <video controls autoPlay ref={playerRef} className="video" />
      </div>
      ) : (
        <div className="audio-tracks container">
          {audioTracks.list.map((track) => {
            return <button
              key={track.id}
              onClick={() => {
                setAudioTracks((prev) => ({ ...prev, selectedAudio: track.id}));
                changePlayerVisibility(true);
              }}
              className="audio-tracks__btn">
              {track.name}
            </button>
          })}
        </div>
    )


  )

}

export default Player;
