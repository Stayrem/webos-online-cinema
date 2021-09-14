// noinspection DuplicatedCode

import React, {useEffect, useState, useRef} from "react";
import Hls from "hls.js";
import { useLocation } from 'react-router-dom';
import {keyPressHandler, keyDict} from "../constants";

const HLS = new Hls({maxBufferLength: 15, maxMaxBufferLength: 15});

const Player = () => {
  const [pressedKey, changePressedKey] = useState(null);
  const [isMenuVisible, changeMenuVisibility] = useState(false);
  const [audioTracksData, changeAudioTracksData] = useState({isVisible: true, isLoaded: false, list: []});
  const videoTagRef = useRef(null);

  const onKeyPress = (evt) => keyPressHandler(evt, changePressedKey);
  const location = useLocation();
  console.log(location);
  const videoSrc = location.state.hsl;

  useEffect(() => {
    if (isMenuVisible && pressedKey === keyDict.UP) {
      changeMenuVisibility(false);
    }
    if (!isMenuVisible && pressedKey === keyDict.DOWN) {
      changeMenuVisibility(true);
    }
  }, [pressedKey, isMenuVisible]);

  useEffect(async () => {
    HLS.loadSource(videoSrc);
    HLS.on(Hls.Events.AUDIO_TRACKS_UPDATED, (evt, data) => {
      changeAudioTracksData({
        isVisible: true,
        isLoaded: true,
        list: data.audioTracks,
      });
      videoTagRef.current.src = videoSrc;
      HLS.attachMedia(videoTagRef.current);
    });

    window.addEventListener('keydown', onKeyPress);
    return () => {
      window.removeEventListener('keydown', onKeyPress);
      HLS.destroy();
    };

  }, [videoSrc]);


  return (
    <div className="player">
      <video className="video" ref={videoTagRef} controls autoPlay />
      {isMenuVisible && audioTracksData.list.length > 1 && (
        <div className="player__menu">
          <ul className="player__menu-list">
            {audioTracksData.list.map((track, i) => {
              return (
                <li className="player__menu-item" key={track.id}>
                  <button
                    onClick={() => {
                      HLS.audioTrack = track.id;
                      changeMenuVisibility(false);
                    }}
                    className={['player__menu-btn']
                      .concat(pressedKey === i ? ['player__menu-btn--active'] : []).join(' ')}
                  >
                    {track.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>

  )

}

export default Player;
