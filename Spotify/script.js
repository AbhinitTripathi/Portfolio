//Globals
let currentSong = new Audio();
let song_name;
let song_artist;
let songs;
let currentFolder;

function secToMin(sec) {
  if(isNaN(sec) || sec < 0){
    return "00:00";
  }

  const min = Math.floor(sec / 60);
  const remSec = Math.floor(sec % 60);

  const formattedMin = String(min).padStart(2, '0');
  const formattedsec = String(remSec).padStart(2, '0');

  return `${formattedMin}:${formattedsec}`;
}

async function getSongs(folder) {

  currentFolder = encodeURI(folder);
  //Fetching songs library
  let a = await fetch(`http://127.0.0.1:3000/${currentFolder}/`);
  let res = await a.text();
  let div = document.createElement("div");
  div.innerHTML = res;

  //extract <a> tags with songs
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${currentFolder}/`)[1]);
    }
  }
  
  //add songs to library playlist
  let songLi = document.querySelector(".song__lists").getElementsByTagName("ol")[0];
  songLi.innerHTML = "";
  for (const song of songs) {
    song_name = song.replaceAll("%20", " ").split('-')[0];
    song_artist = song.replaceAll("%20", " ").split('-')[1].split('.')[0];

    songLi.innerHTML = songLi.innerHTML +
    `<li>
      <div class="song__info">
        <i class="fa-solid fa-music"></i>
        <div class="info">
          <h4>${song_name}</h4>
          <h5>${song_artist}</h5>
        </div>
      </div>
      <i class="fa-regular fa-circle-play"></i>
    </li>`;
  }

  //Add event listener to each song
  //Play songs form library
  Array.from(document.querySelector(".song__lists").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      song_artist = e.querySelector(".info").getElementsByTagName("h5")[0].innerHTML;
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim()+'-'+song_artist+'.mp3');
    });
  });
}

const playMusic = (track) => {
  currentSong.src = `/${currentFolder}/` + track
  currentSong.volume = 0.75;
  volume.value = "75";
  currentSong.play();
  document.getElementById('play').classList.remove('fa-play');
  document.getElementById('play').classList.add('fa-pause');
  
  //Taking Song name and artist from track
  songName.innerHTML = decodeURI(track).split('-')[0];
  songArtist.innerHTML = decodeURI(track).split('-')[1].split('.')[0];

  //Taking Song name and artist
  document.querySelector(".playbar__song_time").innerHTML = "00:00/00:00";
}

async function displayAlbums(){
  let a = await fetch(`http://127.0.0.1:3000/songs/`);
  let res = await a.text();
  let div = document.createElement("div");
  div.innerHTML = res;
  let anchors = div.getElementsByTagName("a");
    
  Array.from(anchors).forEach(async e=>{
    if (e.href.includes("/songs/")){
      let tFolder = e.href.split("/").slice(-2)[0];
      
      //Get the metadata of the folder
      let a = await fetch(`http://127.0.0.1:3000/songs/${tFolder}/info.json`);
      let res = await a.json();
      document.querySelector(".card__container").innerHTML = document.querySelector(".card__container").innerHTML +
      `<div class="card" data-folder="${decodeURI(tFolder)}">
        <div class="card__sub-container">
          <button class="play">
            <i class="fa-solid fa-play"></i>
          </button>
          <img src="songs/${decodeURI(tFolder)}/cover.jpg" alt="${res.title}-${res.artist}">
        </div>
        <h3>${res.title}</h3>
        <p>${res.artist}</p>
      </div>`;
    }

    //Load playlist when card is clicked
    Array.from(document.getElementsByClassName("card"),e=>{
      e.addEventListener("click", async item=>{
        await getSongs(`songs/${item.currentTarget.dataset.folder}`);
        playMusic(songs[0]);
      });
    });
  });
}

//Add Event Listener To Previous
function prev(){
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

  if((index-1) < 0){
    playMusic(songs[songs.length-1]);
  } else {
    playMusic(songs[index-1]);
  }
}

//Add Event Listener To next
function next(){
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  
  if((index+1) > songs.length-1){
    playMusic(songs[0]);
  } else {
    playMusic(songs[index+1]);
  }
}

async function main() {

  //generate song list
  await getSongs("songs/Meteora");

  //Display All albums on the page
  displayAlbums();

  //Attach event listner to play next and previous
  //Playbar functionality
  play.addEventListener("click", () => {
    if (currentSong.currentTime == 0) {
      playMusic(document.getElementsByTagName("ol")[0].firstElementChild.getElementsByTagName("h4")[0].innerHTML+'-'+song_artist+'.mp3');
    } else if (currentSong.paused) {
      document.getElementById('play').classList.remove('fa-play');
      document.getElementById('play').classList.add('fa-pause');
      currentSong.play();
    } else if (!currentSong.paused) {
      document.getElementById('play').classList.remove('fa-pause');
      document.getElementById('play').classList.add('fa-play');
      currentSong.pause();
    }
  });

  //Listen for song time update event
  currentSong.addEventListener("timeupdate", () => {
    const currSongTime = currentSong.currentTime, currSongDuration = currentSong.duration;
    document.querySelector(".playbar__song_time").innerHTML = `${secToMin(currSongTime)}/${secToMin(currSongDuration)}`;
    document.querySelector(".seekbar__circle").style.left = (currSongTime/currSongDuration) * 100 + "%";

    //Play next song when current song finishes
    if (currSongTime == currSongDuration) {
      next();
    }


  });

  //Add event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", e=>{
    songPercent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".seekbar__circle").style.left = songPercent + "%";
    currentSong.currentTime = ((currentSong.duration) * songPercent)/100
  });

  //Hamburder icon functionality
  //for mobile
  hamburger.addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  //Close library icon functionality
  //for mobile
  closeLibrary.addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  //Add event to Volume
  volume.addEventListener("change", e=>{
    currentSong.volume = (e.target.value/100);

    //Updating Volume Icon Based on Volume
    if (currentSong.volume == 0) {
      if (volumeIcon.classList[1] == "fa-volume-high") {
        volumeIcon.classList.remove("fa-volume-high");
      } else if (volumeIcon.classList[1] == "fa-volume-low") {
        volumeIcon.classList.remove("fa-volume-low");
      }
      volumeIcon.classList.add("fa-volume-xmark")
    } else if (currentSong.volume <= 0.5) {
      if(volumeIcon.classList[1] == ("fa-volume-xmark")){
        volumeIcon.classList.remove("fa-volume-xmark");
      }
      volumeIcon.classList.remove("fa-volume-high");
      volumeIcon.classList.add("fa-volume-low");
    } else if (currentSong.volume > 0.5) {
      if(volumeIcon.classList[1] == ("fa-volume-xmark")){
        volumeIcon.classList.remove("fa-volume-xmark");
      }
      volumeIcon.classList.add("fa-volume-high");
      volumeIcon.classList.remove("fa-volume-low");
    }
  });

  volumeIcon.addEventListener('click', e=>{
    if (volumeIcon.classList[volumeIcon.classList.length-1]=="fa-volume-high" || volumeIcon.classList[volumeIcon.classList.length-1]=="fa-volume-low"){
      volumeIcon.classList.add("fa-volume-xmark");
      currentSong.volume = 0;
      volume.value = 0;
    } else {
      volumeIcon.classList.remove("fa-volume-xmark");
      volumeIcon.classList.add("fa-volume-low");
      currentSong.volume = 0.3;
      volume.value = 30;
    }
  });

}

main();