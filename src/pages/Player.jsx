// noinspection DuplicatedCode

import React, {useEffect, useState, useRef} from "react";
import Hls from 'hls.js';
import {keyPressHandler, keyDict} from "../constants";

const hlsLink = localStorage.getItem('hls');

const Player = () => {
  const [pressedKey, changePressedKey] = useState(null);
  const [isMenuVisible, changeMenuVisibility] = useState(false);

  const playerRef = useRef(null);
  const onKeyPress = (evt) => keyPressHandler(evt, changePressedKey);


  useEffect(() => {
    if (isMenuVisible && pressedKey === keyDict.UP) {
      changeMenuVisibility(false);
    }
    if (!isMenuVisible && pressedKey === keyDict.DOWN) {
      changeMenuVisibility(true);
    }
  }, [pressedKey, isMenuVisible]);

  useEffect(() => {
    const hls = new Hls();
    window.hls = hls;
    hls.loadSource(hlsLink);
    hls.attachMedia(playerRef.current);
    hls.on(Hls.Events.MANIFEST_PARSED, function() { playerRef.current.play(); });
    window.addEventListener('keydown', onKeyPress);
    return () => {
      hls.stopLoad();
      hls.destroy();
      window.removeEventListener('keydown', onKeyPress);
    };
  }, []);


  return (
    <div className="player">
      <video controls ref={playerRef} className="video" />
    </div>

  )

}

export default Player;
