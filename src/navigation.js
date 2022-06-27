import { 
  headerSection, 
  trendingPreviewSection, 
  categoriesPreviewSection, 
  genericSection, 
  movieDetailSection,
  likedMoviesSection,
  searchForm,
  headerTitle,
  arrowBtn,
  headerCategoryTitle,
  searchFormInput,
  searchFormBtn,
  trendingBtn
} from "./nodes"
import { 
  getTrendingMoviesPreview,
  getCategoriesPreview,
  getMoviesByCategory,
  getPaginatedMoviesByCategory,
  getMoviesBySearch,
  getPaginatedMoviesBySearch,
  getTrendingMovies,
  getPaginatedTrendingMovies,
  getMovieById,
  getLikedMovies
} from './main'


let infinityScroll

searchFormBtn.addEventListener('click', () => {
  location.hash = `#search=${searchFormInput.value}`
})

trendingBtn.addEventListener('click', () => {
  location.hash = '#trends'
})

arrowBtn.addEventListener('click', () => {
  history.back()
})

window.addEventListener('DOMContentLoaded', navigator, false)
window.addEventListener('hashchange', navigator, false)
window.addEventListener('scroll', infinityScroll, false)

function navigator() {
  if(infinityScroll) {
    window.removeEventListener('scroll', infinityScroll, { passive: false })
    infinityScroll = undefined
  }

  if(location.hash.startsWith('#trends')) {
    trendsPage()
  } else if (location.hash.startsWith('#search=')) {
    searchPage()
  } else if (location.hash.startsWith('#movie=')) {
    movieDetailsPage()
  }else if (location.hash.startsWith('#category=')) {
    categoriesPage()
  } else {
    homePage()
  }

  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0

  if(infinityScroll) {
    window.addEventListener('scroll', infinityScroll, { passive: false })
  }
}

const homePage = () => {
  headerSection.classList.remove('header-container--long')
  headerSection.style.background = ''
  arrowBtn.classList.add('inactive')
  arrowBtn.classList.remove('header-arrow--white')
  headerTitle.classList.remove('inactive')
  headerCategoryTitle.classList.add('inactive')
  searchForm.classList.remove('inactive')

  trendingPreviewSection.classList.remove('inactive')
  categoriesPreviewSection.classList.remove('inactive')
  likedMoviesSection.classList.remove('inactive')
  genericSection.classList.add('inactive')
  movieDetailSection.classList.add('inactive')

  getTrendingMoviesPreview()
  getCategoriesPreview()
  getLikedMovies()
}

const categoriesPage = () => {
  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  likedMoviesSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  const [_, categoryData] = location.hash.split('=')
  const [categoryId, categoryName] = categoryData.split('-')

  headerCategoryTitle.innerHTML = categoryName

  getMoviesByCategory(categoryId)

  infinityScroll = getPaginatedMoviesByCategory(categoryId)
}

const movieDetailsPage = () => {
  headerSection.classList.add('header-container--long');
  
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.add('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  likedMoviesSection.classList.add('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.remove('inactive');

  const [_, movieId] = location.hash.split('=');
  getMovieById(movieId);
}

const searchPage = () => {
  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.remove('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  likedMoviesSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  const [_, query] = location.hash.split('=');
  getMoviesBySearch(query);

  infinityScroll = getPaginatedMoviesBySearch(query);
}

function trendsPage() {
  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  likedMoviesSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  headerCategoryTitle.innerHTML = 'Tendencias';

  getTrendingMovies();

  infinityScroll = getPaginatedTrendingMovies;
}