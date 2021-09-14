import React, {useEffect, useState} from 'react';
import {
  Link
} from "react-router-dom";
import { useParams } from 'react-router-dom';

import {fetchFilmInfoByKPId, fetchFilmPlaylist} from '../api';
import { fetchStatusesDict } from "../constants";
import preloader from '../preloader.svg';
import error from '../error.gif';

const fetchDataInitialState = {
  data: {
    posterUrlPreview: '', nameRu: '', year: 0, shortDescription: '',
  },
  hsl: '',
  kinopoisk: '',
  fetchStatus: fetchStatusesDict.PENDING,
  KPFetchStatus: fetchStatusesDict.PENDING,
};
const Film = () => {
  const [ filmFetchData, changeFilmFetchData ] = useState(fetchDataInitialState);
  const params = useParams();
  useEffect(async () => {
    const playlist = await fetchFilmPlaylist(params.href.split('.').join('/'));
    const kinopoiskData = await fetchFilmInfoByKPId(playlist.kinopoisk);
    changeFilmFetchData({ ...filmFetchData, hsl: playlist.hls4, data: kinopoiskData, fetchStatus: fetchStatusesDict.FULFILLED, KPFetchStatus: fetchStatusesDict.FULFILLED });
  }, []);

  return (
    <div className="container">
      {filmFetchData.KPFetchStatus === fetchStatusesDict.PENDING &&
        filmFetchData.fetchStatus === fetchStatusesDict.PENDING && <img src={preloader} alt="preloader" />}
      {filmFetchData.KPFetchStatus === fetchStatusesDict.ERROR &&
        filmFetchData.fetchStatus === fetchStatusesDict.ERROR && <img src={error} alt="error" />}
      {filmFetchData.KPFetchStatus === fetchStatusesDict.FULFILLED &&
        filmFetchData.fetchStatus === fetchStatusesDict.FULFILLED && (
        <div className="film-info">
          <img className="film-info__poster" src={filmFetchData.data.posterUrlPreview} alt="постер" />
          <div className="film-info__description">
            <ul className="film-info__list">
              <li className="film-info__list-item">
                <p className="film-info__list-text film-list__item--dl">Название</p>
                <p className="film-info__list-text ">{filmFetchData.data.nameRu}</p>
              </li>
              <li className="film-info__list-item">
                <p className="film-info__list-text film-list__item--dl">Год</p>
                <p className="film-info__list-text">{filmFetchData.data.year}</p>
              </li>
              <li className="film-info__list-item">
                <p className="film-info__list-text film-list__item--dl">Описание</p>
                <p className="film-info__list-text">{filmFetchData.data.shortDescription}</p>
              </li>
            </ul>

            <Link to={
              { pathname: "/player",
              state: { hsl: filmFetchData.hsl },
            }} className="watch-btn">Смотреть</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Film;