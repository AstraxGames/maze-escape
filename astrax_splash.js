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
            z-index: 999999; 
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Montserrat', 'Inter', sans-serif;
            transition: opacity 1s ease-in-out;
        }
        
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
            transform: scale(0.95); 
            transition: opacity 1.2s ease-in-out, transform 5s ease-out;
            pointer-events: none;
            padding: 2rem;
            text-align: center;
        }

        .ax-splash-stage.active {
            opacity: 1;
            transform: scale(1.02);
        }

        /* --- THE FIX: NO ZOOM FOR THE WARNING SCREEN --- */
        #ax-stage-0 {
            transform: none !important; /* Force it to stay still */
            transition: opacity 1s ease-in-out !important; /* Only fade, no zoom */
        }
        #ax-stage-0.active {
            transform: none !important; /* Keep it still when active */
        }

        /* --- STAGE 0: LEGAL & WARNING STYLES --- */
        .ax-warning-title {
            color: #ef4444; 
            font-weight: 900; 
            letter-spacing: 0.3em; 
            text-transform: uppercase; 
            font-size: clamp(1rem, 3vw, 1.2rem); 
            margin-bottom: 1.5rem; 
            text-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
        }
        .ax-warning-text {
            color: #9ca3af; 
            font-weight: 700; 
            font-size: clamp(0.6rem, 2vw, 0.75rem); 
            line-height: 2; 
            letter-spacing: 0.1em; 
            text-transform: uppercase;
            max-width: 48rem;
            margin-bottom: 3rem;
        }
        .ax-legal-footer p {
            color: #4b5563; 
            font-weight: 700; 
            font-size: 0.6rem; 
            letter-spacing: 0.2em; 
            text-transform: uppercase; 
            margin: 0.4rem 0;
        }

        /* --- STAGE 1, 2, 3: STUDIO STYLES --- */
        .ax-engine-logo {
            width: 350px;
            max-width: 70vw;
            filter: drop-shadow(0px 10px 25px rgba(255, 255, 255, 0.15)); 
        }
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
        .ax-presents-text, .ax-presents-text-bottom {
            color: #666666;
            font-weight: 700;
            font-size: clamp(0.6rem, 2vw, 0.85rem);
            letter-spacing: 0.4em;
            text-transform: uppercase;
        }
        .ax-presents-text { margin-bottom: 1.5rem; }
        .ax-presents-text-bottom { margin-top: 0.5rem; }
        
        .ax-game-title {
            color: #ffffff;
            font-weight: 900;
            font-size: clamp(2.5rem, 8vw, 5rem);
            letter-spacing: 0.2em;
            text-transform: uppercase;
            text-align: center;
            margin: 0;
            text-shadow: 0 0 30px rgba(34, 211, 238, 0.4); 
        }
    `;
    document.head.appendChild(style);

    const splashContainer = document.createElement('div');
    splashContainer.id = 'ax-splash-container';
    
    splashContainer.innerHTML = `
        <!-- Stage 0: Legal & Seizure Warning (Static, No Zoom) -->
        <div id="ax-stage-0" class="ax-splash-stage">
            <h2 class="ax-warning-title">Photosensitivity / Seizure Warning</h2>
            <p class="ax-warning-text">
                A very small percentage of individuals may experience epileptic seizures when exposed to certain light patterns or flashing lights. Exposure to certain patterns or backgrounds on a computer screen, or while playing video games, may induce an epileptic seizure in these individuals. If you, or anyone in your family, have an epileptic condition, consult your physician prior to playing.
            </p>
            <div class="ax-legal-footer" style="padding-top: 2rem; border-top: 1px solid rgba(31, 41, 55, 0.5); width: 100%; max-width: 48rem;">
                <p>Powered by AX-Engine</p>
                <p>© 2026 AstraX Games Studio. All Rights Reserved.</p>
                <p style="color: #374151; font-size: 0.5rem; margin-top: 1rem;">Unauthorized duplication, distribution, or reverse engineering is strictly prohibited.</p>
            </div>
        </div>

        <!-- Stage 1: The Engine Logo (Cinematic Zoom) -->
        <div id="ax-stage-1" class="ax-splash-stage">
            <p class="ax-presents-text">Powered By</p>
            <img src="images/AX_LOGO.webp" alt="AX Engine" class="ax-engine-logo">
        </div>

        <!-- Stage 2: The Studio Logo (Cinematic Zoom) -->
        <div id="ax-stage-2" class="ax-splash-stage">
            <svg width="140" height="140" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="256" cy="256" rx="200" ry="80" fill="none" stroke="#22d3ee" stroke-width="12" transform="rotate(-30 256 256)"/>
                <path d="M 256 120 L 150 400 L 210 400 L 230 340 L 280 340 L 300 400 L 360 400 Z" fill="#ffffff"/>
                <polygon points="256,220 276,280 336,256 276,266 256,326 236,266 176,256 236,280" fill="#22d3ee"/>
            </svg>
            <h1 class="ax-studio-text">AstraX <span style="color: #22d3ee;">Games</span></h1>
            <p class="ax-presents-text-bottom">Presents</p>
        </div>

        <!-- Stage 3: The Game Title (Cinematic Zoom) -->
        <div id="ax-stage-3" class="ax-splash-stage">
            <h1 class="ax-game-title">Maze Escape</h1>
        </div>
    `;
    
    window.addEventListener('load', () => {
        document.body.appendChild(splashContainer);

        // Stage 0 (0.5s to 5.5s): Legal Warning (Static)
        setTimeout(() => { document.getElementById('ax-stage-0').classList.add('active'); }, 500);
        setTimeout(() => { document.getElementById('ax-stage-0').classList.remove('active'); }, 5500);

        // Stage 1 (6.5s to 9.0s): AX Engine
        setTimeout(() => { document.getElementById('ax-stage-1').classList.add('active'); }, 6500);
        setTimeout(() => { document.getElementById('ax-stage-1').classList.remove('active'); }, 9000);

        // Stage 2 (10.0s to 12.5s): AstraX Games
        setTimeout(() => { document.getElementById('ax-stage-2').classList.add('active'); }, 10000);
        setTimeout(() => { document.getElementById('ax-stage-2').classList.remove('active'); }, 12500);

        // Stage 3 (13.5s to 16.0s): Maze Escape
        setTimeout(() => { document.getElementById('ax-stage-3').classList.add('active'); }, 13500);
        setTimeout(() => { document.getElementById('ax-stage-3').classList.remove('active'); }, 16000);
        
        // Final Exit (17.0s)
        setTimeout(() => { 
            splashContainer.classList.add('ax-splash-hidden'); 
            setTimeout(() => { splashContainer.remove(); }, 1000);
        }, 17000);
    });
})();