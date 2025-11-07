const API_BASE_URL = 'https://avyra-website.onrender.com';

// Navbar scroll effect
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Server IP copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Simulate player count (replace with real API call)
function updatePlayerCount() {
    const playerCountElement = document.getElementById('playerCount');
    // Simulate random player count between 30-64
    const randomCount = Math.floor(Math.random() * 35) + 30;
    playerCountElement.textContent = randomCount;
}

// Update player count every 30 seconds
updatePlayerCount();
setInterval(updatePlayerCount, 30000);

// Smooth scroll for anchor links
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

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.feature-card, .rule-card, .staff-card, .step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Login Modal functionality
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');

// Dashboard Modal
const dashboardModal = document.getElementById('dashboardModal');
const dashboardOverlay = document.getElementById('dashboardOverlay');
const dashboardClose = document.getElementById('dashboardClose');
const dashboardContent = document.getElementById('dashboardContent');
const userProfile = document.getElementById('userProfile');

// Open login modal
loginBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Close login modal
const closeLoginModal = () => {
    loginModal.classList.remove('active');
    document.body.style.overflow = 'auto';
};

modalClose.addEventListener('click', closeLoginModal);
modalOverlay.addEventListener('click', closeLoginModal);

// Open dashboard modal
userProfile.addEventListener('click', async () => {
    dashboardModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Fetch and display character data
    try {
        const response = await fetch(`${API_BASE_URL}/api/user/characters`, { credentials: 'include' });
        const data = await response.json();

        if (data.characters && data.characters.length > 0) {
            dashboardContent.innerHTML = characterCardsHtml;
        } else {
            dashboardContent.innerHTML = '<p>No character data found.</p>';
        }
    } catch (error) {
        console.error('Error fetching character data:', error);
        dashboardContent.innerHTML = '<p>Failed to load character data.</p>';
    }
});

// Close dashboard modal
const closeDashboardModal = () => {
    dashboardModal.classList.remove('active');
    document.body.style.overflow = 'auto';
};

dashboardClose.addEventListener('click', closeDashboardModal);
dashboardOverlay.addEventListener('click', closeDashboardModal);

// Close modals on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (loginModal.classList.contains('active')) {
            closeLoginModal();
        }
        if (dashboardModal.classList.contains('active')) {
            closeDashboardModal();
        }
    }
});

function formatPlaytime(minutes) {
    if (typeof minutes !== 'number' || minutes < 0) {
        return 'N/A';
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

// Check user auth status on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/status`, { credentials: 'include' });
        const data = await response.json();

        const loginBtn = document.getElementById('loginBtn');
        const userProfile = document.getElementById('userProfile');

        if (data.authenticated) {
            loginBtn.classList.add('hidden');
            userProfile.classList.remove('hidden');

            const avatar = userProfile.querySelector('.profile-avatar');
            const name = userProfile.querySelector('.profile-name');

            avatar.src = `https://cdn.discordapp.com/avatars/${data.user.discord_id}/${data.user.avatar}.png`;
            name.textContent = data.user.username;
            
        } else {
            loginBtn.classList.remove('hidden');
            userProfile.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
    }
});

console.log('🎮 Avyra Roleplay website loaded successfully!');

