/**
 * ==========================================
 * KAVERI-ARTS - ADMIN PANEL
 * Google OAuth, Content Management, Gallery Management
 * ==========================================
 */

// Configuration
const AUTHORIZED_EMAIL = 'kaveriprajapati123@gmail.com';

// State
let currentUser = null;
let artworkData = [];
let currentZoom = 1;

// ==========================================
// ADMIN LOGIN & AUTHENTICATION
// ==========================================

/**
 * Open Google Login modal
 */
document.getElementById('adminLoginBtn').addEventListener('click', () => {
    document.getElementById('adminModal').style.display = 'block';
    
    // Check if user is already logged in
    const savedUser = sessionStorage.getItem('googleUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        if (currentUser.email === AUTHORIZED_EMAIL) {
            showAdminDashboard();
        } else {
            // Logged in but not admin
            showNonAdminMessage();
        }
    }
});

/**
 * Close admin panel
 */
function closeAdminPanel() {
    document.getElementById('adminModal').style.display = 'none';
}

/**
 * Handle Google Sign-In Response (Real OAuth)
 * This function is called by Google's Sign-In button
 */
function handleCredentialResponse(response) {
    // Decode the JWT token to get user info
    const userObject = parseJwt(response.credential);
    
    currentUser = {
        email: userObject.email,
        name: userObject.name,
        picture: userObject.picture,
        sub: userObject.sub
    };
    
    // Store in sessionStorage (more secure than localStorage)
    sessionStorage.setItem('googleUser', JSON.stringify(currentUser));
    
    // Check if user is authorized admin
    if (currentUser.email === AUTHORIZED_EMAIL) {
        showAdminDashboard();
        console.log('✅ Admin logged in:', currentUser.email);
    } else {
        showNonAdminMessage();
        console.log('❌ Unauthorized user:', currentUser.email);
    }
}

/**
 * Parse JWT token to extract user information
 */
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

/**
 * Show message for non-admin users
 */
function showNonAdminMessage() {
    document.getElementById('adminLoginSection').innerHTML = `
        <h2>Welcome, ${currentUser.name}!</h2>
        <div style="text-align: center; padding: 2rem;">
            <img src="${currentUser.picture}" alt="${currentUser.name}" 
                 style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 1rem;">
            <p style="color: var(--color-light-text); margin-bottom: 1rem;">
                You're signed in as:<br>
                <strong>${currentUser.email}</strong>
            </p>
            <p style="color: var(--color-muted-text); margin-bottom: 1.5rem;">
                This account doesn't have admin privileges.<br>
                Admin access is restricted to authorized personnel only.
            </p>
            <button onclick="signOutGoogle()" class="admin-btn">Sign Out</button>
        </div>
    `;
    document.getElementById('adminDashboard').style.display = 'none';
}

/**
 * Show admin dashboard
 */
function showAdminDashboard() {
    document.getElementById('adminLoginSection').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    
    // Update user info
    document.getElementById('adminUserName').textContent = currentUser.name;
    document.getElementById('adminUserPhoto').src = currentUser.picture;
    
    // Load existing artworks
    loadExistingArtworks();
    
    // Load content for editing
    loadContentForEditing();
}

/**
 * Sign out admin
 */
function signOutAdmin() {
    signOutGoogle();
}

/**
 * Sign out from Google
 */
function signOutGoogle() {
    currentUser = null;
    sessionStorage.removeItem('googleUser');
    
    // Reset the modal
    document.getElementById('adminLoginSection').innerHTML = `
        <h2>Sign In</h2>
        <p>Sign in with your Google account</p>
        <div id="g_id_onload"
             data-client_id="YOUR_GOOGLE_CLIENT_ID"
             data-callback="handleCredentialResponse"
             data-auto_prompt="false">
        </div>
        <div class="g_id_signin"
             data-type="standard"
             data-size="large"
             data-theme="filled_blue"
             data-text="sign_in_with"
             data-shape="rectangular"
             data-logo_alignment="left">
        </div>
        <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--color-muted-text);">Admin access: kaveriprajapati123@gmail.com</p>
    `;
    
    document.getElementById('adminLoginSection').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
    
    // Re-render Google button
    if (typeof google !== 'undefined') {
        google.accounts.id.renderButton(
            document.querySelector('.g_id_signin'),
            { theme: 'filled_blue', size: 'large', text: 'sign_in_with' }
        );
    }
    
    alert('Signed out successfully');
}

/**
 * Switch admin tabs
 */
function showAdminTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    if (tabName === 'gallery') {
        document.getElementById('adminGalleryTab').style.display = 'block';
        document.querySelectorAll('.admin-tab-btn')[0].classList.add('active');
    } else if (tabName === 'content') {
        document.getElementById('adminContentTab').style.display = 'block';
        document.querySelectorAll('.admin-tab-btn')[1].classList.add('active');
    }
}

// ==========================================
// GALLERY MANAGEMENT
// ==========================================

/**
 * Load existing artworks from DOM and localStorage
 */
function loadExistingArtworks() {
    const savedArtworks = localStorage.getItem('artworkData');
    
    if (savedArtworks) {
        artworkData = JSON.parse(savedArtworks);
    } else {
        // Initialize from existing gallery items
        artworkData = [];
        document.querySelectorAll('.gallery-item').forEach(item => {
            artworkData.push({
                id: item.dataset.itemId,
                title: item.dataset.title,
                price: item.dataset.price,
                image: item.dataset.image || '',
                description: 'Mandala Series • 2024'
            });
        });
        localStorage.setItem('artworkData', JSON.stringify(artworkData));
    }
    
    displayExistingArtworks();
}

/**
 * Display existing artworks in admin panel
 */
function displayExistingArtworks() {
    const container = document.getElementById('existingArtworks');
    container.innerHTML = '';
    
    artworkData.forEach(artwork => {
        const card = document.createElement('div');
        card.className = 'artwork-edit-card';
        card.innerHTML = `
            ${artwork.image ? 
                `<img src="${convertGoogleDriveLink(artwork.image)}" alt="${artwork.title}" onerror="this.src='https://via.placeholder.com/200?text=No+Image'">` :
                `<div style="width:100%; aspect-ratio:1; background:#333; display:flex; align-items:center; justify-content:center; border-radius:8px; margin-bottom:0.5rem;">
                    <span style="color:#888;">No Image</span>
                </div>`
            }
            <h4>${artwork.title}</h4>
            <p style="color: var(--color-golden-yellow); font-weight:bold;">₹${artwork.price}</p>
            <button class="edit-artwork-btn" onclick="editArtwork(${artwork.id})">Edit</button>
            <button class="delete-artwork-btn" onclick="deleteArtwork(${artwork.id})">Delete</button>
        `;
        container.appendChild(card);
    });
}

/**
 * Add new artwork
 */
function addNewArtwork() {
    const title = document.getElementById('newArtTitle').value;
    const image = document.getElementById('newArtImage').value;
    const price = document.getElementById('newArtPrice').value;
    const desc = document.getElementById('newArtDesc').value;
    
    if (!title || !price) {
        alert('Please fill in at least title and price');
        return;
    }
    
    const newId = artworkData.length > 0 ? Math.max(...artworkData.map(a => parseInt(a.id))) + 1 : 7;
    
    const newArtwork = {
        id: newId.toString(),
        title: title,
        price: price,
        image: image,
        description: desc || 'Mandala Series • 2024'
    };
    
    artworkData.push(newArtwork);
    localStorage.setItem('artworkData', JSON.stringify(artworkData));
    
    // Add to gallery
    addArtworkToGallery(newArtwork);
    
    // Clear form
    document.getElementById('newArtTitle').value = '';
    document.getElementById('newArtImage').value = '';
    document.getElementById('newArtPrice').value = '';
    document.getElementById('newArtDesc').value = '';
    
    displayExistingArtworks();
    alert('✅ Artwork added successfully!');
}

/**
 * Add artwork to gallery DOM
 */
function addArtworkToGallery(artwork) {
    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.dataset.itemId = artwork.id;
    galleryItem.dataset.title = artwork.title;
    galleryItem.dataset.price = artwork.price;
    galleryItem.dataset.image = artwork.image;
    
    const imageHtml = artwork.image ? 
        `<img src="${convertGoogleDriveLink(artwork.image)}" alt="${artwork.title}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'mandala-placeholder\\'><svg viewBox=\\'0 0 200 200\\' xmlns=\\'http://www.w3.org/2000/svg\\'><circle cx=\\'100\\' cy=\\'100\\' r=\\'60\\' fill=\\'none\\' stroke=\\'#ff6b35\\' stroke-width=\\'2\\'/></svg></div>'">` :
        `<div class="mandala-placeholder mandala-1">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="60" fill="none" stroke="#ff6b35" stroke-width="2"/>
            </svg>
        </div>`;
    
    galleryItem.innerHTML = `
        <div class="gallery-frame" onclick="openImagePreview('${artwork.image}', '${artwork.title}')">
            <div class="placeholder-artwork">
                ${imageHtml}
            </div>
            <div class="gallery-overlay">
                <div class="gallery-info">
                    <h3>${artwork.title}</h3>
                    <p>${artwork.description}</p>
                    <p class="price">₹${artwork.price}</p>
                    <button class="buy-btn" onclick="event.stopPropagation(); buyArtwork(${artwork.id}, '${artwork.title}', ${artwork.price})">Buy Now</button>
                </div>
            </div>
        </div>
    `;
    
    galleryGrid.appendChild(galleryItem);
}

/**
 * Edit existing artwork
 */
function editArtwork(id) {
    const artwork = artworkData.find(a => a.id === id.toString());
    if (!artwork) return;
    
    const newTitle = prompt('Enter new title:', artwork.title);
    const newImage = prompt('Enter new Google Drive link:', artwork.image);
    const newPrice = prompt('Enter new price:', artwork.price);
    
    if (newTitle !== null) artwork.title = newTitle;
    if (newImage !== null) artwork.image = newImage;
    if (newPrice !== null) artwork.price = newPrice;
    
    localStorage.setItem('artworkData', JSON.stringify(artworkData));
    updateGalleryItem(artwork);
    displayExistingArtworks();
    
    alert('✅ Artwork updated!');
}

/**
 * Delete artwork
 */
function deleteArtwork(id) {
    if (!confirm('Are you sure you want to delete this artwork?')) return;
    
    artworkData = artworkData.filter(a => a.id !== id.toString());
    localStorage.setItem('artworkData', JSON.stringify(artworkData));
    
    // Remove from DOM
    const galleryItem = document.querySelector(`.gallery-item[data-item-id="${id}"]`);
    if (galleryItem) galleryItem.remove();
    
    displayExistingArtworks();
    alert('✅ Artwork deleted!');
}

/**
 * Update gallery item in DOM
 */
function updateGalleryItem(artwork) {
    const galleryItem = document.querySelector(`.gallery-item[data-item-id="${artwork.id}"]`);
    if (!galleryItem) return;
    
    galleryItem.dataset.title = artwork.title;
    galleryItem.dataset.price = artwork.price;
    galleryItem.dataset.image = artwork.image;
    
    const title = galleryItem.querySelector('.gallery-info h3');
    const price = galleryItem.querySelector('.gallery-info .price');
    const artworkImg = galleryItem.querySelector('.placeholder-artwork');
    
    if (title) title.textContent = artwork.title;
    if (price) price.textContent = `₹${artwork.price}`;
    
    if (artwork.image && artworkImg) {
        artworkImg.innerHTML = `<img src="${convertGoogleDriveLink(artwork.image)}" alt="${artwork.title}" style="width:100%; height:100%; object-fit:cover;">`;
    }
}

/**
 * Convert Google Drive share link to direct image link
 */
function convertGoogleDriveLink(url) {
    if (!url) return '';
    
    // If already a direct link, return as is
    if (url.includes('uc?id=') || url.includes('drive.google.com/thumbnail')) {
        return url;
    }
    
    // Extract file ID from various Google Drive link formats
    let fileId = null;
    
    // Format: https://drive.google.com/file/d/FILE_ID/view
    const match1 = url.match(/\/file\/d\/([^\/]+)/);
    if (match1) fileId = match1[1];
    
    // Format: https://drive.google.com/open?id=FILE_ID
    const match2 = url.match(/[?&]id=([^&]+)/);
    if (match2) fileId = match2[1];
    
    if (fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    
    return url; // Return original if can't parse
}

// ==========================================
// CONTENT EDITING
// ==========================================

/**
 * Load content for editing
 */
function loadContentForEditing() {
    const heroTagline = document.querySelector('.hero-tagline');
    const aboutIntro = document.querySelector('.about-intro');
    
    if (heroTagline) {
        document.getElementById('editHeroTagline').value = heroTagline.textContent;
    }
    
    if (aboutIntro) {
        document.getElementById('editAboutText').value = aboutIntro.textContent;
    }
}

/**
 * Save content changes
 */
function saveContentChanges() {
    const newTagline = document.getElementById('editHeroTagline').value;
    const newAbout = document.getElementById('editAboutText').value;
    
    if (newTagline) {
        const heroTagline = document.querySelector('.hero-tagline');
        if (heroTagline) heroTagline.textContent = newTagline;
        localStorage.setItem('heroTagline', newTagline);
    }
    
    if (newAbout) {
        const aboutIntro = document.querySelector('.about-intro');
        if (aboutIntro) aboutIntro.textContent = newAbout;
        localStorage.setItem('aboutIntro', newAbout);
    }
    
    alert('✅ Content updated successfully!');
}

// ==========================================
// IMAGE PREVIEW & ZOOM
// ==========================================

/**
 * Open image preview modal
 */
function openImagePreview(imageUrl, title) {
    if (!imageUrl) return;
    
    const modal = document.getElementById('imagePreviewModal');
    const img = document.getElementById('previewImage');
    
    img.src = convertGoogleDriveLink(imageUrl);
    img.alt = title;
    modal.style.display = 'block';
    currentZoom = 1;
}

/**
 * Close image preview
 */
function closeImagePreview() {
    document.getElementById('imagePreviewModal').style.display = 'none';
    currentZoom = 1;
}

/**
 * Zoom in
 */
function zoomIn() {
    currentZoom += 0.2;
    if (currentZoom > 3) currentZoom = 3;
    updateZoom();
}

/**
 * Zoom out
 */
function zoomOut() {
    currentZoom -= 0.2;
    if (currentZoom < 0.5) currentZoom = 0.5;
    updateZoom();
}

/**
 * Reset zoom
 */
function resetZoom() {
    currentZoom = 1;
    updateZoom();
}

/**
 * Update zoom level
 */
function updateZoom() {
    const img = document.getElementById('previewImage');
    img.style.transform = `translate(-50%, -50%) scale(${currentZoom})`;
}

// ==========================================
// PAYMENT INTEGRATION (DUMMY)
// ==========================================

/**
 * Buy artwork - redirect to payment
 */
function buyArtwork(id, title, price) {
    // Dummy payment flow - replace with actual payment gateway
    const confirmed = confirm(
        `Purchase "${title}" for ₹${price}?\n\n` +
        `This is a demo. In production, this would redirect to a payment gateway like Razorpay or Stripe.`
    );
    
    if (confirmed) {
        // Simulate payment redirect
        alert(
            `🎨 Redirecting to payment gateway...\n\n` +
            `Item: ${title}\n` +
            `Price: ₹${price}\n\n` +
            `In production, integrate:\n` +
            `- Razorpay (Indian payments)\n` +
            `- Stripe (International)\n` +
            `- PayPal\n` +
            `- Paytm/PhonePe`
        );
        
        // Example Razorpay integration (uncomment and configure):
        /*
        const options = {
            key: 'YOUR_RAZORPAY_KEY',
            amount: price * 100, // Razorpay uses paise
            currency: 'INR',
            name: 'Kaveri-arts',
            description: title,
            image: 'logo.png',
            handler: function(response) {
                alert('Payment successful! ID: ' + response.razorpay_payment_id);
            }
        };
        const rzp = new Razorpay(options);
        rzp.open();
        */
    }
}

// ==========================================
// INITIALIZATION
// ==========================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Load saved content
    const savedTagline = localStorage.getItem('heroTagline');
    const savedAbout = localStorage.getItem('aboutIntro');
    
    if (savedTagline) {
        const heroTagline = document.querySelector('.hero-tagline');
        if (heroTagline) heroTagline.textContent = savedTagline;
    }
    
    if (savedAbout) {
        const aboutIntro = document.querySelector('.about-intro');
        if (aboutIntro) aboutIntro.textContent = savedAbout;
    }
    
    // Load artwork data and update gallery if needed
    const savedArtworks = localStorage.getItem('artworkData');
    if (savedArtworks) {
        artworkData = JSON.parse(savedArtworks);
        // Update gallery items with saved images
        artworkData.forEach(artwork => {
            if (artwork.image) {
                updateGalleryItem(artwork);
            }
        });
    }
    
    // Add click handlers to existing gallery items
    document.querySelectorAll('.gallery-item').forEach(item => {
        const frame = item.querySelector('.gallery-frame');
        if (frame) {
            frame.style.cursor = 'pointer';
            frame.addEventListener('click', (e) => {
                // Don't open preview if clicking buy button
                if (e.target.classList.contains('buy-btn')) return;
                
                const image = item.dataset.image;
                const title = item.dataset.title;
                if (image) {
                    openImagePreview(image, title);
                }
            });
        }
    });
    
    // Update login button text based on login state
    const savedUser = sessionStorage.getItem('googleUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        const loginBtn = document.getElementById('adminLoginBtn');
        if (user.email === AUTHORIZED_EMAIL) {
            loginBtn.innerHTML = `
                <img src="${user.picture}" alt="Admin" style="width: 20px; height: 20px; border-radius: 50%; margin-right: 0.5rem;">
                Admin Panel
            `;
        }
    }
});

// Make handleCredentialResponse available globally for Google Sign-In
window.handleCredentialResponse = handleCredentialResponse;

// Close modals when clicking outside
window.onclick = function(event) {
    const adminModal = document.getElementById('adminModal');
    const previewModal = document.getElementById('imagePreviewModal');
    
    if (event.target === adminModal) {
        closeAdminPanel();
    }
    
    if (event.target === previewModal) {
        closeImagePreview();
    }
};

console.log('🔐 Google OAuth login initialized. Click "Google Login" to sign in.');
