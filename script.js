
const homeVideo = document.querySelector('.highlight__video');
const videoTitle = document.querySelector('.highlight__title');
const videoNota = document.querySelector('.highlight__rating');
const videoGeneros = document.querySelector('.highlight__genres');
const videoLancamento = document.querySelector('.highlight__launch');
const videoAbout = document.querySelector('.highlight__description');
const videoLink = document.querySelector('.highlight__video-link');


const botaoprev = document.querySelector('.btn-prev');
const botaoprox = document.querySelector('.btn-next');
const pesquisar = document.querySelector('.input');
const btnTema = document.querySelector('.btn-theme');
const logo = document.querySelector('.header_container-logo img');


const modal = document.querySelector('.modal');
const bodyModal = document.querySelector('.modal__body');
const modalClose = document.querySelector('.modal__close');
const modalTitle = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalAbout = document.querySelector('.modal__description');
const modalGenero = document.querySelector('.modal__genres');
const modalNota = document.querySelector('.modal__average');

const moviesContainer = document.querySelector('.movies-container');
const movies = document.querySelector('.movies');

const body = getComputedStyle(document.body);
const root = document.querySelector(':root');

let filmes = [];
let pagina;

let indexInicial = 0;
let indexFinal = 6;

const instance = axios.create({
    baseURL: 'https://tmdb-proxy.cubos-academy.workers.dev/3',
    timeout: 1000,
    headers: { 'Content-Type': 'Application/json' }
});

async function filmeToday() {
    const response = await instance.get('/movie/436969?language=pt-BR');
}
filmeToday();
async function getFilmes() {
    const response = await instance.get('/discover/movie?language=pt-BR&include_adult=false')
    filmes = response.data.results;
}
async function pegarPesquisaFilmes(requisito) {
    const filmesapi = await instance.get(requisito);
    filmes = filmesapi.data.results
}
function listagemFilmesCards(start, end) {
    const temporaria = filmes.slice(start, end)

    for (let movie of temporaria) {
        const movieCard = document.createElement('div');
        const movieinfo = document.createElement('div');
        const spantitle = document.createElement('span');
        const spanrating = document.createElement('span');
        const imgestrela = document.createElement('img');
        movieCard.classList.add('movie');
        movieinfo.classList.add('movie__info');
        spantitle.classList.add('movie__title');
        spanrating.classList.add('movie__rating');
        imgestrela.src = "./assets/estrela.svg"
        imgestrela.alt = "Estrela"
        spantitle.textContent = `${movie.title}`
        spanrating.textContent = `${movie.vote_average.toFixed(1)}`
        movieCard.style.backgroundImage = `url(${movie.poster_path})`;
        movies.appendChild(movieCard);
        spanrating.appendChild(imgestrela);
        movieinfo.appendChild(spanrating);
        movieinfo.appendChild(spantitle);
        movieCard.appendChild(movieinfo);
    }
}
async function iniciando() {
    await getFilmes()
    listagemFilmesCards(0, 6)
}
iniciando();
function deletarFilmes() {
    for (let movie of document.querySelectorAll('.movie')) {
        console.log(movie);
        movies.removeChild(movie);
    }

}
function proximaPagina() {
    botaoprox.onclick = () => {
        for (let movie of document.querySelectorAll('.movie')) {
            movies.removeChild(movie);
        }
        indexInicial += 6;
        indexFinal += 6;
        if (indexFinal > 18) {
            indexInicial = 0;
            indexFinal = 6;
            listagemFilmesCards(indexInicial, indexFinal);
        } else {
            listagemFilmesCards(indexInicial, indexFinal);
        }
    }
}
proximaPagina();
function paginaAnterior() {
    botaoprev.onclick = () => {
        deletarFilmes()
        indexInicial -= 6;
        indexFinal -= 6;
        if (indexInicial === -6) {
            indexInicial = 12;
            indexFinal = 18;
            listagemFilmesCards(indexInicial, indexFinal);
        } else {
            listagemFilmesCards(indexInicial, indexFinal);
        }
    }
}
paginaAnterior();
async function VideoDoDia() {
    const infoVideo = await instance.get("/movie/436969?language=pt-BR");
    const infoLinksVideos = await instance.get("/movie/436969/videos?language=pt-BR");


    let generos = [];


    homeVideo.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${infoVideo.data.backdrop_path})`
    homeVideo.style.backgroundSize = 'contain';
    videoTitle.textContent = infoVideo.data.title;
    videoNota.textContent = infoVideo.data.vote_average.toFixed(1);

    for (const genero of infoVideo.data.genres) {
        generos.push(genero.name);
    }
    videoGeneros.textContent = generos.join(", ").toUpperCase();
    videoLancamento.textContent = new Date(infoVideo.data.release_date).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });

    videoAbout.textContent = infoVideo.data.overview;
    videoLink.href = `https://www.youtube.com/watch?v=${infoLinksVideos.data.results[0].key}`;


}
VideoDoDia();
async function playmodal(evento) {

    const apiModal = await instance.get(`/movie/${evento}?language=pt-BR`);
    modal.classList.remove("hidden")
    console.log(apiModal);

    modalTitle.textContent = apiModal.data.title;
    modalImg.src = apiModal.data.backdrop_path;
    modalAbout.textContent = apiModal.data.overview;
    modalNota.textContent = apiModal.data.vote_average.toFixed(1);
    modalGenero.innerHTML = "";
    apiModal.data.genres.forEach(genero => {
        const modalSpan = document.createElement('span');

        modalSpan.classList.add("modal__genre");
        modalSpan.textContent = genero.name;
        modalGenero.appendChild(modalSpan);
    });

    modalClose.addEventListener('click', () => {
        modal.classList.add("hidden");
    });

    bodyModal.addEventListener('click', () => {
        modal.classList.add("hidden");
    });
}
playmodal('436969');
pesquisar.addEventListener('keypress', async (evento) => {

    if (evento.key === "Enter" && evento.target.value == "") {
        deletarFilmes()
        await getFilmes()
        indexInicial = 0;
        indexFinal = 6;
        listagemFilmesCards(indexInicial, indexFinal);
    } else if (evento.key === "Enter" && evento.target.value) {
        deletarFilmes()
        await pegarPesquisaFilmes(`search/movie?language=pt-BR&include_adult=false&query=${evento.target.value}`)
        listagemFilmesCards(0, 6)
        evento.target.value = ""
    }
})
btnTema.addEventListener('click', () => {
    const corAtual = body.getPropertyValue("background-color")

    if (corAtual === "rgb(255, 255, 255)") {
        root.style.setProperty("--background", "#1b2028");
        root.style.setProperty("--input-color", "#665f5f");
        root.style.setProperty("--background-input-color", "#3e434d");
        root.style.setProperty("--text-color", "#ffffff");
        root.style.setProperty("--bg-secondary", "#2d3440");

        botaoprox.src = "./assets/arrow-right-light.svg";
        botaoprev.src = "./assets/arrow-left-light.svg";
        btnTema.src = "./assets/dark-mode.svg";
        logo.src = "./assets/logo.svg";
        fecharModal.src = "./assets/close.svg";

    } else {
        root.style.setProperty("--background", "#fff");
        root.style.setProperty("--input-color", "#979797");
        root.style.setProperty("--background-input-color", "#FFFFFF");
        root.style.setProperty("--text-color", "#1b2028");
        root.style.setProperty("--bg-secondary", "#ededed");

        botaoprox.src = "./assets/arrow-right-dark.svg";
        botaoprev.src = "./assets/arrow-left-dark.svg";
        btnTema.src = "./assets/light-mode.svg";
        logo.src = "./assets/logo-dark.png";
        fecharModal.src = "./assets/close-dark.svg";
    }
})
