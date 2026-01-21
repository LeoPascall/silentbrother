// ===== 3D Minecraft Blocks Scene with Interactions =====
let scene, camera, renderer;
let blocks = [];
let particles = [];
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

function init3DScene() {
    const container = document.getElementById('canvas-3d');
    if (!container) return;

    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0620);
    scene.fog = new THREE.Fog(0x0f0620, 20, 100);

    // Camera setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 5, 8);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    // Add point lights for more atmosphere
    const pointLight1 = new THREE.PointLight(0x8b5cf6, 0.8, 15);
    pointLight1.position.set(5, 3, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x4facfe, 0.6, 15);
    pointLight2.position.set(-5, 3, -5);
    scene.add(pointLight2);

    // Create Minecraft blocks and particles
    createMinecraftBlocks();
    createFloatingParticles();

    // Mouse event listeners
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('click', onCanvasClick);
    renderer.domElement.addEventListener('wheel', onMouseWheel, false);

    // Touch support for mobile
    renderer.domElement.addEventListener('touchstart', onTouchStart);
    renderer.domElement.addEventListener('touchmove', onTouchMove);
    renderer.domElement.addEventListener('touchend', onTouchEnd);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation
    animate();
}

function createMinecraftBlocks() {
    // Minecraft block definitions with textures
    const minecraftBlockTypes = {
        stone: { color: 0x808080, roughness: 0.7, metalness: 0.1 },
        dirt: { color: 0x8B6F47, roughness: 0.8, metalness: 0.05 },
        grass: { color: 0x66CC33, roughness: 0.7, metalness: 0.0 },
        sand: { color: 0xFFDD00, roughness: 0.9, metalness: 0.0 },
        cobblestone: { color: 0x7F7F7F, roughness: 0.8, metalness: 0.1 },
        ore_iron: { color: 0xCD853F, roughness: 0.6, metalness: 0.8 },
        ore_gold: { color: 0xFFD700, roughness: 0.4, metalness: 0.9 },
        ore_diamond: { color: 0x33CCFF, roughness: 0.3, metalness: 0.6 },
        purple_block: { color: 0x8b5cf6, roughness: 0.5, metalness: 0.4 },
        lava: { color: 0xFF6B35, roughness: 0.4, metalness: 0.3 },
    };

    const blockTypeNames = Object.keys(minecraftBlockTypes);
    const blockSize = 1;
    const spacing = blockSize + 0.3;
    const gridSize = 4;
    const startX = -(gridSize - 1) * spacing / 2;
    const startZ = -(gridSize - 1) * spacing / 2;

    for (let x = 0; x < gridSize; x++) {
        for (let z = 0; z < gridSize; z++) {
            const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
            
            // Select random Minecraft block type
            const blockType = blockTypeNames[Math.floor(Math.random() * blockTypeNames.length)];
            const blockData = minecraftBlockTypes[blockType];
            
            const material = new THREE.MeshStandardMaterial({
                color: blockData.color,
                metalness: blockData.metalness,
                roughness: blockData.roughness,
                envMapIntensity: 1.0
            });

            // Add slight glow to some blocks
            if (Math.random() > 0.65) {
                material.emissive = new THREE.Color(blockData.color);
                material.emissiveIntensity = 0.2;
            }

            const block = new THREE.Mesh(geometry, material);
            block.position.set(
                startX + x * spacing,
                Math.random() * 2,
                startZ + z * spacing
            );
            block.castShadow = true;
            block.receiveShadow = true;

            // Store properties for interaction and animation
            block.userData = {
                originalPosition: block.position.clone(),
                originalRotation: block.rotation.clone(),
                rotationX: Math.random() * 0.01,
                rotationY: Math.random() * 0.015,
                rotationZ: Math.random() * 0.008,
                floatSpeed: Math.random() * 0.003 + 0.002,
                floatAmount: Math.random() * 0.15 + 0.05,
                time: Math.random() * Math.PI * 2,
                isSpinning: false,
                spinVelocity: { x: 0, y: 0, z: 0 },
                blockType: blockType
            };

            scene.add(block);
            blocks.push(block);
        }
    }
}

function createFloatingParticles() {
    const particleCount = 12;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions.push(
            (Math.random() - 0.5) * 10,
            Math.random() * 8,
            (Math.random() - 0.5) * 10
        );
        velocities.push(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02
        );
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    
    const material = new THREE.PointsMaterial({
        color: 0x8b5cf6,
        size: 0.15,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    particles.push({
        system: particleSystem,
        velocities: velocities,
        originalPositions: [...positions]
    });
}

function animate() {
    requestAnimationFrame(animate);

    // Animate blocks
    blocks.forEach(block => {
        // Continuous rotation
        block.rotation.x += block.userData.rotationX;
        block.rotation.y += block.userData.rotationY;
        block.rotation.z += block.userData.rotationZ;

        // Floating movement
        block.userData.time += block.userData.floatSpeed;
        block.position.y = block.userData.originalPosition.y + Math.sin(block.userData.time) * block.userData.floatAmount;

        // Spinning animation when clicked
        if (block.userData.isSpinning) {
            block.rotation.x += block.userData.spinVelocity.x;
            block.rotation.y += block.userData.spinVelocity.y;
            block.rotation.z += block.userData.spinVelocity.z;

            block.userData.spinVelocity.x *= 0.98;
            block.userData.spinVelocity.y *= 0.98;
            block.userData.spinVelocity.z *= 0.98;

            if (Math.abs(block.userData.spinVelocity.x) < 0.001 &&
                Math.abs(block.userData.spinVelocity.y) < 0.001 &&
                Math.abs(block.userData.spinVelocity.z) < 0.001) {
                block.userData.isSpinning = false;
            }
        }
    });

    // Animate particles
    particles.forEach(particle => {
        const positions = particle.system.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += particle.velocities[i / 3 * 3];
            positions[i + 1] += particle.velocities[i / 3 * 3 + 1];
            positions[i + 2] += particle.velocities[i / 3 * 3 + 2];

            // Bounce particles
            if (positions[i] > 5 || positions[i] < -5) particle.velocities[i / 3 * 3] *= -1;
            if (positions[i + 1] > 8 || positions[i + 1] < 0) particle.velocities[i / 3 * 3 + 1] *= -1;
            if (positions[i + 2] > 5 || positions[i + 2] < -5) particle.velocities[i / 3 * 3 + 2] *= -1;
        }
        particle.system.geometry.attributes.position.needsUpdate = true;
    });

    // Drag to rotate camera
    if (isDragging) {
        const deltaX = mouse.x - previousMousePosition.x;
        const deltaY = mouse.y - previousMousePosition.y;

        camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * 0.005);
        camera.position.applyAxisAngle(
            new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), camera.position).normalize(),
            deltaY * 0.005
        );
        camera.lookAt(0, 2, 0);

        previousMousePosition = { x: mouse.x, y: mouse.y };
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('canvas-3d');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

// Mouse and touch event handlers
function onMouseDown(event) {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
}

function onMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
}

function onMouseUp(event) {
    isDragging = false;
}

function onCanvasClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert to normalized device coordinates
    const ndc = new THREE.Vector2();
    ndc.x = (x / rect.width) * 2 - 1;
    ndc.y = -(y / rect.height) * 2 + 1;

    // Check for intersections
    raycaster.setFromCamera(ndc, camera);
    const intersects = raycaster.intersectObjects(blocks);

    if (intersects.length > 0) {
        const clickedBlock = intersects[0].object;
        clickedBlock.userData.isSpinning = true;
        clickedBlock.userData.spinVelocity = {
            x: (Math.random() - 0.5) * 0.3,
            y: (Math.random() - 0.5) * 0.3,
            z: (Math.random() - 0.5) * 0.3
        };
    }
}

function onMouseWheel(event) {
    event.preventDefault();
    const zoomSpeed = 0.1;
    const direction = camera.position.normalize();
    const distance = camera.position.length();

    if (event.deltaY > 0) {
        camera.position.copy(direction.multiplyScalar(distance + zoomSpeed));
    } else {
        camera.position.copy(direction.multiplyScalar(Math.max(distance - zoomSpeed, 3)));
    }
    camera.lookAt(0, 2, 0);
}

function onTouchStart(event) {
    isDragging = true;
    previousMousePosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
}

function onTouchMove(event) {
    if (isDragging) {
        const rect = renderer.domElement.getBoundingClientRect();
        const touch = event.touches[0];
        const deltaX = touch.clientX - previousMousePosition.x;
        const deltaY = touch.clientY - previousMousePosition.y;

        camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * 0.005);
        camera.position.applyAxisAngle(
            new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), camera.position).normalize(),
            deltaY * 0.005
        );
        camera.lookAt(0, 2, 0);

        previousMousePosition = { x: touch.clientX, y: touch.clientY };
    }
}

function onTouchEnd(event) {
    isDragging = false;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Three.js to load
    if (window.THREE) {
        init3DScene();
    } else {
        setTimeout(() => {
            if (window.THREE) init3DScene();
        }, 500);
    }
});

// ===== Intersection Observer for Credits Page =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe crew cards
document.querySelectorAll('.crew-card').forEach(card => {
    observer.observe(card);
});

// Observe collaboration cards
document.querySelectorAll('.collab-card').forEach(card => {
    observer.observe(card);
});

// Observe section titles
document.querySelectorAll('.section-title').forEach(title => {
    observer.observe(title);
});

// Observe contact form
const collabForm = document.querySelector('.collab-form');
if (collabForm) {
    observer.observe(collabForm);
}

// ===== Form Submission for Collaboration =====
if (collabForm) {
    collabForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const nameInput = this.querySelector('input[type="text"]');
        const emailInput = this.querySelector('input[type="email"]');
        const roleSelect = this.querySelector('select');
        const portfolioInput = this.querySelector('input[type="url"]');
        const messageInput = this.querySelector('textarea');
        const button = this.querySelector('button');
        const messageDiv = document.getElementById('collabMessage');

        // Validation
        if (!nameInput.value.trim() || !emailInput.value.trim() || !roleSelect.value || !portfolioInput.value.trim() || !messageInput.value.trim()) {
            alert('Please fill in all fields');
            return;
        }

        const originalText = button.textContent;
        button.textContent = 'Sending...';
        button.disabled = true;
        messageDiv.textContent = 'Sending your inquiry...';
        messageDiv.className = 'form-message loading';

        try {
            const formData = new FormData();
            formData.append('_captcha', 'false');
            formData.append('name', nameInput.value);
            formData.append('email', emailInput.value);
            formData.append('role', roleSelect.value);
            formData.append('portfolio', portfolioInput.value);
            formData.append('message', messageInput.value);
            formData.append('_subject', `Collaboration Inquiry from ${nameInput.value} - Silent Brother`);
            formData.append('_template', 'table');

            const response = await fetch('https://formsubmit.co/dualozonebusiness@gmail.com', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                button.textContent = 'Inquiry Sent! ✓';
                button.style.background = 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)';
                messageDiv.textContent = '✓ Your collaboration inquiry has been sent successfully';
                messageDiv.className = 'form-message success';

                setTimeout(() => {
                    collabForm.reset();
                    button.textContent = originalText;
                    button.style.background = '';
                    button.disabled = false;
                    messageDiv.textContent = '';
                }, 3000);
            } else {
                throw new Error('Failed to send inquiry');
            }
        } catch (error) {
            console.error('Error sending inquiry:', error);
            button.textContent = 'Error sending inquiry';
            button.style.background = 'linear-gradient(135deg, #ff006e 0%, #ff4d94 100%)';
            messageDiv.textContent = '✗ Failed to send inquiry. Please try again.';
            messageDiv.className = 'form-message error';

            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
                button.disabled = false;
            }, 2000);
        }
    });
}

// ===== Smooth Scroll for Credits Page =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

console.log('🎬 Credits Page - Ready');
