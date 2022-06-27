import {  
  headerSection,
  genericSection,
  trendingMoviesPreviewList,
  movieDetailCategoriesList,
  relatedMoviesContainer,
  likedMoviesListArticle,
  movieDetailTitle,
  movieDetailDescription,
  movieDetailScore,
  categoriesPreviewList
} from './nodes'
import axios from 'axios'

const API_KEY = 'abbbff152c2dd684e624797f16d2918f'

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    'Content-Type': 'application/json;charset=utf-8', 
  },
  params: {
    'api_key': API_KEY,
  }
})

let maxPage
let page = 1

function likedMoviesList() {
  const item = JSON.parse(localStorage.getItem('liked_movies'))
  let movies

  if(item) {
    movies = item
  } else {
    movies = {}
  }
  return movies
}

function likedMovie(movie) {
  const likedMovies = likedMoviesList()

  if(likedMovies[movie.id]) {
    likedMoviesList[movie.id] = undefined
  } else {
    likedMovies[movie.id] = movie
  }

  localStorage.setItem('liked_movies', JSON.stringify(likedMovies))
}


let callback = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute('data-img')
      entry.target.setAttribute('src', url)
    }
  })
}

const lazyLoader = new IntersectionObserver(callback)

const createMovies = (movies, container, { lazyLoad = false, clean = true, } = {}) => {
  if(clean) {
    container.innerHTML = ''
  }

  movies.forEach(movie => {
    const movieContainer = document.createElement('div')
    movieContainer.classList.add('movie-container')

    const movieImg = document.createElement('img')
    movieImg.classList.add('movie-img')
    movieImg.setAttribute('alt', movie.title)
    movieImg.setAttribute(lazyLoad ? 'data-img' : 'src', `https://image.tmdb.org/t/p/w300${movie.poster_path}`)
    movieImg.addEventListener('click', () => {
      location.hash = `#movie=${movie.id}`
    })
    movieImg.addEventListener('error', () => {
      movieImg.setAttribute('src', 'https://static.platzi.com/static/images/error/img404.png')
    })

    const movieBtn = document.createElement('button')
    movieBtn.classList.add('movie-btn')
    likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked')
    movieBtn.addEventListener('click', () => {
      movieBtn.classList.toggle('movie-btn--liked')
      likedMovie(movie)
    })

    if(lazyLoad) {
      lazyLoader.observe(movieImg)
    }

    movieContainer.appendChild(movieImg)
    movieContainer.appendChild(movieBtn)
    container.appendChild(movieContainer)
  })
}

const createCategories = (categories, container) => {
  container.innerHTML = ''

  categories.forEach(category => {
    const categoryContainer = document.createElement('div')
    categoryContainer.classList.add('category-container')
    
    const categoryTitle = document.createElement('h3')
    categoryTitle.classList.add('category-title')
    categoryTitle.setAttribute('id', `id${category.id}`)
    categoryTitle.addEventListener('click', () => {
      location.hash = `#category=${category.id}-${category.name}`
    })

    const categoryTitleText = document.createTextNode(category.name)
    categoryTitle.appendChild(categoryTitleText)
    categoryContainer.appendChild(categoryTitle)
    container.appendChild(categoryContainer)
  })
}

export const getTrendingMoviesPreview = async () => {
  const { data } = await api('trending/movie/day')
  const movies = data.results
  
  createMovies(movies, trendingMoviesPreviewList, true)
}


 export const getCategoriesPreview = async () => {
  const { data } = await api('genre/movie/list')
  const categories = data.genres
  
  createCategories(categories, categoriesPreviewList)
}

export const getMoviesByCategory = async (id) => {
  const { data } = await api('discover/movie', {
    params: {
      with_genres: id,
    },
  })
  const movies = data.results
  maxPage = data.total_pages

  createMovies(movies, genericSection, { lazyLoad: true })
}

export const getPaginatedMoviesByCategory = (id) => {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
    const pageIsNotMax = page < maxPage

    if(scrollIsBottom && pageIsNotMax) {
      page++
      const { data } = await api('discover/movie', {
        params: {
          with_genres: id, page,
        },
      })
      const movies = data.results

      createMovies(movies, genericSection, { lazyLoad: true, clean: false })
    }
  }
}

export const getMoviesBySearch = async (query) => {
  const { data } = await api('search/movie', {
    params: {
      query,
    }
  })
  const movies = data.results
  maxPage = data.total_pages
  console.log(maxPage)

  createMovies(movies, genericSection)
}

export const getPaginatedMoviesBySearch = (query) => {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
    const pageIsNotMax = page < maxPage

    if(scrollIsBottom && pageIsNotMax) {
      page++
      const { data } = await api('search/movie', {
        params: {
          query, page,
        },
      })
      const movies = data.results

      createMovies(movies, genericSection, { lazyLoad: true, clean: false})
    }
  }
}

 export const getTrendingMovies = async () => {
  const { data } = await api('trending/movie/day')
  const movies = data.results
  maxPage = data.total_pages
  
  createMovies(movies, genericSection, { lazyLoad: true, clean: true })
}

export const getPaginatedTrendingMovies = async () => {
  const { scrollTop, scrollHeight, clientHeight} = document.documentElement

  const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
  const pageIsNotMax = page < maxPage;

  if (scrollIsBottom && pageIsNotMax) {
    page++;
    const { data } = await api('trending/movie/day', {
      params: {
        page,
      },
    });
    const movies = data.results;

    createMovies(
      movies,
      genericSection,
      { lazyLoad: true, clean: false },
    );
  } 
}

export const getMovieById = async (id) => {
  const { data: movie } = await api(`movie/${id}`)

  const movieImgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  headerSection.style.background = `
    linear-gradient(
      180deg, rgba(0, 0, 0, 0.35) 19.25%,
      rgba(0, 0, 0, 0) 29.17%
    ),
    url(${movieImgUrl})
  `
  movieDetailTitle.textContent = movie.title
  movieDetailDescription.textContent = movie.overview
  movieDetailScore.textContent = movie.vote_average

  createCategories(movie.genres, movieDetailCategoriesList)
  getRelatedMoviesId(id)
}

const getRelatedMoviesId = async (id) => {
  const { data } = await api(`movie/${id}/recommendations`);
  const relatedMovies = data.results;

  createMovies(relatedMovies, relatedMoviesContainer);
}

export function getLikedMovies() {
  const likedMovies = likedMoviesList();
  const moviesArray = Object.values(likedMovies);

  createMovies(moviesArray, likedMoviesListArticle, { lazyLoad: true, clean: true });
}