import { pageRender } from '../../call_list/call_list.js';
import mainTittle from '../../data/main.json';
import { homeMarkUp } from '../../layout/hero_home';
import { renderGallery } from '../../layout/gallery';
import myLibraryMarkUp from '../../../views/partials/hero_my_list.hbs';
import { refs } from '../../refs/refs.js';
import { initGenres } from '../../data/genres';
import { signOutUser } from '../../components/appFirebase';
import { onLibButtons } from '../../layout/hero_my_list.js';
// import { ref } from '@firebase/database';

function current(event) {
  if (event === 'home') {
    refs.idhome.classList.add('nav__current');
    refs.idmyLib.classList.remove('nav__current');
  } else if (event === 'my library') {
    refs.idhome.classList.remove('nav__current');
    refs.idmyLib.classList.add('nav__current');
  }
}

export function home() {
  current('home');
  initGenres();
  renderGallery();
  pageRender(mainTittle.home, homeMarkUp, 'hero--home', 'hero--my-library');
}

export function mylibwatch() {
  // here render header page Button
  const myLib = myLibraryMarkUp();
  pageRender(
    mainTittle.my_library_watched,
    myLib,
    'hero--my-library',
    'hero--home',
    current('my library'),
  );
  onLibButtons();
  const userId = sessionStorage.getItem('userId');
  renderGallery('library', `${userId}`, `watched`);
}

// Funchtion for render header
function canheHeader(event) {
  event.preventDefault();
  let item = event.target.textContent.trim();
  if (item === 'home' || item === 'log out') {
    // here render header page serch
    home();
  } else if (sessionStorage.getItem('userId') !== null) {
    mylibwatch();
  } else {
    refs.singinModal.classList.remove('modal-auth--hidden');
    home();
  }
  if (item === 'log in') {
    refs.singinModal.classList.remove('modal-auth--hidden');
    refs.modalError.classList.add('modal__error--hidden');
  }
  return;
}

refs.myUlEle.forEach(function (link) {
  link.addEventListener('click', canheHeader);
});

// function auth
export function swetchClass() {
  changeAuthModal();
}

function changeAuthModal() {
  if (sessionStorage.getItem('userId') === null) {
    refs.logIn.classList.remove('js-login--hidden');
    refs.logOut.classList.add('js-logout--hidden');
  } else {
    refs.logIn.classList.add('js-login--hidden');
    refs.logOut.classList.remove('js-logout--hidden');
  }
}
swetchClass();

refs.logOut.addEventListener('click', loginOutUser);

function loginOutUser() {
  signOutUser();
}
