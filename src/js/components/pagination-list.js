import { refs } from '../refs/refs.js'
import { renderGallery } from '../layout/gallery'
import pagination from '../../views/components/pagination_list.hbs'
import svg from '../../images/svg/sprite.svg';

import { GENRES_MAP, init } from '../data/genres';

const MAX_SHOWN_PAGES = 9;
const PAGES_GAP = 2;

export function primaryPagination() {
    const pagesContainer = refs.main.querySelector('.pagination-container');
    pagesContainer.insertAdjacentHTML("beforeend", pagination({ svg }));
    pagesContainer.addEventListener('click', onClick);
}


let totalPages = 20;

const searchQuery = 'love';
const options = ""


//pagesContainer.addEventListener('click', onClick);

// init();
// renderGallery().then((data => {
//     console.log(data.total_pages)
//     renderPagination(1, data.total_pages);
// }));
//renderPagination(1, totalPages);

function onClick(e) {
    e.preventDefault();

    if (e.target.nodeName !== 'BUTTON') {
        return;
    };

    let page = Number(e.target.textContent);

    if (e.target.className.includes('end')) {
        page = Number(refs.main.querySelector('.active').textContent) + 5
    }

    if (e.target.className.includes('begin')) {
        page = Number(refs.main.querySelector('.active').textContent) - 5;
    }

    if (e.target.className.includes('previous')) {
        page = refs.main.querySelector('.active').textContent - 1;
    }
    if (e.target.className.includes('next')) {
        page = Number(refs.main.querySelector('.active').textContent) + 1;
    }
    //renderPagination(page, totalPages);
    //renderGallery('', page)
    renderGallery(searchQuery, page, options).then((data => {
        console.log(data.total_pages)
        renderPagination(page, data.total_pages);
    }));
}

export function renderPagination(currentPage, totalPages) {
    document.querySelector('.pagination-numbers').innerHTML = createPagination(currentPage, totalPages);
    hideArrows(currentPage, totalPages);
    return currentPage;
}

function hideArrows(currentPage, totalPages) {
    const pagesContainer = refs.main.querySelector('.pagination-container');
    if (currentPage == 1) {
        pagesContainer.querySelector('.previous').disabled = true
    } else {
        pagesContainer.querySelector('.previous').disabled = false
    }

    if (currentPage == totalPages) {
        pagesContainer.querySelector('.next').disabled = true
    } else {
        pagesContainer.querySelector('.next').disabled = false
    }
}

export function createPagination(currentPage, totalPages) {
    const center = Math.ceil(MAX_SHOWN_PAGES / 2);
    let str = ``;
    if (totalPages <= MAX_SHOWN_PAGES) {
        for (let p = 1; p <= totalPages; p += 1) {
            str += isActive(p, currentPage, totalPages)
        }
    } else {
        str += isActive(1, currentPage, totalPages)
        if (currentPage <= center) {
            for (let p = 2; p <= center + PAGES_GAP; p += 1) {
                str += isActive(p, currentPage, totalPages);
            }
            str += createAllPages('...', 'end mobile-hidden')
        } else {
            if (currentPage <= totalPages - center) {
                str += createAllPages('...', 'begin mobile-hidden')
                for (let p = currentPage - PAGES_GAP; p <= currentPage + PAGES_GAP; p += 1) {
                    str += isActive(p, currentPage, totalPages);
                }
                str += createAllPages('...', 'end mobile-hidden')
            } else {
                str += createAllPages('...', 'begin mobile-hidden')
                for (let p = totalPages - center - 1; p < totalPages; p += 1) {
                    str += isActive(p, currentPage, totalPages);
                }
            }
        }
        str += isActive(totalPages, currentPage, totalPages)
    }
    return str;
}

function isActive(page, currentPage, totalPages) {
    if (page == currentPage) {
        return createAllPages(page, 'active')
    } else {
        return hideForMobile(page, currentPage, totalPages)
    }
}

function hideForMobile(page, currentPage, totalPages) {
    if (totalPages <= MAX_SHOWN_PAGES - 4) {
        return createAllPages(page, '')
    }
    if (currentPage <= 1 + PAGES_GAP) {
        if (page <= 5) {
            return createAllPages(page, '')
        } else {
            return createAllPages(page, 'mobile-hidden');
        }
    }
    if (currentPage < totalPages - PAGES_GAP) {
        if (page >= currentPage - PAGES_GAP && page <= currentPage + PAGES_GAP) {
            return createAllPages(page, '')
        } else {
            return createAllPages(page, 'mobile-hidden');
        }
    }
    if (page >= totalPages - 4) {
        return createAllPages(page, '')
    } else {
        return createAllPages(page, 'mobile-hidden');
    }
}

function createAllPages(page, className) {
    return `<li class="page-item"><button class="page-button ${className}">${page}</button></li>`
}