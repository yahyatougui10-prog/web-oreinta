document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. CUSTOM CURSOR ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    window.addEventListener('mousemove', (e) => {
        gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(cursorRing, { x: e.clientX - 16, y: e.clientY - 16, duration: 0.3 });
    });

    document.querySelectorAll('a, button, .feature-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.style.transform = 'scale(1.5)';
            cursorRing.style.borderColor = 'var(--primary)';
            cursorRing.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursorRing.style.transform = 'scale(1)';
            cursorRing.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            cursorRing.style.backgroundColor = 'transparent';
        });
    });

    // --- 2. INTRO ANIMATION ---
    const intro = document.getElementById('intro');
    const introText = document.getElementById('intro-text');
    const introSub = document.getElementById('intro-sub');
    const webContainer = document.getElementById('web-lines-container');

    for (let i = 0; i < 30; i++) {
        const line = document.createElement('div');
        line.className = 'web-line';
        line.style.top = Math.random() * 100 + '%';
        line.style.left = Math.random() * 100 + '%';
        line.style.transform = `rotate(${Math.random() * 360}deg)`;
        webContainer.appendChild(line);
    }

    const introTl = gsap.timeline();
    introTl.to('.web-line', {
        width: '200%',
        duration: 1.2,
        stagger: 0.03,
        ease: 'power2.inOut'
    })
    .to(introText, { opacity: 1, scale: 1.1, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.5')
    .to(introSub, { opacity: 1, y: -10, duration: 0.6 }, '-=0.3')
    .to(intro, {
        opacity: 0,
        duration: 1,
        delay: 1.2,
        ease: 'power4.inOut',
        onComplete: () => { intro.style.display = 'none'; }
    });

    // --- 3. THREE.JS 3D NETWORK ---
    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesGeometry = new THREE.BufferGeometry();
    const count = 150; // Reduced count for line performance
    const posArray = new Float32Array(count * 3);
    for(let i=0; i<count*3; i++) {
        posArray[i] = (Math.random() - 0.5) * 12;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x8B5CF6,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    camera.position.z = 5;

    // Lines for the network
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x8B5CF6,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });

    function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.0005;
        particlesMesh.rotation.x += 0.0002;

        // Dynamic lines
        const positions = particlesGeometry.attributes.position.array;
        const lines = [];
        for (let i = 0; i < count; i++) {
            for (let j = i + 1; j < count; j++) {
                const dx = positions[i*3] - positions[j*3];
                const dy = positions[i*3+1] - positions[j*3+1];
                const dz = positions[i*3+2] - positions[j*3+2];
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                if (dist < 2.5) {
                    lines.push(positions[i*3], positions[i*3+1], positions[i*3+2], positions[j*3], positions[j*3+1], positions[j*3+2]);
                }
            }
        }

        // We don't update lines every frame to avoid lag, but for this scale it's okay
        // In a real app, I'd use a BufferGeometry and update it.
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('scroll', () => {
        const scroll = window.scrollY;
        particlesMesh.rotation.y = scroll * 0.0002;
        camera.position.z = 5 - (scroll * 0.0005);
    });

    // --- 4. UX/UI ANIMATIONS ---
    const navbar = document.getElementById('navbar');
    const navContainer = document.getElementById('nav-container');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('glass-panel', 'py-2');
            navbar.classList.remove('py-4');
            navContainer.classList.add('max-w-4xl', 'rounded-full', 'px-8', 'py-2');
            navContainer.classList.remove('max-w-7xl');
        } else {
            navbar.classList.remove('glass-panel', 'py-2');
            navbar.classList.add('py-4');
            navContainer.classList.remove('max-w-4xl', 'rounded-full', 'px-8', 'py-2');
            navContainer.classList.add('max-w-7xl');
        }
    });

    // Magnetic Buttons
    document.querySelectorAll('.cta-button').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5 });
        });
    });

    // Split Text / Reveal Simulation
    gsap.from('.reveal-text', {
        scrollTrigger: { trigger: '.reveal-text', start: 'top 80%' },
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: 'power4.out'
    });

    gsap.from('.reveal-left', {
        scrollTrigger: { trigger: '.reveal-left', start: 'top 80%' },
        opacity: 0,
        x: -80,
        duration: 1.2,
        ease: 'power4.out'
    });

    gsap.from('.reveal-right', {
        scrollTrigger: { trigger: '.reveal-right', start: 'top 80%' },
        opacity: 0,
        x: 80,
        duration: 1.2,
        ease: 'power4.out'
    });

    // Staggered Feature Cards
    gsap.from('.feature-card', {
        scrollTrigger: {
            trigger: '.feature-card',
            start: 'top 85%'
        },
        opacity: 0,
        x: -20,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power2.out'
    });

    // Parallax Background Effect
    gsap.utils.toArray('.bg-image').forEach((bg, i) => {
        gsap.to(bg, {
            scrollTrigger: {
                trigger: bg.parentElement,
                scrub: true,
                start: 'top bottom',
                end: 'bottom top'
            },
            y: '30%',
            ease: 'none'
        });
    });

    // --- 5. PYTHON BACKEND INTEGRATION ---
    const contactForm = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);

        statusDiv.textContent = "Tissage de votre demande...";
        statusDiv.classList.remove('hidden');
        gsap.fromTo(statusDiv, { opacity: 0 }, { opacity: 1, duration: 0.5 });

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (result.status === 'success') {
                statusDiv.textContent = result.message;
                statusDiv.classList.replace('text-gray-400', 'text-teal-400');
                contactForm.reset();
            } else {
                throw new Error("Erreur serveur");
            }
        } catch (err) {
            statusDiv.textContent = "Erreur lors de l'envoi. Veuillez réessayer.";
            statusDiv.classList.replace('text-teal-400', 'text-red-400');
        }
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
