/**
 * BVVSP SPORTS ARENA - Interactive Gateway Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // Target Sports Arena URL
    const TARGET_URL = 'https://bvvs-sports-arena.vercel.app/';

    // Elements
    const enterBtn = document.getElementById('enter-arena-btn');
    const warpOverlay = document.getElementById('warp-overlay');
    const sportsPills = document.querySelectorAll('.sports-pills .pill');
    const featureCards = document.querySelectorAll('.feature-card');
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    // -------------------------------------------------------------
    // 1. Audio Synthesizer via Web Audio API (No external sound files needed)
    // -------------------------------------------------------------
    let audioCtx = null;

    function playSound(type) {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const now = audioCtx.currentTime;

            if (type === 'hover') {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(320, now);
                osc.frequency.exponentialRampToValueAtTime(540, now + 0.08);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.08);
            } else if (type === 'enter') {
                // High energy power surge sound effect
                const osc1 = audioCtx.createOscillator();
                const osc2 = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc1.type = 'sawtooth';
                osc2.type = 'sine';

                osc1.frequency.setValueAtTime(140, now);
                osc1.frequency.exponentialRampToValueAtTime(880, now + 0.5);

                osc2.frequency.setValueAtTime(70, now);
                osc2.frequency.exponentialRampToValueAtTime(440, now + 0.5);

                gain.gain.setValueAtTime(0.12, now);
                gain.gain.linearRampToValueAtTime(0.18, now + 0.25);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

                osc1.connect(gain);
                osc2.connect(gain);
                gain.connect(audioCtx.destination);

                osc1.start(now);
                osc2.start(now);
                osc1.stop(now + 0.6);
                osc2.stop(now + 0.6);
            }
        } catch (e) {
            // Audio context not allowed or blocked
        }
    }

    // -------------------------------------------------------------
    // 2. Interactive Enter Action & Transition
    // -------------------------------------------------------------
    if (enterBtn) {
        enterBtn.addEventListener('mouseenter', () => playSound('hover'));

        enterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            playSound('enter');

            // Show Warp Portal Overlay
            if (warpOverlay) {
                warpOverlay.classList.add('active');
            }

            // Open in new tab after transition
            setTimeout(() => {
                window.open(TARGET_URL, '_blank');
                // Reset warp overlay after launching new tab
                setTimeout(() => {
                    if (warpOverlay) {
                        warpOverlay.classList.remove('active');
                    }
                }, 600);
            }, 600);
        });
    }

    // -------------------------------------------------------------
    // 3. Interactive Sports Category Pills
    // -------------------------------------------------------------
    sportsPills.forEach(pill => {
        pill.addEventListener('mouseenter', () => playSound('hover'));
        pill.addEventListener('click', () => {
            sportsPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
        });
    });

    // -------------------------------------------------------------
    // 4. Subtle 3D Card Tilt Effect
    // -------------------------------------------------------------
    featureCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            card.style.transform = `perspective(600px) rotateX(${-y * 0.05}deg) rotateY(${x * 0.05}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // -------------------------------------------------------------
    // 5. Dynamic Background Canvas: Energy Sparks & Particles
    // -------------------------------------------------------------
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 16), 70);

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + 10;
            this.size = Math.random() * 2.2 + 0.8;
            this.speedY = Math.random() * 0.8 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = Math.random() > 0.4 ? '#ffb703' : (Math.random() > 0.5 ? '#00f2fe' : '#fb8500');
            this.glow = Math.random() * 10 + 5;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;

            if (this.y < -10 || this.x < -10 || this.x > width + 10) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.shadowBlur = this.glow;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
});
