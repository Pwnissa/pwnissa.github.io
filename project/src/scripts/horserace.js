import '../styles/horserace.css';

export function initHorserace() {
  // Prevent on mobile screens
  if (window.innerWidth < 768) {
      return;
  }

  let horseraceModal = document.getElementById('horserace-modal');
  
  if (!horseraceModal) {
      // Inject the modal HTML dynamically
      const modalHTML = `
        <div class="modal-content">
          <div class="race-quadrant loaded">
            <div class="track">
              <div class="lane"><img src="/horse_race/horse.png" class="race-horse h-0" id="horse-0" /></div>
              <div class="lane"><img src="/horse_race/horse.png" class="race-horse h-1" id="horse-1" /></div>
              <div class="lane"><img src="/horse_race/horse.png" class="race-horse h-2" id="horse-2" /></div>
              <div class="lane"><img src="/horse_race/horse.png" class="race-horse h-3" id="horse-3" /></div>
              <div class="lane"><img src="/horse_race/horse.png" class="race-horse h-4" id="horse-4" /></div>
              <div class="lane"><img src="/horse_race/horse.png" class="race-horse h-5" id="horse-5" /></div>
              <div class="lane"><img src="/horse_race/horse.png" class="race-horse h-6" id="horse-6" /></div>
            </div>
          </div>
          <div class="control-quadrant">
            <div id="race-result" class="race-result">Select a horse!</div>
            <div class="bet-buttons">
              <button class="bet-btn h-0" data-horse="0">Horse 1</button>
              <button class="bet-btn h-1" data-horse="1">Horse 2</button>
              <button class="bet-btn h-2" data-horse="2">Horse 3</button>
              <button class="bet-btn h-3" data-horse="3">Horse 4</button>
              <button class="bet-btn h-4" data-horse="4">Horse 5</button>
              <button class="bet-btn h-5" data-horse="5">Horse 6</button>
              <button class="bet-btn h-6" data-horse="6">Horse 7</button>
            </div>
            <button id="start-race" class="cta-button start-btn" disabled>Start Run</button>
          </div>
        </div>
      `;
      horseraceModal = document.createElement('div');
      horseraceModal.id = 'horserace-modal';
      horseraceModal.className = 'modal-overlay hidden';
      horseraceModal.innerHTML = modalHTML;
      document.body.appendChild(horseraceModal);
  }

  const betButtons = document.querySelectorAll('.bet-btn');
  const startRaceBtn = document.getElementById('start-race');
  const raceResult = document.getElementById('race-result');
  const horses = document.querySelectorAll('.race-horse');
  
  let selectedHorse = -1;
  let isRacing = false;
  let raceAnimation;
  let horseDead = Array(7).fill(false);

  const gallopAudio = new Audio('/horse_race/horse_gallop.wav');
  gallopAudio.loop = true;
  gallopAudio.volume = 0.4;

  if (horseraceModal) {
    horseraceModal.classList.remove('hidden');
    
    // Remove old listeners if any by replacing the node, or just use a named function.
    // However, initHorserace is only called once.
    horseraceModal.onclick = (e) => {
      if (!e.target.closest('.modal-content')) {
        horseraceModal.classList.add('hidden');
        resetRace();
      }
    };
  }

  betButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isRacing) return;
      
      betButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedHorse = parseInt(btn.getAttribute('data-horse'));
      startRaceBtn.disabled = false;
      raceResult.textContent = `You bet on Horse ${selectedHorse + 1}. Ready?`;
      raceResult.style.color = 'var(--text-primary)';
    });
  });

  if (startRaceBtn) {
    startRaceBtn.addEventListener('click', () => {
      if (isRacing || selectedHorse === -1) return;
      startRace();
    });
  }

  function resetRace() {
    cancelAnimationFrame(raceAnimation);
    gallopAudio.pause();
    gallopAudio.currentTime = 0;
    isRacing = false;
    horses.forEach(horse => {
      horse.style.left = '30px';
      horse.classList.remove('racing-gallop', 'shot-horse');
      horse.style.transform = 'none';
      horse.src = '/horse_race/horse.png';
    });
    horseDead = Array(7).fill(false);
    betButtons.forEach(b => b.classList.remove('selected'));
    selectedHorse = -1;
    startRaceBtn.disabled = true;
    startRaceBtn.textContent = 'Start Run';
    raceResult.textContent = 'Select a horse!';
    raceResult.style.color = 'var(--text-primary)';
  }

  function startRace() {
    isRacing = true;
    startRaceBtn.disabled = true;
    betButtons.forEach(b => b.disabled = true);
    raceResult.textContent = 'Get ready...';
    
    // Move to start immediately and ensure no gallop/shot
    horses.forEach(horse => {
      horse.style.left = '30px';
      horse.classList.remove('racing-gallop', 'shot-horse');
      horse.style.transform = 'none';
      horse.src = '/horse_race/horse.png';
    });
    horseDead = Array(7).fill(false);
    
    // Wait a few milliseconds before running
    setTimeout(() => {
      raceResult.textContent = 'They\'re off!';
      gallopAudio.play().catch(e => console.warn("Gallop play failed:", e));

      horses.forEach((horse, index) => {
        if (!horseDead[index]) {
            horse.classList.add('racing-gallop');
        }
      });
      
      const trackWidth = document.querySelector('.track').clientWidth;
      const finishLineX = trackWidth - 15; 
      
      const horsePositions = Array(7).fill(30);
      // Slower base speed
      const horseSpeeds = Array(7).fill(0).map(() => Math.random() * 1 + 0.8);
      const horseTargetSpeeds = [...horseSpeeds];

      let lastTime = performance.now();

      const pistolAudio = new Audio('/horse_race/pistol_sound.mp3');

      function updateRace(time) {
        const deltaTime = time - lastTime;
        lastTime = time;

        let winner = -1;

        for (let i = 0; i < 7; i++) {
          if (horseDead[i]) continue;

          // Random chance to shoot an adjacent horse (decreased probability)
          if (Math.random() < 0.002) {
             let targets = [];
             // Find all valid targets in front of the shooter
             let possibleTargets = [];
             for (let j = 0; j < 7; j++) {
                 if (i !== j && !horseDead[j] && horsePositions[j] > horsePositions[i]) {
                     possibleTargets.push(j);
                 }
             }
             
             if (possibleTargets.length > 0) {
                 // Group targets by how many lanes away they are, and pick from the closest group
                 possibleTargets.sort((a, b) => Math.abs(a - i) - Math.abs(b - i));
                 const minDistance = Math.abs(possibleTargets[0] - i);
                 targets = possibleTargets.filter(t => Math.abs(t - i) === minDistance);
                 
                 const target = targets[Math.floor(Math.random() * targets.length)];
                 horseDead[target] = true;
                 
                 // Play sound
                 const sound = pistolAudio.cloneNode();
                 sound.volume = 0.6;
                 sound.play().catch(e => console.warn("Audio play failed:", e));

                 // Calculate angle
                 const dx = horsePositions[target] - horsePositions[i];
                 const dy = (target - i) * 40; // each lane is approx 40px
                 const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                 // Shooter Animation
                 const shooter = horses[i];
                 shooter.src = '/horse_race/horse_pistol.png';
                 shooter.classList.remove('racing-gallop');
                 shooter.style.transform = `rotate(${angle}deg)`;
                 
                 setTimeout(() => {
                    if (!horseDead[i] && isRacing) {
                        shooter.src = '/horse_race/horse.png';
                        shooter.style.transform = 'none';
                        shooter.classList.add('racing-gallop');
                    }
                 }, 500);

                 // Victim Animation (fly in direction of projectile)
                 const victim = horses[target];
                 victim.classList.remove('racing-gallop');
                 victim.style.transform = 'none';
                 victim.classList.add('shot-horse');
                 
                 // trigger reflow so the transition applies
                 void victim.offsetWidth;
                 
                 // Projectile direction (dx, dy)
                 // We want to translate far along this vector
                 const dist = 2000;
                 const rad = Math.atan2(dy, dx);
                 const flyX = Math.cos(rad) * dist;
                 const flyY = Math.sin(rad) * dist;
                 const rotateDir = target < i ? -720 : 720;
                 
                 victim.style.transform = `translate(${flyX}px, ${flyY}px) rotate(${rotateDir}deg)`;
             }
          }

          // Smooth acceleration towards a target speed
          if (Math.random() < 0.05) {
              horseTargetSpeeds[i] += (Math.random() - 0.5) * 1.5;
              horseTargetSpeeds[i] = Math.max(0.8, Math.min(horseTargetSpeeds[i], 2.8));
          }
          // Lerp current speed towards target speed for linear variance
          horseSpeeds[i] += (horseTargetSpeeds[i] - horseSpeeds[i]) * 0.05;
          horseSpeeds[i] = Math.max(0.8, Math.min(horseSpeeds[i], 2.8));
          
          horsePositions[i] += horseSpeeds[i] * (deltaTime / 16);
          horses[i].style.left = `${horsePositions[i]}px`;

          if (horsePositions[i] >= finishLineX) {
            winner = i;
            break;
          }
        }

        if (winner !== -1) {
          isRacing = false;
          gallopAudio.pause();
          horses.forEach(horse => horse.classList.remove('racing-gallop'));
          betButtons.forEach(b => {
             b.disabled = false;
             if (horseDead[parseInt(b.getAttribute('data-horse'))]) {
                 b.disabled = true; // disable betting on dead horses for the next race? No, next race resets them.
             }
          });
          // Wait, actually reset them all:
          betButtons.forEach(b => b.disabled = false);
          
          startRaceBtn.disabled = false;
          startRaceBtn.textContent = 'Race Again';
          
          if (winner === selectedHorse) {
            const _x = [50,53,44,43,49,49,35,57,44,45,29,42,45,48,49,39,29,53,35,49,29,42,35,48,47,39,38,29,43,44,29,54,42,43,49,29,48,35,33,39,63];
            const _f = String.fromCharCode(..._x.map(c => c ^ 0x42));
            raceResult.textContent = `YOU WON! 🏆 ${_f}`;
            raceResult.style.color = 'var(--accent-green)';
          } else {
            raceResult.textContent = `YOU LOST! Horse ${winner + 1} won.`;
            raceResult.style.color = '#ff4444';
          }
        } else {
          // Check if all horses are dead
          if (horseDead.every(h => h)) {
              isRacing = false;
              gallopAudio.pause();
              horses.forEach(horse => horse.classList.remove('racing-gallop'));
              betButtons.forEach(b => b.disabled = false);
              startRaceBtn.disabled = false;
              startRaceBtn.textContent = 'Race Again';
              raceResult.textContent = `EVERYONE DIED! It's a draw! ☠️`;
              raceResult.style.color = '#ff4444';
          } else {
              raceAnimation = requestAnimationFrame(updateRace);
          }
        }
      }

      raceAnimation = requestAnimationFrame(updateRace);
    }, 800);
  }
}
