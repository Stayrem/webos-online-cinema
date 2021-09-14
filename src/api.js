const HOST = process.env.REACT_APP_BACKEND;

export const searchFilms = async (query) => {
  return await fetch(`${HOST}/search${query}`)
    .then((res) => res.json())
    .then((res) => res.data)
    .catch((err) => console.log(err))
}

export const fetchFilmPlaylist = async (href) => {
  return await fetch(`${HOST}/item?href=${href}`)
    .then((res) => res.json())
    .catch((err) => console.log(err))
}

export const fetchFilmInfoByKPId = async (id) => {
  return await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}`, { headers: { 'X-API-KEY': 'fbfa4136-163e-462a-a513-bd722723de25'} })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};