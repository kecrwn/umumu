// Fun Elements Interactive JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initDiscoBall();
    initMusicPlayer();
    initGameController();
    initMemoryCharms();
    initYinYang();
    initBasketball();
    initModal();
});

// Disco Ball Memory Revealer
function initDiscoBall() {
    const discoBall = document.getElementById('discoBall');
    const discoSquares = document.querySelectorAll('.disco-square');
    
    discoSquares.forEach((square, index) => {
        square.addEventListener('click', () => {
            const memory = square.getAttribute('data-memory');
            showModal(`
                <h3>✨ Memory ${index + 1}</h3>
                <p>${memory}</p>
            `);
            
            // Add sparkly effect
            createSparkles(square);
        });
    });
}

// Card Music Player
function initMusicPlayer() {
    const playPauseBtn = $('.play-pause-btn');
    const previousBtn = $('.previous-btn');
    const nextBtn = $('.next-btn');
    const shuffleBtn = $('.shuffle-btn');
    const volumeBtn = $('.volume-btn');
    const playlistBtn = $('.playlist-btn');
    const addBtn = $('.add-btn');
    const progressTrack = $('.progress-track');
    const progressFill = $('.progress-fill');
    const progressThumb = $('.progress-thumb');
    const currentTimeDisplay = $('.current-time');
    const remainingTimeDisplay = $('.remaining-time');
    const visualizerBars = $('.visualizer-bars');
    const songTitle = $('.song-title');
    const songArtist = $('.song-artist');
    
    let isPlaying = false;
    let currentSongIndex = 0;
    let isShuffleEnabled = false;
    let audio = null;
    
    // Music files and covers
    const musicFiles = [
        'ms/Often.m4a',
        'ms/Sabse Pehle Hai Pyaar.m4a', 
        'ms/style.m4a'
    ];
    
    // Cover images for random assignment
    const coverImages = [
        'msc/cover1.jpg',
        'msc/cover2.jpg',
        'msc/cover3.jpg',
        'msc/cover4.jpg',
        'msc/cover5.jpg',
        'msc/cover6.jpg'
    ];
    
    // Songs data
    const songs = [
        {
            title: "Often",
            artist: "The Weeknd",
            file: musicFiles[0],
            duration: 186 // seconds
        },
        {
            title: "Sabse Pehle Hai Pyaar",
            artist: "Bollywood Classics", 
            file: musicFiles[1],
            duration: 241
        },
        {
            title: "Style",
            artist: "Taylor Swift",
            file: musicFiles[2],
            duration: 198
        }
    ];
    
    // Initialize audio
    function initAudio() {
        if (!audio) {
            audio = new Audio();
            audio.crossOrigin = "anonymous";
        }
        return audio;
    }
    
    // Play/Pause button
    if (playPauseBtn.length) {
        playPauseBtn.on('click', async () => {
            isPlaying = !isPlaying;
            
            if (isPlaying) {
                playPauseBtn.find('i').removeClass('fa-play').addClass('fa-pause');
                visualizerBars.addClass('playing');
                
                // Try to play actual audio file
                initAudio();
                if (audio.src && audio.src !== window.location.href) {
                    try {
                        await audio.play();
                        // If real audio is playing, stop demo
                        if (demoInterval) {
                            clearInterval(demoInterval);
                            demoInterval = null;
                        }
                    } catch (error) {
                        console.log('Audio play failed, using demo mode:', error);
                        startDemoPlayback();
                    }
                } else {
                    startDemoPlayback();
                }
            } else {
                playPauseBtn.find('i').removeClass('fa-pause').addClass('fa-play');
                visualizerBars.removeClass('playing');
                if (audio) audio.pause();
                if (demoInterval) {
                    clearInterval(demoInterval);
                    demoInterval = null;
                }
            }
        });
    }
    
    // Demo playback simulation
    let demoInterval = null;
    function startDemoPlayback() {
        let currentTime = 0;
        const duration = songs[currentSongIndex].duration;
        
        demoInterval = setInterval(() => {
            currentTime++;
            updateProgress(currentTime, duration);
            
            if (currentTime >= duration) {
                clearInterval(demoInterval);
                nextTrack();
            }
        }, 1000);
    }
    
    // Next track
    function nextTrack() {
        if (demoInterval) clearInterval(demoInterval);
        currentSongIndex = isShuffleEnabled ? 
            Math.floor(Math.random() * songs.length) :
            (currentSongIndex + 1) % songs.length;
        updateTrackDisplay();
        
        if (isPlaying) {
            setTimeout(() => {
                playPauseBtn.trigger('click');
            }, 500);
        }
    }
    
    // Previous track  
    function previousTrack() {
        if (demoInterval) clearInterval(demoInterval);
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        updateTrackDisplay();
        
        if (isPlaying) {
            setTimeout(() => {
                playPauseBtn.trigger('click');
            }, 500);
        }
    }
    
    // Update track display
    function updateTrackDisplay() {
        const song = songs[currentSongIndex];
        songTitle.text(song.title);
        songArtist.text(song.artist);
        currentTimeDisplay.text('0:00');
        remainingTimeDisplay.text('-' + formatTime(song.duration));
        progressFill.css('width', '0%');
        progressThumb.css('left', '0%');
        
        // Randomly assign a cover image
        const randomCover = coverImages[Math.floor(Math.random() * coverImages.length)];
        console.log('Setting cover image:', randomCover); // Debug log
        $('.artwork-image').css({
            'background-image': `url('${randomCover}')`,
            'background-size': 'cover',
            'background-position': 'center',
            'background-repeat': 'no-repeat'
        });
        
        // Load audio file if exists
        if (song.file) {
            initAudio();
            audio.src = song.file;
            audio.load();
        }
    }
    
    // Update progress
    function updateProgress(current, total) {
        const percentage = (current / total) * 100;
        progressFill.css('width', percentage + '%');
        progressThumb.css('left', percentage + '%');
        currentTimeDisplay.text(formatTime(current));
        remainingTimeDisplay.text('-' + formatTime(total - current));
    }
    
    // Format time
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Next button
    if (nextBtn.length) {
        nextBtn.on('click', nextTrack);
    }
    
    // Previous button
    if (previousBtn.length) {
        previousBtn.on('click', previousTrack);
    }
    
    // Shuffle button
    if (shuffleBtn.length) {
        shuffleBtn.on('click', function() {
            isShuffleEnabled = !isShuffleEnabled;
            $(this).toggleClass('active', isShuffleEnabled);
            $(this).css('color', isShuffleEnabled ? '#78ff78' : 'white');
            console.log('Shuffle:', isShuffleEnabled ? 'ON' : 'OFF');
        });
    }
    
    // Volume button (improved functionality)
    if (volumeBtn.length) {
        volumeBtn.on('click', function() {
            // Create a simple volume control modal
            const volumeModal = `
                <div style="text-align: center; padding: 20px;">
                    <h3 style="color: #E6A5A3; font-family: 'Playfair Display', serif;">🔊 Volume Control</h3>
                    <div style="margin: 20px 0;">
                        <input type="range" id="volumeSlider" min="0" max="100" value="70" 
                               style="width: 80%; margin: 10px;">
                        <div style="color: #5D4C4B; margin: 10px 0;">Volume: <span id="volumeValue">70</span>%</div>
                    </div>
                    <p style="color: #5D4C4B; font-family: 'Libre Baskerville', serif;">Adjust your device volume for the best experience! 🎵</p>
                </div>
            `;
            
            showModal(volumeModal);
            
            // Add slider functionality after modal is shown
            setTimeout(() => {
                const slider = document.getElementById('volumeSlider');
                const value = document.getElementById('volumeValue');
                if (slider && value) {
                    slider.addEventListener('input', (e) => {
                        value.textContent = e.target.value;
                        if (audio) {
                            audio.volume = e.target.value / 100;
                        }
                    });
                }
            }, 100);
        });
    }
    
    // Playlist button (placeholder with song list)
    if (playlistBtn.length) {
        playlistBtn.on('click', function() {
            const songList = songs.map((song, index) => 
                `<div style="padding: 10px; margin: 5px; background: ${index === currentSongIndex ? '#E6A5A3' : '#f0f0f0'}; border-radius: 8px; color: ${index === currentSongIndex ? 'white' : '#333'};">
                    ${index + 1}. ${song.title} - ${song.artist}
                </div>`
            ).join('');
            
            showModal(`
                <div style="text-align: center; padding: 20px;">
                    <h3 style="color: #E6A5A3; font-family: 'Playfair Display', serif;">🎵 Our Playlist</h3>
                    <div style="max-height: 300px; overflow-y: auto; margin: 20px 0;">
                        ${songList}
                    </div>
                </div>
            `);
        });
    }
    
    // Add button (placeholder with feedback)
    if (addBtn.length) {
        addBtn.on('click', function() {
            const currentSong = songs[currentSongIndex];
            showModal(`
                <div style="text-align: center; padding: 20px;">
                    <h3 style="color: #E6A5A3; font-family: 'Playfair Display', serif;">➕ Add to Playlist</h3>
                    <p style="margin: 20px 0; color: #5D4C4B; font-family: 'Libre Baskerville', serif;">"${currentSong.title}" added to your favorites! 💖</p>
                    <p style="color: #5D4C4B; font-size: 14px;">This feature will be enhanced soon!</p>
                </div>
            `);
        });
    }
    
    // Progress bar interaction
    if (progressTrack.length) {
        progressTrack.on('click', function(e) {
            if (demoInterval) clearInterval(demoInterval);
            
            const rect = this.getBoundingClientRect();
            const percentage = (e.clientX - rect.left) / rect.width;
            const duration = songs[currentSongIndex].duration;
            const newTime = Math.floor(percentage * duration);
            
            updateProgress(newTime, duration);
            
            if (isPlaying) {
                // Resume demo playback from new position
                setTimeout(() => {
                    let remainingTime = duration - newTime;
                    demoInterval = setInterval(() => {
                        newTime++;
                        updateProgress(newTime, duration);
                        
                        if (newTime >= duration) {
                            clearInterval(demoInterval);
                            nextTrack();
                        }
                    }, 1000);
                }, 100);
            }
        });
    }
    
    // Keyboard shortcuts
    $(document).on('keydown', function(e) {
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
            playPauseBtn.trigger('click');
        } else if (e.code === 'ArrowRight') {
            e.preventDefault();
            nextTrack();
        } else if (e.code === 'ArrowLeft') {
            e.preventDefault();
            previousTrack();
        }
    });
    
    // Audio event listeners
    if (audio) {
        audio.addEventListener('ended', function() {
            nextTrack();
        });
        
        audio.addEventListener('timeupdate', function() {
            if (audio && !audio.paused) {
                const currentTime = Math.floor(audio.currentTime);
                const duration = Math.floor(audio.duration || songs[currentSongIndex].duration);
                updateProgress(currentTime, duration);
            }
        });
    }
    
    // Initialize
    console.log('Music player initialized with', songs.length, 'songs');
    updateTrackDisplay();
    
    // Ensure cover image loads immediately
    setTimeout(() => {
        updateTrackDisplay();
    }, 100);
}
// Game Controller Navigation
function initGameController() {
    const dpadButtons = document.querySelectorAll('.dpad-up, .dpad-right, .dpad-down, .dpad-left');
    const achievementButtons = document.querySelectorAll('.btn-circle');
    const achievementDisplay = document.getElementById('achievementDisplay');
    
    const levelDescriptions = {
        'first-date': 'The day we met...',
        'first-kiss': 'That magical moment...',
        'first-trip': 'Our first adventure together...',
        'today': 'Every day with you is perfect!'
    };
    
    const achievements = {
        'love': '🏆 Achievement Unlocked: True Love!',
        'memories': '🏆 Achievement Unlocked: Photo Keeper!',
        'future': '🏆 Achievement Unlocked: Dream Chaser!',
        'fun': '🏆 Achievement Unlocked: Fun Squad!'
    };
    
    dpadButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.getAttribute('data-level');
            const description = levelDescriptions[level];
            updateAchievementDisplay(`
                <h3>🎮 Level: ${level.replace('-', ' ').toUpperCase()}</h3>
                <p>${description}</p>
            `);
            createControllerEffect(btn);
        });
    });
    
    achievementButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const achievement = btn.getAttribute('data-achievement');
            const message = achievements[achievement];
            updateAchievementDisplay(`
                <h3>${message}</h3>
                <p>Keep building our beautiful story together!</p>
            `);
            createButtonBurst(btn);
        });
    });
    
    function updateAchievementDisplay(content) {
        const textElement = achievementDisplay.querySelector('.achievement-text');
        textElement.innerHTML = content;
    }
    
    function createControllerEffect(btn) {
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 200);
    }
    
    function createButtonBurst(btn) {
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const burst = document.createElement('div');
                burst.innerHTML = '✨';
                burst.style.cssText = `
                    position: absolute;
                    font-size: 16px;
                    pointer-events: none;
                    z-index: 100;
                    animation: burstFloat 1s ease-out forwards;
                `;
                
                const rect = btn.getBoundingClientRect();
                burst.style.left = (rect.left + rect.width / 2) + 'px';
                burst.style.top = (rect.top + rect.height / 2) + 'px';
                
                document.body.appendChild(burst);
                
                setTimeout(() => document.body.removeChild(burst), 1000);
            }, i * 100);
        }
    }
}

// Memory Charms Interactive
function initMemoryCharms() {
    const charms = document.querySelectorAll('.charm');
    const charmInfo = document.getElementById('charmInfo');
    const infoText = charmInfo.querySelector('.info-text');
    
    charms.forEach(charm => {
        charm.addEventListener('click', () => {
            const memory = charm.getAttribute('data-memory');
            const charmName = charm.getAttribute('data-charm');
            
            infoText.textContent = memory;
            charmInfo.style.background = 'linear-gradient(135deg, #E6A5A3, #FBEFEE)';
            infoText.style.color = 'white';
            
            // Animate the charm
            charm.style.transform = 'scale(1.5) rotate(360deg)';
            setTimeout(() => {
                charm.style.transform = '';
            }, 500);
            
            // Create heart burst
            createHeartBurst(charm);
            
            // Reset after 5 seconds
            setTimeout(() => {
                charmInfo.style.background = '';
                infoText.style.color = '';
                infoText.textContent = 'Click any charm to see our special memory!';
            }, 5000);
        });
    });
}

// Yin-Yang Balance Section
function initYinYang() {
    const yinYang = document.getElementById('yinYang');
    const factCards = document.querySelectorAll('.fact-card');
    
    yinYang.addEventListener('click', () => {
        // Spin and change colors
        yinYang.style.transform = 'scale(1.2) rotate(360deg)';
        
        setTimeout(() => {
            yinYang.style.transform = 'scale(1) rotate(0deg)';
            revealRandomFact();
        }, 1000);
    });
    
    factCards.forEach(card => {
        card.addEventListener('click', () => {
            const fact = card.getAttribute('data-fact');
            showModal(`
                <h3>💫 How We Complete Each Other</h3>
                <p>${card.querySelector('.fact-text').textContent}</p>
                <p><em>This is what makes our relationship special - we're perfectly balanced!</em></p>
            `);
        });
    });
    
    function revealRandomFact() {
        const randomCard = factCards[Math.floor(Math.random() * factCards.length)];
        randomCard.style.transform = 'scale(1.05)';
        randomCard.style.boxShadow = '0 12px 32px rgba(230, 165, 163, 0.3)';
        
        setTimeout(() => {
            randomCard.style.transform = '';
            randomCard.style.boxShadow = '';
        }, 2000);
    }
}

// Update wish count display


// Basketball Footer Animation
function initBasketball() {
    const basketball = document.getElementById('basketball');
    
    basketball.addEventListener('click', () => {
        // Bounce animation
        basketball.style.animation = 'none';
        basketball.offsetHeight; // Trigger reflow
        basketball.style.animation = 'basketballBounce 0.6s ease-in-out';
        
        // Show fun message
        showModal(`
            <h3>🏀 We Score Together!</h3>
            <p>Every day with you feels like a winning shot!</p>
            <p>Final Score: Love = ∞ | Happiness = ∞ | Smiles = ∞</p>
        `);
    });
}

// Modal System
function initModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    
    modalClose.addEventListener('click', hideModal);
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            hideModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideModal();
        }
    });
}

function showModal(content) {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = content;
    modalOverlay.classList.add('show');
}

function hideModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.remove('show');
}

// Wish Modal


// Utility Functions
function createSparkles(element) {
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.cssText = `
                position: fixed;
                font-size: 20px;
                pointer-events: none;
                z-index: 1000;
                animation: sparkleFloat 1.5s ease-out forwards;
            `;
            
            const rect = element.getBoundingClientRect();
            sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
            sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => document.body.removeChild(sparkle), 1500);
        }, i * 100);
    }
}

function createHeartBurst(element) {
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '💖';
            heart.style.cssText = `
                position: fixed;
                font-size: 24px;
                pointer-events: none;
                z-index: 1000;
                animation: heartFloat 2s ease-out forwards;
            `;
            
            const rect = element.getBoundingClientRect();
            heart.style.left = (rect.left + rect.width / 2) + 'px';
            heart.style.top = (rect.top + rect.height / 2) + 'px';
            
            document.body.appendChild(heart);
            
            setTimeout(() => document.body.removeChild(heart), 2000);
        }, i * 150);
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleFloat {
        0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px) rotate(180deg) scale(1.5);
        }
    }
    
    @keyframes heartFloat {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.2);
        }
    }
    
    .track-item.active {
        border-color: #E6A5A3 !important;
        background: linear-gradient(135deg, #FBEFEE, #FFFFFF) !important;
    }
    
    .track-item.active .track-title {
        color: #E6A5A3 !important;
    }
`;
document.head.appendChild(style);