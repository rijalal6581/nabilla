document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Animation
    const loader = document.getElementById('loader');
    
    function hideLoader() {
        if (!loader) return;
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 800);
    }
    
    function showLoader() {
        if (!loader) return;
        loader.style.display = 'flex';
        // force reflow
        void loader.offsetWidth;
        loader.style.opacity = '1';
    }

    hideLoader();

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Mobile Sidebar Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }

    if (closeSidebar) {
        closeSidebar.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }

    // Close sidebar when clicking a link
    const sidebarLinks = document.querySelectorAll('.sidebar-links a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    });

    // 4. Scroll Reveal Animation
    const revealOnScroll = () => {
        const revealElements = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const revealPoint = 100;
            if (elementTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load

    // 5. Auth Modal Logic
    let isLoggedIn = localStorage.getItem('musicify_isLoggedIn') === 'true';
    const loginBtn = document.getElementById('loginBtn');
    const sidebarLoginBtn = document.getElementById('sidebarLoginBtn');
    const authModal = document.getElementById('authModal');
    const closeModal = document.getElementById('closeModal');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const modalTitle = document.querySelector('.modal-title');
    const modalContent = document.querySelector('.modal-content');

    function updateAuthUI() {
        // 1. Update Navbar Buttons
        if (isLoggedIn) {
            const userName = localStorage.getItem('musicify_user') || 'User';
            const userHTML = `
                <div class="user-pill">
                    <img src="https://ui-avatars.com/api/?name=${userName}&background=1ed760&color=000&bold=true" alt="Avatar">
                    <span>${userName}</span>
                </div>
            `;
            if (loginBtn) {
                loginBtn.innerHTML = userHTML;
                loginBtn.classList.add('logged-in');
            }
            if (sidebarLoginBtn) {
                sidebarLoginBtn.innerHTML = userHTML;
                sidebarLoginBtn.classList.add('logged-in');
            }
        } else {
            if (loginBtn) {
                loginBtn.textContent = 'Login / Sign Up';
                loginBtn.classList.remove('logged-in');
            }
            if (sidebarLoginBtn) {
                sidebarLoginBtn.textContent = 'Login / Sign Up';
                sidebarLoginBtn.classList.remove('logged-in');
            }
        }

        // 2. Update Modal Content
        refreshModalView();
    }

    function refreshModalView() {
        const existingLogout = document.getElementById('logoutSection');
        if (existingLogout) existingLogout.remove();

        if (isLoggedIn) {
            const userName = localStorage.getItem('musicify_user') || 'User';
            if (modalTitle) modalTitle.innerHTML = `Hi, ${userName}! <br><span style="font-size: 0.9rem; color: var(--text-secondary); font-weight: 400;">You are currently logged in.</span>`;
            
            // Create Logout Section
            const logoutSection = document.createElement('div');
            logoutSection.id = 'logoutSection';
            logoutSection.className = 'auth-form active';
            logoutSection.innerHTML = `
                <p style="text-align:center; color: var(--text-secondary); margin-bottom: 2rem; margin-top: 1rem;">Would you like to sign out from your premium account?</p>
                <button id="logoutBtnReal" class="btn-primary full-width" style="background: #e91429; color: #fff; border:none;">Logout Account</button>
                <button class="btn-outline full-width mt-1" id="cancelLogout" style="border-radius: 50px;">Cancel</button>
            `;
            if (modalContent) modalContent.appendChild(logoutSection);

            // Hide normal forms
            if (document.querySelector('.auth-tabs')) document.querySelector('.auth-tabs').style.display = 'none';
            authForms.forEach(f => f.style.display = 'none');

            // Bind logout buttons
            const logoutBtnReal = document.getElementById('logoutBtnReal');
            const cancelLogout = document.getElementById('cancelLogout');
            
            if (logoutBtnReal) {
                logoutBtnReal.onclick = () => {
                    isLoggedIn = false;
                    localStorage.removeItem('musicify_isLoggedIn');
                    localStorage.removeItem('musicify_user');
                    updateAuthUI();
                    if (authModal) authModal.classList.remove('active');
                    alert('Logged out successfully!');
                };
            }
            if (cancelLogout) {
                cancelLogout.onclick = () => {
                    if (authModal) authModal.classList.remove('active');
                };
            }
        } else {
            if (modalTitle) modalTitle.textContent = 'Welcome to Musicify';
            if (document.querySelector('.auth-tabs')) document.querySelector('.auth-tabs').style.display = 'flex';
            
            // Reset forms visibility
            authForms.forEach(f => {
                f.style.display = ''; // Restore default
                f.classList.remove('active');
            });
            
            // Set default active tab (Login)
            const defaultTab = document.querySelector('.tab-btn[data-tab="login"]');
            if (defaultTab) defaultTab.classList.add('active');
            if (loginForm) loginForm.classList.add('active');
        }
    }

    updateAuthUI();

    const openModal = (tab = 'login') => {
        if (!authModal) return;
        
        authModal.classList.add('active');
        if (sidebar) sidebar.classList.remove('active');

        if (!isLoggedIn) {
            // Switch to requested tab
            tabBtns.forEach(b => {
                b.classList.remove('active');
                if (b.dataset.tab === tab) b.classList.add('active');
            });
            authForms.forEach(f => {
                f.classList.remove('active');
                if (f.id === `${tab}Form`) f.classList.add('active');
            });
        } else {
            refreshModalView(); // Ensure logout view is shown
        }
    };

    const checkAuth = () => {
        if (!isLoggedIn) {
            openModal('login');
            if (modalContent) {
                modalContent.style.animation = 'none';
                void modalContent.offsetWidth; 
                modalContent.style.animation = 'shake 0.5s ease';
            }
            return false;
        }
        return true;
    };

    if (loginBtn) loginBtn.addEventListener('click', () => openModal('login'));
    if (sidebarLoginBtn) sidebarLoginBtn.addEventListener('click', () => openModal('login'));

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            authModal.classList.remove('active');
        });
    }

    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.classList.remove('active');
            }
        });
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            authForms.forEach(f => {
                f.classList.remove('active');
                f.style.display = ''; 
            });
            btn.classList.add('active');
            const targetForm = document.getElementById(`${btn.dataset.tab}Form`);
            if(targetForm) targetForm.classList.add('active');
        });
    });

    // Handle Login/Signup Submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('musicify_accounts') || '[]');
            
            // Check if user exists and password matches
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                isLoggedIn = true;
                localStorage.setItem('musicify_isLoggedIn', 'true');
                localStorage.setItem('musicify_user', user.name);
                updateAuthUI();
                authModal.classList.remove('active');
                alert(`Welcome back, ${user.name}! Access granted.`);
            } else {
                alert('Account not found or invalid password! Please Sign Up first.');
                // Shake effect on error
                const modalContent = document.querySelector('.modal-content');
                modalContent.style.animation = 'none';
                void modalContent.offsetWidth; 
                modalContent.style.animation = 'shake 0.5s ease';
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = signupForm.querySelector('input[type="text"]').value;
            const email = signupForm.querySelector('input[type="email"]').value;
            const passwordInput = signupForm.querySelector('input[type="password"]');
            const password = passwordInput ? passwordInput.value : '';
            
            const passwordInputs = signupForm.querySelectorAll('input[type="password"]');
            const confirmPass = passwordInputs.length > 1 ? passwordInputs[1].value : password;

            if (password !== confirmPass) {
                alert('Passwords do not match!');
                return;
            }

            // Get users
            const users = JSON.parse(localStorage.getItem('musicify_accounts') || '[]');
            
            // Check if email already registered
            if (users.some(u => u.email === email)) {
                alert('This email is already registered! Please Login.');
                openModal('login');
                return;
            }

            // Add new user
            users.push({ name, email, password });
            localStorage.setItem('musicify_accounts', JSON.stringify(users));
            
            // Automatically log in
            isLoggedIn = true;
            localStorage.setItem('musicify_isLoggedIn', 'true');
            localStorage.setItem('musicify_user', name);
            updateAuthUI();
            authModal.classList.remove('active');
            alert(`Registration successful! Welcome to Musicify, ${name}!`);
        });
    }

    // 6. Fake Realtime Playing Logic
    const playerTitle = document.getElementById('playerTitle');
    const playerArtist = document.getElementById('playerArtist');
    const playerCover = document.getElementById('playerCover');
    const mainPlayBtn = document.getElementById('mainPlayBtn');
    let isPlaying = localStorage.getItem('musicify_isPlaying') === 'true';

    // Restore state from localStorage
    function restorePlayerState() {
        const savedTitle = localStorage.getItem('musicify_title');
        const savedArtist = localStorage.getItem('musicify_artist');
        const savedCover = localStorage.getItem('musicify_cover');

        if (savedTitle && playerTitle) playerTitle.textContent = savedTitle;
        if (savedArtist && playerArtist) playerArtist.textContent = savedArtist;
        if (savedCover && playerCover) playerCover.src = savedCover;
        
        updatePlayIcon();
    }
    
    // Call restore immediately on load
    restorePlayerState();

    if (mainPlayBtn) {
        mainPlayBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            localStorage.setItem('musicify_isPlaying', isPlaying);
            updatePlayIcon();
        });
    }

    function updatePlayIcon() {
        if (!mainPlayBtn) return;
        const icon = mainPlayBtn.querySelector('i');
        if (!icon) return;
        
        if (isPlaying) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            if (playerCover) playerCover.style.animation = 'spin 10s linear infinite';
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            if (playerCover) playerCover.style.animation = 'none';
        }
    }

    function bindPlayTriggers() {
        const playTriggers = document.querySelectorAll('.play-trigger');
        playTriggers.forEach(trigger => {
            if (trigger.dataset.bound === 'true') return;
            trigger.dataset.bound = 'true';

            const playBtn = trigger.querySelector('.play-hover') || trigger.querySelector('.play-btn-small') || trigger.querySelector('.play-btn-large') || trigger.querySelector('.lb-play');
            
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (!checkAuth()) return; // Prevent playing if not logged in
                    
                    let title = "Unknown Song";
                    let artist = "Unknown Artist";
                    let coverSrc = "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=100&auto=format&fit=crop";

                    if (trigger.classList.contains('song-item') || trigger.classList.contains('movie-card') || trigger.classList.contains('leaderboard-item')) {
                        title = trigger.dataset.song;
                        artist = trigger.dataset.artist;
                        coverSrc = trigger.dataset.cover;
                    } else if (trigger.classList.contains('album-card') || trigger.classList.contains('playlist-card')) {
                        const h3 = trigger.querySelector('h3');
                        const p = trigger.querySelector('p');
                        const img = trigger.querySelector('img');
                        if (h3) title = h3.textContent;
                        if (p) artist = p.textContent;
                        if (img) coverSrc = img.src;
                    }

                    if (playerTitle) playerTitle.textContent = title;
                    if (playerArtist) playerArtist.textContent = artist;
                    if (playerCover) playerCover.src = coverSrc;
                    
                    isPlaying = true;
                    
                    // Save to localStorage
                    localStorage.setItem('musicify_title', title);
                    localStorage.setItem('musicify_artist', artist);
                    localStorage.setItem('musicify_cover', coverSrc);
                    localStorage.setItem('musicify_isPlaying', isPlaying);

                    updatePlayIcon();
                    
                    document.querySelectorAll('.play-trigger').forEach(t => t.classList.remove('playing-now'));
                    trigger.classList.add('playing-now');
                });
            }
        });
    }

    // 8. Artist Detail Modal Logic
    function bindArtistModals() {
        const artistCards = document.querySelectorAll('.artist-hero-card');
        const artistModal = document.getElementById('artistModal');
        const closeArtistModal = document.getElementById('closeArtistModal');
        
        if (!artistCards.length || !artistModal) return;

        const mImg = document.getElementById('modalArtistImg');
        const mName = document.getElementById('modalArtistName');
        const mGenre = document.getElementById('modalArtistGenre');
        const mBorn = document.getElementById('modalArtistBorn');
        const mCareer = document.getElementById('modalArtistCareer');
        const mSongs = document.getElementById('modalArtistSongs');

        artistCards.forEach(card => {
            // Prevent multiple bindings
            if (card.dataset.modalBound === 'true') return;
            card.dataset.modalBound = 'true';

            card.addEventListener('click', () => {
                const artistId = card.dataset.artist;
                const dataElement = document.getElementById(`data-${artistId}`);
                
                if (dataElement) {
                    mImg.src = card.querySelector('img').src;
                    mName.textContent = card.querySelector('h2').textContent;
                    mGenre.textContent = card.querySelector('p').textContent;
                    mBorn.textContent = dataElement.querySelector('.d-born').textContent;
                    mCareer.textContent = dataElement.querySelector('.d-career').textContent;
                    mSongs.innerHTML = dataElement.querySelector('.d-songs').innerHTML;
                    
                    // Rebind play triggers inside the modal so they can actually play music!
                    bindPlayTriggers();
                    
                    artistModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // prevent background scroll
                }
            });
        });

        if (closeArtistModal) {
            closeArtistModal.addEventListener('click', () => {
                artistModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Close on clicking outside
        artistModal.addEventListener('click', (e) => {
            if (e.target === artistModal) {
                artistModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    bindPlayTriggers();
    bindArtistModals();

    // 7. REAL BACKGROUND AUDIO & PJAX (SEAMLESS NAVIGATION)
    const bgAudio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    bgAudio.loop = true;
    
    // Sync audio with our play button state
    if (isPlaying) {
        // Browser might block autoplay without interaction, but we try
        bgAudio.play().catch(e => console.log('Autoplay blocked'));
    }

    if (mainPlayBtn) {
        // Remove the old event listener by replacing the button
        const newPlayBtn = mainPlayBtn.cloneNode(true);
        mainPlayBtn.parentNode.replaceChild(newPlayBtn, mainPlayBtn);
        
        newPlayBtn.addEventListener('click', () => {
            if (!checkAuth()) return; // Lock player if not logged in

            isPlaying = !isPlaying;
            localStorage.setItem('musicify_isPlaying', isPlaying);
            
            if (isPlaying) {
                bgAudio.play();
            } else {
                bgAudio.pause();
            }
            
            // Re-fetch the button because we cloned it
            const currentIcon = newPlayBtn.querySelector('i');
            if (isPlaying) {
                currentIcon.classList.remove('fa-play');
                currentIcon.classList.add('fa-pause');
                if (playerCover) playerCover.style.animation = 'spin 10s linear infinite';
            } else {
                currentIcon.classList.remove('fa-pause');
                currentIcon.classList.add('fa-play');
                if (playerCover) playerCover.style.animation = 'none';
            }
        });
    }

    // Advanced PJAX Routing
    document.addEventListener('click', async (e) => {
        const link = e.target.closest('a');
        if (!link || !link.href) return;
        
        // Skip external links, target blanks, or hash links
        if (link.target === '_blank' || link.host !== window.location.host || link.getAttribute('href').startsWith('#')) {
            return;
        }

        e.preventDefault();

        // AUTH LOCK: Restrict specific pages if not logged in
        const restrictedPages = ['playlist.html', 'artists.html', 'albums.html'];
        const targetPage = new URL(link.href).pathname.split('/').pop();
        if (restrictedPages.includes(targetPage) && !isLoggedIn) {
            alert('Please login to access this premium feature!');
            openModal('signup'); // Prompt to sign up
            return;
        }

        navigateTo(link.href);
    });

    window.addEventListener('popstate', () => {
        navigateTo(window.location.href, false);
    });

    async function navigateTo(url, pushState = true) {
        try {
            showLoader();

            // Fetch the HTML of the target page
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const html = await response.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Replace ONLY the Main content section
            const newMain = doc.querySelector('main');
            const currentMain = document.querySelector('main');
            if (newMain && currentMain) {
                currentMain.innerHTML = newMain.innerHTML;
            } else {
                // If the target page doesn't have a <main>, force a hard reload
                throw new Error("No main element found");
            }
            
            // Update page title
            document.title = doc.title;
            
            // Update active state in navbars dynamically
            const pathName = new URL(url).pathname.split('/').pop() || 'index.html';
            document.querySelectorAll('.nav-links a, .sidebar-links a').forEach(a => {
                a.classList.remove('active');
                const linkHref = a.getAttribute('href');
                if (linkHref === pathName || (pathName === '' && linkHref === 'index.html')) {
                    a.classList.add('active');
                }
            });
            
            // Push history state so back button works
            if (pushState) {
                window.history.pushState(null, '', url);
            }
            
            // Re-initialize scripts for the newly injected content
            window.scrollTo({ top: 0, behavior: 'smooth' });
            revealOnScroll();
            bindPlayTriggers();
            bindArtistModals();
            
            if (sidebar) sidebar.classList.remove('active');
            
            hideLoader();
        } catch (error) {
            console.error('PJAX Seamless Navigation Failed:', error);
            // IF running locally on file:// without Live Server, fetch will fail.
            // Fallback to normal page load. Note: This WILL cut off the audio!
            alert("Buka menggunakan Live Server (VS Code) agar lagu tidak restart saat pindah halaman!");
            window.location.href = url;
        }
    }
});
