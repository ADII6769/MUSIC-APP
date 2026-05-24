const songs = [
  { 
    title: "Nanchaku",
    artist: "Seedhe Maut",
    src: "Songs/Nanchaku (PenduJatt.Com.Se).mp3",
    cover: "https://pendujatt.com.se/uploads/album/seedhe-maut.webp",
    color: "linear-gradient(135deg,#6b8e23,#283618)"
  },
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    src: "Songs/Blinding Lights (PenduJatt.Com.Se).mp3",
    cover: "https://cdn-images.dzcdn.net/images/cover/a38ef87aa2917be1fe62866357f8ade1/500x500-000000-80-0-0.jpg",
    color: "linear-gradient(135deg,#ff9966,#ff5e62)"
  },
  {
    title: "Namastute",
    artist: "Seedhe Maut",
    src: "Songs/Namastute (PenduJatt.Com.Se).mp3",
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

const bottomTitle = document.getElementById("bottomTitle");
const bottomArtist = document.getElementById("bottomArtist");
const smallCover = document.querySelector(".small-cover");
const favoriteBtn = document.getElementById("favoriteBtn");
const shuffleBtn = document.getElementById("shuffle");

const expandedPlayer = document.getElementById("expandedPlayer");
const closeExpanded = document.getElementById("closeExpanded");
const largeCover = document.getElementById("largeCover");
const largeTitle = document.getElementById("largeTitle");
const largeArtist = document.getElementById("largeArtist");
const musicBarLeft = document.querySelector(".music-bar .left");

const homeView = document.getElementById("homeView");
const listView = document.getElementById("listView");
const listTitle = document.getElementById("listTitle");
const listContent = document.getElementById("listContent");
const menuItems = document.querySelectorAll(".menu-item");
const searchInput = document.getElementById("searchInput");

let currentSong = 0;
let shuffle = false;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function loadSong(index){
  const current = songs[index];
  song.src = current.src;

  bottomTitle.innerText = current.title;
  bottomArtist.innerText = current.artist;
  smallCover.src = current.cover;
  
  largeTitle.innerText = current.title;
  largeArtist.innerText = current.artist;
  largeCover.src = current.cover;
  expandedPlayer.style.background = current.color;
  
  updateFavoriteIcon();
}

// Initial Load
loadSong(currentSong); 

playBtn.addEventListener("click", ()=>{
  if(song.paused){
    song.play();
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  } else {
    song.pause();
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  }
});

nextBtn.addEventListener("click", ()=>{
  currentSong = shuffle ? Math.floor(Math.random() * songs.length) : (currentSong + 1) % songs.length;
  loadSong(currentSong);
  song.play();
  playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
});

prevBtn.addEventListener("click", ()=>{
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
  song.play();
  playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
});

function formatTime(time){
  let mins = Math.floor(time / 60);
  let secs = Math.floor(time % 60);
  if(secs < 10) secs = "0" + secs;
  return `${mins}:${secs}`;
}

song.addEventListener("loadedmetadata", () => { durationEl.innerText = formatTime(song.duration); });
song.addEventListener("timeupdate", () => {
  if(song.duration) progress.value = (song.currentTime / song.duration) * 100;
  currentTimeEl.innerText = formatTime(song.currentTime);
});
progress.addEventListener("input", () => { song.currentTime = (progress.value / 100) * song.duration; });
volume.addEventListener("input", () => { song.volume = volume.value; });
song.addEventListener("ended", () => { nextBtn.click(); });

// UI Interactions
shuffleBtn.addEventListener("click", ()=>{
  shuffle = !shuffle;
  shuffleBtn.style.color = shuffle ? "#1ed760" : "white";
});

musicBarLeft.addEventListener("click", (e) => {
  if (e.target.closest('#favoriteBtn')) return;
  expandedPlayer.classList.add("active");
});
closeExpanded.addEventListener("click", () => { expandedPlayer.classList.remove("active"); });

function updateFavoriteIcon(){
  const icon = favoriteBtn.querySelector("i");
  if(favorites.includes(currentSong)){
    favoriteBtn.classList.add("active");
    icon.className = "fa-solid fa-heart";
  } else {
    favoriteBtn.classList.remove("active");
    icon.className = "fa-regular fa-heart";
  }
}

favoriteBtn.addEventListener("click", ()=>{
  if(favorites.includes(currentSong)){
    favorites = favorites.filter(id => id !== currentSong);
  } else {
    favorites.push(currentSong);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoriteIcon();
});

// AESTHETIC LIST RENDERER
function renderList(title, songIndexes) {
  homeView.style.display = "none";
  listView.style.display = "block";
  listTitle.innerText = title;
  listContent.innerHTML = ""; 

  if (songIndexes.length === 0) {
    listContent.innerHTML = "<p style='color: #888;'>No songs found here yet.</p>";
    return;
  }

  songIndexes.forEach((index, i) => {
    const songIndex = parseInt(index);
    const s = songs[songIndex];
    
    const row = document.createElement("div");
    row.className = "compact-song-row";
    row.innerHTML = `
      <div class="row-left">
        <span class="row-index">${i + 1}</span>
        <img src="${s.cover}" class="row-cover">
        <div class="row-info">
          <h4>${s.title}</h4>
          <p>${s.artist}</p>
        </div>
      </div>
      <div class="row-right">
        <i class="fa-solid fa-play"></i>
      </div>
    `;
    
    row.addEventListener("click", () => {
      currentSong = songIndex;
      loadSong(currentSong);
      song.play();
      playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    });
    
    listContent.appendChild(row);
  });
}

// Sidebar Navigation
menuItems.forEach(item => {
  item.addEventListener("click", () => {
    menuItems.forEach(m => m.classList.remove("active"));
    item.classList.add("active");
    const menuText = item.querySelector("span").innerText;

    if (menuText === "Home") {
      listView.style.display = "none";
      homeView.style.display = "block";
      searchInput.value = "";
    } else if (menuText === "Favorites") {
      renderList("Your Favorites", favorites);
    } else if (menuText === "Library") {
      renderList("Your Library", songs.map((_, i) => i));
    } else if (menuText === "Search") {
      renderList("Search", []);
      searchInput.focus();
    }
  });
});

// Search
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();
  if (query === "") return;
  menuItems.forEach(m => m.classList.remove("active"));
  menuItems[1].classList.add("active"); 
  
  const matchedIndexes = [];
  songs.forEach((s, index) => {
    if (s.title.toLowerCase().includes(query) || s.artist.toLowerCase().includes(query)) {
      matchedIndexes.push(index);
    }
  });
  renderList(`Search Results: "${query}"`, matchedIndexes);
});

// Play from Home Screen Cards
document.querySelectorAll(".playlist-card").forEach(card => {
  card.addEventListener("click", (e) => {
    const cardTitle = card.querySelector("h4").innerText;
    if (cardTitle === "Underground Heat") {
      renderList("Underground Heat", [0, 2]); 
    } else {
      currentSong = parseInt(e.currentTarget.getAttribute("data-index"));
      loadSong(currentSong);
      song.play();
      playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }
  });
});

// Play from Home Screen Trending Rows
document.querySelectorAll(".home-song-row").forEach(row => {
  row.addEventListener("click", (e) => {
    currentSong = parseInt(e.currentTarget.getAttribute("data-index"));
    loadSong(currentSong);
    song.play();
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  });
});

// --- FULLSCREEN & QUEUE FIX ---

const fullscreenBtn = document.getElementById("fullscreen");
const queueBtn = document.getElementById("queue");
const queuePanel = document.getElementById("queuePanel");
const closeQueue = document.getElementById("closeQueue");
const queueSongs = document.getElementById("queueSongs");

// Fullscreen Toggle
fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    fullscreenBtn.className = "fa-solid fa-compress"; // Changes icon
  } else {
    document.exitFullscreen();
    fullscreenBtn.className = "fa-solid fa-expand"; // Changes icon back
  }
});

// Open/Close Queue Panel
queueBtn.addEventListener("click", () => {
  queuePanel.classList.toggle("active");
});

closeQueue.addEventListener("click", () => {
  queuePanel.classList.remove("active");
});

// Populate the Queue with aesthetic rows
songs.forEach((s, index) => {
  const div = document.createElement("div");
  div.className = "queue-song";
  div.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px;">
      <img src="${s.cover}" style="width:40px; height:40px; border-radius:6px; object-fit:cover;">
      <div>
        <h4 style="font-size:14px; margin-bottom:2px;">${s.title}</h4>
        <p style="font-size:12px; color:#b3b3b3;">${s.artist}</p>
      </div>
    </div>
  `;
  
  // Play song from queue
  div.addEventListener("click", () => {
    currentSong = index;
    loadSong(currentSong);
    song.play();
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    queuePanel.classList.remove("active"); // Auto-close queue after picking a song
  });
  
  queueSongs.appendChild(div);
});
