const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const progress = document.getElementById('progress');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const playlistElement = document.getElementById('playlist');

// 1. Array of tracks
const songs = [
    { name: 'Lo-fi Study', artist: 'Focus Flow', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { name: 'Chill Beats', artist: 'Midnight City', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { name: 'Synthwave', artist: 'Retro Tech', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
];

let songIndex = 0;

// 2. Load song function
function loadSong(index) {
    songIndex = index;
    const song = songs[songIndex];
    title.innerText = song.name;
    artist.innerText = song.artist;
    audio.src = song.url;
    
    // Highlight the current song in the list
    updatePlaylistUI();
}

// 3. Render the playlist
function updatePlaylistUI() {
    playlistElement.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerText = `${song.name} - ${song.artist}`;
        if (index === songIndex) li.classList.add('active');
        
        li.onclick = () => {
            loadSong(index);
            playSong();
        };
        playlistElement.appendChild(li);
    });
}

// 4. Play/Pause Logic
function playSong() {
    audio.play();
    playBtn.innerText = 'Pause';
}

function pauseSong() {
    audio.pause();
    playBtn.innerText = 'Play';
}

playBtn.addEventListener('click', () => {
    const isPlaying = !audio.paused;
    isPlaying ? pauseSong() : playSong();
});

// 5. Next/Prev Logic
document.getElementById('next').addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songIndex);
    playSong();
});

document.getElementById('prev').addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songIndex);
    playSong();
});

// 6. Progress Bar & Auto-play next
audio.addEventListener('timeupdate', () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.value = percent || 0;
    
    let mins = Math.floor(audio.currentTime / 60);
    let secs = Math.floor(audio.currentTime % 60);
    document.getElementById('current-time').innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
});

progress.addEventListener('input', () => audio.currentTime = (progress.value / 100) * audio.duration);
audio.addEventListener('ended', () => document.getElementById('next').click());

// Start player
loadSong(songIndex);