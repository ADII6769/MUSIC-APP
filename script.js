const songs = [

  { 
    title: "Nanchaku",
    artist: "Seedhe Maut",
    src: "Songs/Nanchaku (PenduJatt.Com.se).mp3",
    cover: "https://pendujatt.com.se/uploads/album/seedhe-maut.webp",
    color: "linear-gradient(135deg,#6b8e23,#283618)"
  },

  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    src: "Songs/Blinding Lights (PenduJatt.Com.se).mp3",
    cover: "https://cdn-images.dzcdn.net/images/cover/a38ef87aa2917be1fe62866357f8ade1/500x500-000000-80-0-0.jpg",
    color: "linear-gradient(135deg,#ff9966,#ff5e62)"
  },

  {
    title: "Namastute",
    artist: "Seedhe Maut",
    src: "Songs/Namastute (PenduJatt.Com.se).mp3",
    cover: "https://pendujatt.com.se/uploads/album/seedhe-maut.webp",
    color: "linear-gradient(135deg,#6b8e23,#283618)"
  }

  


];

const song = document.getElementById("song");

const playBtn = document.getElementById("play");

const nextBtn = document.getElementById("next");

const prevBtn = document.getElementById("prev");

const progress = document.getElementById("progress");

const volume = document.getElementById("volume");

const currentTimeEl = document.getElementById("currentTime");

const durationEl = document.getElementById("duration");

const title = document.getElementById("title");

const closeQueue = document.getElementById("closeQueue");

const artist = document.getElementById("artist");

const bottomTitle = document.getElementById("bottomTitle");

const bottomArtist = document.getElementById("bottomArtist");

const cover = document.querySelector(".cover");

const smallCover = document.querySelector(".small-cover");

const fullscreenBtn = document.getElementById("fullscreen");

const shuffleBtn = document.getElementById("shuffle");

const queueBtn = document.getElementById("queue");

const queuePanel = document.getElementById("queuePanel");

const queueSongs = document.getElementById("queueSongs");

let currentSong = 0;

let shuffle = false;

let showRemaining = false;



function loadSong(index){

  const current = songs[index];

  song.src = current.src;

  title.innerText = current.title;

  artist.innerText = current.artist;

  bottomTitle.innerText = current.title;

  bottomArtist.innerText = current.artist;

  cover.src = current.cover;

  smallCover.src = current.cover;

  document.body.style.background = current.color;

}

loadSong(currentSong);



playBtn.addEventListener("click", ()=>{

  if(song.paused){

    song.play();

    playBtn.innerHTML =
    '<i class="fa-solid fa-pause"></i>';

  }

  else{

    song.pause();

    playBtn.innerHTML =
    '<i class="fa-solid fa-play"></i>';

  }

});

closeQueue.addEventListener("click", ()=>{

  queuePanel.classList.remove("active");

});



nextBtn.addEventListener("click", ()=>{

  if(shuffle){

    currentSong =
    Math.floor(Math.random() * songs.length);

  }

  else{

    currentSong++;

  }

  if(currentSong >= songs.length){

    currentSong = 0;

  }

  loadSong(currentSong);

  song.play();

  playBtn.innerHTML =
  '<i class="fa-solid fa-pause"></i>';

});



prevBtn.addEventListener("click", ()=>{

  currentSong--;

  if(currentSong < 0){

    currentSong = songs.length - 1;

  }

  loadSong(currentSong);

  song.play();

  playBtn.innerHTML =
  '<i class="fa-solid fa-pause"></i>';

});



song.addEventListener("loadedmetadata", ()=>{

  durationEl.innerText =
  formatTime(song.duration);

});



song.addEventListener("timeupdate", ()=>{

  if(song.duration){

    progress.value =
    (song.currentTime / song.duration) * 100;

  }

  currentTimeEl.innerText =
  formatTime(song.currentTime);

  if(showRemaining){

    let remaining =
    song.duration - song.currentTime;

    durationEl.innerText =
    "-" + formatTime(remaining);

  }

  else{

    durationEl.innerText =
    formatTime(song.duration);

  }

});



durationEl.addEventListener("click", ()=>{

  showRemaining = !showRemaining;

});



progress.addEventListener("input", ()=>{

  song.currentTime =
  (progress.value / 100) * song.duration;

});



volume.addEventListener("input", ()=>{

  song.volume = volume.value;

});



fullscreenBtn.addEventListener("click", ()=>{

  if(!document.fullscreenElement){

    document.documentElement.requestFullscreen();

  }

  else{

    document.exitFullscreen();

  }

});



shuffleBtn.addEventListener("click", ()=>{

  shuffle = !shuffle;

  if(shuffle){

    shuffleBtn.style.color = "#1DB954";

  }

  else{

    shuffleBtn.style.color = "white";

  }

});



queueBtn.addEventListener("click", ()=>{

  queuePanel.classList.toggle("active");

});



songs.forEach((s,index)=>{

  const div =
  document.createElement("div");

  div.classList.add("queue-song");

  div.innerText =
  s.title + " - " + s.artist;

  div.addEventListener("click", ()=>{

    currentSong = index;

    loadSong(currentSong);

    song.play();

    playBtn.innerHTML =
    '<i class="fa-solid fa-pause"></i>';

  });

  queueSongs.appendChild(div);

});



song.addEventListener("ended", ()=>{

  nextBtn.click();

});



function formatTime(time){

  let minutes =
  Math.floor(time / 60);

  let seconds =
  Math.floor(time % 60);

  if(seconds < 10){

    seconds = "0" + seconds;

  }

  return `${minutes}:${seconds}`;

}