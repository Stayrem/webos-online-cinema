import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Link
} from "react-router-dom";
import {useParams} from 'react-router-dom';

import {fetchFilmPlaylist} from '../api';
import {fetchStatusesDict} from "../constants";
import preloader from '../preloader.svg';
import error from '../error.gif';

const fetchDataInitialState = {
  hls4: '',
  img: '',
  name: '',
  description: '',
  seasons: null,
  serialInfo: { pureHref: '', episode: '1', season: '1' },
  fetchStatus: fetchStatusesDict.PENDING,
};
const Film = () => {
  const [filmFetchData, changeFilmFetchData] = useState(fetchDataInitialState);
  const params = useParams();
  const href = params.href;
  const getSeasonInfo = useCallback((href) => {
    const targetStr = '&series';
    const index = href.indexOf(targetStr);
    if (index >= 0) {
      const seasonInfo = href.slice(index + targetStr.length + 1);
      const pureHref = href.slice(0, index);
      const episodeIndex = seasonInfo.indexOf('e');
      changeFilmFetchData((prev) =>({
        ...prev,
        serialInfo: {
          pureHref: pureHref,
          episode: seasonInfo.slice(episodeIndex + 1),
          season: seasonInfo.slice(1, episodeIndex) 
        }
      }));
    } else {
      changeFilmFetchData((prev) =>({
        ...prev,
        serialInfo: {
          ...prev.serialInfo,
          pureHref: href,
        }
      }));
    }
  }, []);

  useEffect(() => {
    (async () => {
      const playlist = await fetchFilmPlaylist(href.split('.').join('/'));
      changeFilmFetchData((prev) => ({...playlist, fetchStatus: fetchStatusesDict.FULFILLED, serialInfo: prev.serialInfo}));
      localStorage.setItem(href, JSON.stringify({playlist: playlist.hls4}));
      if (playlist.seasons !== null) {
        getSeasonInfo(href)
      }
    })();
  }, [getSeasonInfo, href]);


  return (
    <div className="container">
      {filmFetchData.fetchStatus === fetchStatusesDict.PENDING && <img src={preloader} alt="preloader"/>}
      {filmFetchData.fetchStatus === fetchStatusesDict.ERROR && <img src={error} alt="error"/>}
      {filmFetchData.fetchStatus === fetchStatusesDict.FULFILLED && (
        <div className="film-info">
          <Link className="back-btn watch-btn" to="/">Назад</Link>
          <img className="film-info__poster" width="300" src={filmFetchData.img} alt="постер"/>
          <div className="film-info__description">
            <ul className="film-info__list">
              <li className="film-info__list-item">
                <p className="film-info__list-text film-list__item--dl">Название</p>
                <p className="film-info__list-text ">{filmFetchData.name}</p>
              </li>
            </ul>
            {filmFetchData.seasons !== null && (
              <React.Fragment>
                <ul className="seasons">
                  {new Array(filmFetchData.seasons.num).fill(1).map((season, i) => {
                    return (
                      <Link
                        key={season + i}
                        to={`${filmFetchData.serialInfo.pureHref}&series=s${i + 1}e1`}
                        className={['season__item']
                          .concat(i + 1 === Number(filmFetchData.serialInfo.season) ? ['season__item--active'] : []).join(' ')}
                      >
                        {`S${i + 1}`}
                      </Link>
                    );
                  })}
                </ul>
                <ul className="seasons">
                  {new Array(filmFetchData.seasons.series).fill(1).map((season, i) => {
                    return (
                      <Link
                        key={season + i}
                        to={`${filmFetchData.serialInfo.pureHref}&series=s${filmFetchData.serialInfo.season}e${i + 1}`}
                        className={['season__item']
                          .concat(i + 1 === Number(filmFetchData.serialInfo.episode) ? ['season__item--active'] : []).join(' ')}
                      >
                        {`E${i + 1}`}
                      </Link>
                    );
                  })}
                </ul>
              </React.Fragment>
            )}
            <Link to={`/player/${params.href}`} className="watch-btn">Смотреть</Link>
          </div>
        </div>
        )}
        </div>
        );
      };

      export default Film;