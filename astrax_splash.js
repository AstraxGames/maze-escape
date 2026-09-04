// astrax_splash.js
// AstraX Games - Official Cinematic In-Game Splash Screen

(function() {
    const style = document.createElement('style');
    style.innerHTML = `
        /* Main Container */
        #ax-splash-container {
            position: fixed;
            inset: 0;
            width: 100vw;
            height: 100vh;
            background-color: #050508;
            z-index: 999999; /* Sit on top of everything */
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Montserrat', 'Inter', sans-serif;
            transition: opacity 1s ease-in-out;
        }
        
        /* Utility class to fade out the entire splash screen at the end */
        .ax-splash-hidden {
            opacity: 0 !important;
            pointer-events: none;
        }

        /* The stages (Engine -> Studio -> Game Name) */
        .ax-splash-stage {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transform: scale(0.95); /* Start slightly zoomed out */
            transition: opacity 1.2s ease-in-out, transform 5s ease-out;
            pointer-events: none;
        }

        /* When a stage becomes active, it fades in and slowly zooms toward the camera */
        .ax-splash-stage.active {
            opacity: 1;
            transform: scale(1.02);
        }

        /* AX Engine Image Styling */
        .ax-engine-logo {
            width: 350px;
            max-width: 70vw;
            /* Adds a subtle premium glow behind your transparent PNG/WEBP */
            filter: drop-shadow(0px 10px 25px rgba(255, 255, 255, 0.15)); 
        }

        /* Specific typographic styling */
        .ax-studio-text {
            color: #ffffff;
            font-weight: 900;
            font-size: clamp(1.5rem, 4vw, 2.5rem);
            letter-spacing: 0.3em;
            text-transform: uppercase;
            margin: 0;
            margin-top: 1.5rem;
            text-shadow: 0 0 20px rgba(255,255,255,0.1);
        }
        
        .ax-presents-text {
            color: #666666;
            font-weight: 700;
            font-size: clamp(0.6rem, 2vw, 0.85rem);
            letter-spacing: 0.4em;
            text-transform: uppercase;
            margin-bottom: 1.5rem;
        }

        .ax-presents-text-bottom {
            color: #666666;
            font-weight: 700;
            font-size: clamp(0.6rem, 2vw, 0.85rem);
            letter-spacing: 0.4em;
            text-transform: uppercase;
            margin-top: 0.5rem;
        }

        .ax-game-title {
            color: #ffffff;
            font-weight: 900;
            font-size: clamp(2.5rem, 8vw, 5rem);
            letter-spacing: 0.2em;
            text-transform: uppercase;
            text-align: center;
            margin: 0;
            text-shadow: 0 0 30px rgba(34, 211, 238, 0.4); /* Cyan glow behind game name */
        }
    `;
    document.head.appendChild(style);

    const splashContainer = document.createElement('div');
    splashContainer.id = 'ax-splash-container';
    
    splashContainer.innerHTML = `
        <!-- Stage 1: The Engine Logo -->
        <div id="ax-stage-1" class="ax-splash-stage">
            <p class="ax-presents-text">Powered By</p>
            <img src="images/AX_LOGO.webp" alt="AX Engine" class="ax-engine-logo">
        </div>

        <!-- Stage 2: The Studio Logo -->
        <div id="ax-stage-2" class="ax-splash-stage">
            <svg width="140" height="140" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="256" cy="256" rx="200" ry="80" fill="none" stroke="#22d3ee" stroke-width="12" transform="rotate(-30 256 256)"/>
                <path d="M 256 120 L 150 400 L 210 400 L 230 340 L 280 340 L 300 400 L 360 400 Z" fill="#ffffff"/>
                <polygon points="256,220 276,280 336,256 276,266 256,326 236,266 176,256 236,280" fill="#22d3ee"/>
            </svg>
            <h1 class="ax-studio-text">AstraX <span style="color: #22d3ee;">Games</span></h1>
            <p class="ax-presents-text-bottom">Presents</p>
        </div>

        <!-- Stage 3: The Game Title -->
        <div id="ax-stage-3" class="ax-splash-stage">
            <h1 class="ax-game-title">Maze Escape</h1>
        </div>
    `;
    
    // Wait for the window to load so it sits on top of the game canvas
    window.addEventListener('load', () => {
        document.body.appendChild(splashContainer);

        // --- The 3-Stage Cinematic Timeline ---
        
        // 0.5s: Fade in AX Engine Logo
        setTimeout(() => { document.getElementById('ax-stage-1').classList.add('active'); }, 500);
        // 3.0s: Fade out AX Engine Logo
        setTimeout(() => { document.getElementById('ax-stage-1').classList.remove('active'); }, 3000);

        // 4.0s: Fade in AstraX Games Studio
        setTimeout(() => { document.getElementById('ax-stage-2').classList.add('active'); }, 4000);
        // 6.5s: Fade out AstraX Games Studio
        setTimeout(() => { document.getElementById('ax-stage-2').classList.remove('active'); }, 6500);

        // 7.5s: Fade in "Maze Escape"
        setTimeout(() => { document.getElementById('ax-stage-3').classList.add('active'); }, 7500);
        // 10.0s: Fade out "Maze Escape"
        setTimeout(() => { document.getElementById('ax-stage-3').classList.remove('active'); }, 10000);
        
        // 11.0s: Fade out the entire black screen, revealing the game underneath!
        setTimeout(() => { 
            splashContainer.classList.add('ax-splash-hidden'); 
            
            // Remove it completely from the DOM after it fades out so it doesn't block clicks
            setTimeout(() => { 
                splashContainer.remove(); 
            }, 1000);
        }, 11000);
    });
})();