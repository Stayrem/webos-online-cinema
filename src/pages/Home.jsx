import React, {useState, useEffect, useRef} from 'react';
import {
  Link,
  useHistory,
} from "react-router-dom";

import { searchFilms } from '../api';
import { fetchStatusesDict, keyPressHandler } from '../constants';
import preloader from '../preloader.svg';
import error from '../error.gif';

const fetchDataInitialState = {
  films: [],
  fetchStatus: fetchStatusesDict.PENDING,
};

const Home = () => {
  const searchRef = useRef('');
  const [ focusedIndex, changeFocusedIndex] = useState(0);
  const [pressedKey, changePressedKey] = useState(null);
  const [fetchData, changeFetchData ] = useState(fetchDataInitialState);
  const [isSearchFocused, changeIsSearchFocused] = useState(true);
  useHistory();
  const searchSubmitHandler = async (evt, query) => {
    evt.preventDefault();
    changeFetchData(fetchDataInitialState);
    await initFetchedData(`?query=${query}`)
  };

  const initFetchedData = async (query = '?query=Witcher') => {
    try {
      const filmsFetchData = await searchFilms(query);
      changeFetchData({
        films: filmsFetchData,
        fetchStatus: fetchStatusesDict.FULFILLED,
      });
    } catch (err) {
      changeFetchData({
        films: [],
        fetchStatus: fetchStatusesDict.ERROR,
      });
    }
  }


  useEffect(async () => {
    await initFetchedData();
  }, []);

  return (
    <div className="container">
      <div className="film-search">
        <form onSubmit={(evt) => searchSubmitHandler(evt, searchRef.current.value)}>
          <input
            ref={searchRef}
            className={['film-search__input']
              .concat(focusedIndex === -1 ? ['film-search__input--active'] : []).join(' ')}
            type="search"
            placeholder="Введите название..."
          />
        </form>
      </div>

      <div className="film">
          {fetchData.fetchStatus === fetchStatusesDict.PENDING && <img src={preloader} alt="preloader" />}
          {fetchData.fetchStatus === fetchStatusesDict.FULFILLED && !fetchData.films.length && <div>NO DATA</div> }
          {fetchData.fetchStatus === fetchStatusesDict.ERROR && <img src={error} alt="error" />}
        {[pressedKey?.key, pressedKey?.code].join(' ')}
          <ul className="film-list">
          {fetchData.fetchStatus === fetchStatusesDict.FULFILLED && fetchData.films.length > 0 && (
            fetchData.films.map((film, index) => {
              return (
                <li className="film-list__item" key={`${film.href}-${index}`}>
                  <Link
                    style={{backgroundImage: `url("${film.img}")`}}
                    to={`film/${film.href.split('/').join('.')}`}
                    className="film-list__link">
                    <div className="film-list__description">
                      <p className="film-list__description-item film-list__name">{film.name}</p>
                      <p className="film-list__description-item film-list__genre">{film.label}</p>
                    </div>
                  </Link>
                </li>
              )
            })
          )}
        </ul>
      </div>
    </div>
  );
}

export default Home;
