const GRAVITY = 0.98;

let riff = null;

let ctx_target = null;
let ctx_buffer = null;
let width = null;
let height = null;

let fireworks = [];
let particles = [];

let lastFrame = null;

function startFireworks() {
    width = window.innerWidth;
    height = window.innerHeight;

    const canvas = document.querySelector('canvas#fireworks');
    canvas.width = width;
    canvas.height = height;
    ctx_target = canvas.getContext("2d");

    const buffer = document.createElement('canvas');
    buffer.width = width;
    buffer.height = height;
    ctx_buffer = buffer.getContext("2d");

    riff.play();

    Array(50).fill().forEach(shootFirework);

    lastFrame = window.performance.now();
    window.requestAnimationFrame(updateFireworks);
}

function loadAudio() {
    riff = document.createElement('audio');
    riff.src = "riff.mp3";
    riff.type = "audio/mpeg";
    document.body.append(riff);
}

function drawFirework({x, y}) {
    ctx_buffer.fillStyle = "#fff";
    dot(x, y);
}

function drawParticle({x, y, r, g, b, timeout}) {
    ctx_buffer.fillStyle = `rgba(${r}, ${g}, ${b}, ${timeout})`;
    dot(x, y);
}

function updateFireworks(now) {
    const delta = (now - lastFrame) / 1000;
    lastFrame = now;
    
    ctx_buffer.fillStyle = "#000";
    ctx_buffer.fillRect(0, 0, width, height);

    const exploding = [];
    const removing = [];

    fireworks.forEach(firework => {
        firework.x += firework.velX * delta;
        firework.y += firework.velY * delta;
        firework.velY += GRAVITY * delta;
        drawFirework(firework);

        if (firework.y < 0.2 || firework.velY > 0) {
            exploding.push(firework);
        }
    });

    particles.forEach(particle => {
        particle.x += particle.velX * delta;
        particle.y += particle.velY * delta;
        particle.velY += GRAVITY * delta;
        drawParticle(particle);

        particle.timeout -= delta;
        if (particle.timeout < 0) {
            removing.push(particle);
        }
    })

    ctx_target.drawImage(ctx_buffer.canvas, 0, 0);

    exploding.forEach(firework => {
        const index = fireworks.indexOf(firework);
        fireworks.splice(index, 1);
        addParticles(firework);
    })

    removing.forEach(particle => {
        const index = particles.indexOf(particle);
        particles.splice(index, 1);
    })

    window.requestAnimationFrame(updateFireworks);
}

function addParticles(firework) {
    const particleCount = Math.floor(Math.random() * 10 + 10);
    const newParticles = Array(particleCount).fill().map(() => ({
        ...firework,
        velX: Math.random() * 2 - 1,
        velY: Math.random() * 2 - 1,
        timeout: 1,
    }))
    particles = [...particles, ...newParticles];
}

function shootFirework() {
    fireworks.push({
        x: Math.random() / 2 + 0.25,
        y: 1,
        velX: Math.random() / 5 - 0.1,
        velY: Math.random() / 2 - 1.5,
        r: Math.random() * 255,
        g: Math.random() * 255,
        b: Math.random() * 255,
    });
}

function dot(x, y) {
    const xCoord = x * width;
    const yCoord = y * height;
    ctx_buffer.fillRect(xCoord-1, yCoord-1, 3, 3)
}

loadAudio();

export default startFireworks;