import React, {useEffect, useState} from 'react';
import {
  Link
} from "react-router-dom";
import { useParams } from 'react-router-dom';

import { fetchFilmPlaylist } from '../api';
import { fetchStatusesDict } from "../constants";
import preloader from '../preloader.svg';
import error from '../error.gif';

const fetchDataInitialState = {
  hls4: '',
  img: '',
  name: '',
  description: '',
  seasons: null,
  fetchStatus: fetchStatusesDict.PENDING,
};
const Film = () => {
  const [ filmFetchData, changeFilmFetchData ] = useState(fetchDataInitialState);
  const params = useParams();
  useEffect(async () => {
    const playlist = await fetchFilmPlaylist(params.href.split('.').join('/'));
    changeFilmFetchData({ ...playlist, fetchStatus: fetchStatusesDict.FULFILLED });
  }, []);

  return (
    <div className="container">
      {filmFetchData.fetchStatus === fetchStatusesDict.PENDING && <img src={preloader} alt="preloader" />}
      {filmFetchData.fetchStatus === fetchStatusesDict.ERROR && <img src={error} alt="error" />}
      {filmFetchData.fetchStatus === fetchStatusesDict.FULFILLED && (
        <div className="film-info">
          <img className="film-info__poster" width="300" src={filmFetchData.img} alt="постер" />
          <div className="film-info__description">
            <ul className="film-info__list">
              <li className="film-info__list-item">
                <p className="film-info__list-text film-list__item--dl">Название</p>
                <p className="film-info__list-text ">{filmFetchData.name}</p>
              </li>
              <li className="film-info__list-item">
                <p className="film-info__list-text film-list__item--dl">Описание</p>
                <p className="film-info__list-text">{filmFetchData.description}</p>
              </li>
            </ul>

            <Link to={
              { pathname: "/player",
              state: { hsl: filmFetchData.hls4 },
            }} className="watch-btn">Смотреть</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Film;