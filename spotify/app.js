const recentplay = document.getElementById('recentplay');
const foryouplay = document.getElementById('dmul');
let replayalbumlist;

async function loadAlbum(folderName) {
    try {
        // dynamically import the info.js from the given folder
        const safeName = encodeURIComponent(folderName);
        const module = await import(`./songs/recentlyplayed/${safeName}/info.js`);
        return module.albuminfo; // return the object
    } catch (error) {
        console.error(`Failed to load album: ${folderName}`, error);
        return null;
    }
};


async function load_replay() {
    const albumNames = ['Baads of Bollywood', 'Crazyyy', 'Maa', 'Hot Hits Hindi', 'Maa', 'Real Talk', 'Daily Mix 1', 'New in Dance'];

    const albums = await Promise.all(albumNames.map(loadAlbum));
    replayalbumlist = albums;
    albums.forEach((x) => {
        recentplayed_show(x.title, x.img);
    })
};

const recentplayed_show = (title, img) => {
    let li = document.createElement('li');
    let btn = document.createElement('button')
    btn.classList.add('replay')
    let divdmbtn = document.createElement('div')
    divdmbtn.classList.add('rpbtn')
    let image = document.createElement('img')
    image.src = img;
    let divcon = document.createElement('div')
    divcon.classList.add('content')
    let p = document.createElement('h4')
    p.innerText = title
    let divplay = document.createElement('div')
    divplay.classList.add('playy', 'playy-none')
    let a = document.createElement('a')
    let ic = document.createElement('i')
    ic.classList.add('fa-solid', 'fa-play')
    divdmbtn.appendChild(image)
    divcon.appendChild(p)
    divdmbtn.appendChild(divcon)

    a.appendChild(ic)
    divplay.appendChild(a)
    btn.appendChild(divdmbtn)
    btn.appendChild(divplay)

    li.appendChild(btn);
    recentplay.appendChild(li);
}

async function loadAlbum2(folderName) {
    try {
        // dynamically import the info.js from the given folder
        const safeName = encodeURIComponent(folderName);
        const module = await import(`./songs/made for you/${safeName}/info.js`);
        return module.albuminfo; // return the object
    } catch (error) {
        console.error(`Failed to load album: ${folderName}`, error);
        return null;
    }
};


async function load_foryou() {
    const albumNames = ['Daily Mix 1', 'Daily Mix 2', 'Daily Mix 3', 'Daily Mix 4'];

    const albums = await Promise.all(albumNames.map(loadAlbum2));
    albums.forEach((x) => {
        for_you(x.title, x.img);
    })
};

const for_you = (title, img) => {
    let li = document.createElement('li');
    let btn = document.createElement('button')
    btn.classList.add('daily')
    let divdmbtn = document.createElement('div')
    divdmbtn.classList.add('dmbtn')
    let image = document.createElement('img')
    image.src = img;
    let p = document.createElement('p')
    p.innerText = title
    let divplay = document.createElement('div')
    divplay.classList.add('playyd', 'playyd-none')
    let a = document.createElement('a')
    let ic = document.createElement('i')
    ic.classList.add('fa-solid', 'fa-play')
    divdmbtn.appendChild(image)
    divdmbtn.appendChild(p)

    a.appendChild(ic)
    divplay.appendChild(a)
    btn.appendChild(divdmbtn)
    btn.appendChild(divplay)

    li.appendChild(btn);
    foryouplay.appendChild(li);
}

let playbtn = document.getElementById('play')
let pausebtn = document.getElementById('pause')
let simage = document.getElementById('song-img');
let stitle = document.getElementById('song-title');
let sartist = document.getElementById('song-artist');

let audio = new Audio();
let currentsongindex = 0;
let currentalbum = null;

function playsong(img, index) {
    console.log(currentalbum)
    if (currentalbum !== null) {
        let music = currentalbum[currentsongindex].src;
        audio.src = music;
        audio.play();
        playbtn.classList.remove('play-none')
        pausebtn.classList.add('play-none')

        let image;
        if ('image' in currentalbum[currentsongindex]) {
            image = currentalbum[currentsongindex].img
        } else {
            image = img;
        }
        simage.src = image;
        stitle.innerText = currentalbum[currentsongindex].title
        sartist.innerText = currentalbum[currentsongindex].artist

        audio.onended = () => {
            if (currentsongindex < currentalbum.length - 1) {
                currentsongindex++;
                playsong();
            }
            else {
                console.log('album ended!')
            }
        }
    }
}


function pausesong() {
    if (audio) {
        audio.pause();
        playbtn.classList.add('play-none')
        pausebtn.classList.remove('play-none')
    }
};
function resumesong() {
    if (audio && audio.pause) {
        audio.play()
        playbtn.classList.remove('play-none')
        pausebtn.classList.add('play-none')
    }
}
function prevsong() {
    if (currentalbum && currentsongindex > 0) {
        currentsongindex--;
        playsong();
    }
}
function nextsong() {
    if (currentalbum && currentsongindex < currentalbum.length - 1) {
        currentsongindex++;
        playsong();
    }
}

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        event.preventDefault();

        if (audio.paused) {
            audio.play();
            playbtn.classList.remove('play-none')
            pausebtn.classList.add('play-none')
        } else {
            audio.pause();
            playbtn.classList.add('play-none')
            pausebtn.classList.remove('play-none')
        }
    }
});

const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
const currentTimeE1 = document.getElementById('current-time');
const durationE1 = document.getElementById('duration');

audio.addEventListener('timeupdate', () => {
    progress.max = audio.duration;
    progress.value = audio.currentTime;

    currentTimeE1.textContent = formatTime(audio.currentTime);
    durationE1.textContent = formatTime(audio.duration);
});
progress.addEventListener('input', () => {
    audio.currentTime = progress.value;
});
volume.addEventListener('input', () => {
    audio.volume = volume.value;
});
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};
function mutesong() {
    let volhigh = document.getElementById('vol-high');
    let vollow = document.getElementById('vol-low');

    if (audio.volume > 0) {
        audio.volume = 0;
        volhigh.classList.toggle('vol-mute');
        vollow.classList.toggle('vol-mute');
        volume.value = 0;
    }
    else {
        audio.volume = 1;
        volhigh.classList.toggle('vol-mute');
        vollow.classList.toggle('vol-mute');
        volume.value = 1;
    }
}


function display_selected_album(songs, img, albumtitle) {
    let select = document.getElementById('displayselect');
    let nowplay = document.getElementById('Nowplaying');
    select.innerHTML = '';
    let image;
    songs.forEach((song) => {
        if ('img' in song) {
            image = song.img;
        } else {
            image = img;
        }
        nowplay.innerText = `Now playing "${albumtitle}"`;
        let li = `<li><button><div class="btndiv"><img src="${image}" alt=""><div class="content"><h4>${song.title}</h4><p>${song.artist}</p></div></div></button ></li >`
        select.innerHTML += li;

    });
    currentalbum = songs;
    currentsongindex = 0;
    playsong(img)
}

async function load_parameter() {
    await load_replay();
    await load_foryou();

    const hoverplay = document.querySelectorAll('.replay');
    const hoverplay2 = document.querySelectorAll('.daily');
    const playbtnshow = document.querySelectorAll('.playy');
    const playbtnshow2 = document.querySelectorAll('.playyd');

    hoverplay.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            playbtnshow[index].classList.remove('playy-none')
        })
        card.addEventListener('mouseleave', () => {
            playbtnshow[index].classList.add('playy-none')
        })
        card.addEventListener('click', () => {
            console.log('clicked', index)
            let song_detial = replayalbumlist[index].songs
            display_selected_album(song_detial, replayalbumlist[index].img, replayalbumlist[index].title)
        });

    });

    hoverplay2.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            playbtnshow2[index].classList.toggle('playyd-none')
        })
        card.addEventListener('mouseleave', () => {
            playbtnshow2[index].classList.toggle('playyd-none')
        })


    });


}

load_parameter();
