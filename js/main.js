document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // --- INTRO ANIMATION ---
    const intro = document.getElementById('intro');
    const introText = document.getElementById('intro-text');
    const introSubtext = document.getElementById('intro-subtext');
    const webContainer = document.getElementById('web-container');

    // Create "weaving" lines for intro
    for (let i = 0; i < 20; i++) {
        const line = document.createElement('div');
        line.className = 'web-line';
        line.style.top = Math.random() * 100 + '%';
        line.style.left = Math.random() * 100 + '%';
        line.style.transform = `rotate(${Math.random() * 360}deg)`;
        webContainer.appendChild(line);
    }

    const tl = gsap.timeline();

    tl.to('.web-line', {
        width: '150%',
        duration: 1.5,
        stagger: 0.05,
        ease: 'power2.inOut'
    })
    .to(introText, {
        opacity: 1,
        y: -20,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.5')
    .to(introSubtext, {
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.5')
    .to(intro, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 1.5,
        delay: 1,
        ease: 'power4.inOut',
        onComplete: () => {
            intro.style.display = 'none';
        }
    });

    // --- THREE.JS 3D BACKGROUND ---
    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create a particle "Web"
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 1500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
        colors[i] = Math.random();
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.015,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;
        renderer.render(scene, camera);
    }
    animate();

    // 3D Scrolling Effect: Move camera and rotate particles on scroll
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const rotationY = scrollY * 0.0002;
        const cameraZ = 3 - (scrollY * 0.001);
        
        particlesMesh.rotation.y = rotationY;
        camera.position.z = Math.max(1, cameraZ);
    });

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- GSAP SCROLL TRIGGER ANIMATIONS ---
    
    // Fade in sections
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Parallax for images
    gsap.utils.toArray('img').forEach(img => {
        gsap.to(img, {
            scrollTrigger: {
                trigger: img,
                scrub: true,
                start: 'top bottom',
                end: 'bottom top'
            },
            y: -50,
            ease: 'none'
        });
    });
});
