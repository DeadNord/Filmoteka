import { filterGlobalYear } from './fetch_filter_year';
import { renderGallery, renderMovies } from '../layout/gallery';

let year = '';

function onRenderYear() {
    filterGlobalYear(data => {
        console.log(data.results.release_date);
    })
}
onRenderYear()
