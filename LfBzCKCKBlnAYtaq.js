const firebaseConfig = {
  apiKey: "AIzaSyD10aCUKg1YRao4bzCmOkiVpKV2HWqshz4",
  authDomain: "geogide-7d25e.firebaseapp.com",
  databaseURL: "https://geogide-7d25e-default-rtdb.firebaseio.com",
  projectId: "geogide-7d25e",
  storageBucket: "geogide-7d25e.firebasestorage.app",
  messagingSenderId: "55868267996",
  appId: "1:55868267996:web:e0f9174c1e6c5109670319",
  measurementId: "G-LG3T38G2CK"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// DOM Elements
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignupBtn = document.getElementById('show-signup');
const showLoginBtn = document.getElementById('show-login');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const loginBtn = document.getElementById('login-btn');
const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');

const navLibrary = document.getElementById('nav-library');
const navGoals = document.getElementById('nav-goals');
const navProgress = document.getElementById('nav-progress');

const libraryView = document.getElementById('library-view');
const goalsView = document.getElementById('goals-view');
const progressView = document.getElementById('progress-view');

const addBookForm = document.getElementById('add-book-form');
const bookTitleInput = document.getElementById('book-title');
const bookAuthorInput = document.getElementById('book-author');
const bookPagesInput = document.getElementById('book-pages');
const bookListDiv = document.getElementById('book-list');
const goalSettingArea = document.getElementById('goal-setting-area');
const readingLogsDiv = document.getElementById('reading-logs');

let currentUser;

// --- Authentication Functions ---

// Toggle between login and signup forms
showSignupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
});

showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Handle User Login
loginBtn.addEventListener('click', () => {
    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('User logged in:', userCredential.user.uid);
        })
        .catch((error) => {
            alert(error.message);
        });
});

// Handle User Signup
signupBtn.addEventListener('click', () => {
    const email = signupEmailInput.value;
    const password = signupPasswordInput.value;
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('User signed up:', userCredential.user.uid);
            // Save user profile to database
            database.ref('ABX1XBA01/users/' + userCredential.user.uid).set({
                email: userCredential.user.email,
                createdAt: new Date().toISOString()
            });
        })
        .catch((error) => {
            alert(error.message);
        });
});

// Handle User Logout
logoutBtn.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            console.log('User signed out');
        })
        .catch((error) => {
            alert(error.message);
        });
});

// Auth state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        authSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        loadBooks();
        loadGoals();
        loadReadingLogs();
        // Set default view
        showView('library-view');
    } else {
        currentUser = null;
        authSection.style.display = 'block';
        dashboardSection.style.display = 'none';
        bookListDiv.innerHTML = '';
        goalSettingArea.innerHTML = '';
        readingLogsDiv.innerHTML = '';
    }
});

// --- Dashboard Navigation ---
function showView(viewId) {
    const views = [libraryView, goalsView, progressView];
    views.forEach(view => {
        if (view.id === viewId) {
            view.style.display = 'block';
        } else {
            view.style.display = 'none';
        }
    });

    // Update active navigation link
    document.querySelectorAll('.sidebar ul li a').forEach(link => {
        link.classList.remove('active');
    });
    document.getElementById(`nav-${viewId.split('-')[0]}`).classList.add('active');
}

navLibrary.addEventListener('click', (e) => { e.preventDefault(); showView('library-view'); });
navGoals.addEventListener('click', (e) => { e.preventDefault(); showView('goals-view'); });
navProgress.addEventListener('click', (e) => { e.preventDefault(); showView('progress-view'); });

// --- Book Management ---
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = bookTitleInput.value;
    const author = bookAuthorInput.value;
    const pages = parseInt(bookPagesInput.value);

    if (currentUser && title && author && pages > 0) {
        const newBookRef = database.ref('ABX1XBA01/users/' + currentUser.uid + '/books').push();
        newBookRef.set({
            title: title,
            author: author,
            totalPages: pages,
            currentPage: 0,
            goal: 0,
            createdAt: new Date().toISOString()
        })
        .then(() => {
            bookTitleInput.value = '';
            bookAuthorInput.value = '';
            bookPagesInput.value = '';
            loadBooks(); // Reload books to show the new one
            loadGoals(); // Reload goals to include the new book
        })
        .catch(error => {
            alert('Error adding book: ' + error.message);
        });
    } else {
        alert('Please fill in all book details and ensure pages is a positive number.');
    }
});

function loadBooks() {
    if (!currentUser) return;

    const booksRef = database.ref('ABX1XBA01/users/' + currentUser.uid + '/books');
    booksRef.on('value', (snapshot) => {
        bookListDiv.innerHTML = '';
        const books = snapshot.val();
        if (books) {
            Object.keys(books).forEach(key => {
                const book = books[key];
                const progress = (book.currentPage / book.totalPages) * 100;
                const bookItem = document.createElement('div');
                bookItem.classList.add('book-item');
                bookItem.setAttribute('data-id', key);
                bookItem.innerHTML = `
                    <h3>${book.title}</h3>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Pages:</strong> ${book.currentPage} / ${book.totalPages}</p>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${progress.toFixed(0)}%;">${progress.toFixed(0)}%</div>
                    </div>
                    <div class="actions">
                        <button class="edit-book-btn">Edit</button>
                        <button class="delete-book-btn delete-btn">Delete</button>
                    </div>
                `;
                bookListDiv.appendChild(bookItem);
            });
        }
    });
}

// Handle Delete Book
bookListDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-book-btn')) {
        const bookId = e.target.closest('.book-item').dataset.id;
        if (currentUser && confirm('Are you sure you want to delete this book?')) {
            database.ref('ABX1XBA01/users/' + currentUser.uid + '/books/' + bookId).remove()
                .then(() => {
                    console.log('Book deleted');
                    loadBooks();
                    loadGoals();
                    loadReadingLogs();
                })
                .catch(error => {
                    alert('Error deleting book: ' + error.message);
                });
        }
    }
    // Handle Edit Book (simplified for now, could open a modal)
    if (e.target.classList.contains('edit-book-btn')) {
        const bookId = e.target.closest('.book-item').dataset.id;
        alert('Edit functionality for book ' + bookId + ' would go here.');
    }
});

// --- Reading Goals ---
function loadGoals() {
    if (!currentUser) return;

    const booksRef = database.ref('ABX1XBA01/users/' + currentUser.uid + '/books');
    booksRef.on('value', (snapshot) => {
        goalSettingArea.innerHTML = '';
        const books = snapshot.val();
        if (books) {
            Object.keys(books).forEach(key => {
                const book = books[key];
                const goalItem = document.createElement('div');
                goalItem.classList.add('goal-setting-item');
                goalItem.setAttribute('data-id', key);
                goalItem.innerHTML = `
                    <h4>${book.title}</h4>
                    <p class="current-goal">Current Goal: <strong>${book.goal} pages/day</strong></p>
                    <form class="set-goal-form">
                        <input type="number" class="goal-input" placeholder="Pages per day" value="${book.goal}" min="0">
                        <button type="submit">Set Goal</button>
                    </form>
                    <form class="read-pages-form">
                        <input type="number" class="read-input" placeholder="Pages read today" min="1">
                        <button type="submit">Log Reading</button>
                    </form>
                `;
                goalSettingArea.appendChild(goalItem);
            });
        }
    });
}

goalSettingArea.addEventListener('submit', (e) => {
    e.preventDefault();
    const bookId = e.target.closest('.goal-setting-item').dataset.id;

    if (e.target.classList.contains('set-goal-form')) {
        const goal = parseInt(e.target.querySelector('.goal-input').value);
        if (currentUser && bookId && goal >= 0) {
            database.ref('ABX1XBA01/users/' + currentUser.uid + '/goals/' + bookId).set({ goal: goal })
                .then(() => {
                    console.log('Goal updated for book:', bookId);
                    loadGoals();
                })
                .catch(error => {
                    alert('Error setting goal: ' + error.message);
                });
        } else {
            alert('Please enter a valid goal.');
        }
    }

    if (e.target.classList.contains('read-pages-form')) {
        const pagesRead = parseInt(e.target.querySelector('.read-input').value);
        if (currentUser && bookId && pagesRead > 0) {
            const bookRef = database.ref('ABX1XBA01/users/' + currentUser.uid + '/books/' + bookId);
            bookRef.once('value', (snapshot) => {
                const book = snapshot.val();
                if (book) {
                    const newCurrentPage = book.currentPage + pagesRead;
                    bookRef.update({ currentPage: newCurrentPage })
                        .then(() => {
                            console.log('Pages read updated for book:', bookId);
                            const newLogRef = database.ref('ABX1XBA01/users/' + currentUser.uid + '/readingLogs').push();
                            newLogRef.set({
                                bookId: bookId,
                                title: book.title,
                                pagesRead: pagesRead,
                                timestamp: new Date().toISOString()
                            });
                            e.target.querySelector('.read-input').value = '';
                            loadBooks();
                            loadReadingLogs();
                        })
                        .catch(error => {
                            alert('Error updating pages read: ' + error.message);
                        });
                }
            });
        } else {
            alert('Please enter a valid number of pages read.');
        }
    }
});

// --- Reading Logs ---
function loadReadingLogs() {
    if (!currentUser) return;

    const readingLogsRef = database.ref('ABX1XBA01/users/' + currentUser.uid + '/readingLogs');
    readingLogsRef.on('value', (snapshot) => {
        readingLogsDiv.innerHTML = '';
        const logs = snapshot.val();
        if (logs) {
            // Display logs in reverse chronological order
            const sortedLogs = Object.entries(logs).sort(([, a], [, b]) => new Date(b.timestamp) - new Date(a.timestamp));

            sortedLogs.forEach(([key, log]) => {
                const logItem = document.createElement('div');
                logItem.classList.add('log-item');
                logItem.innerHTML = `
                    <p>Read <strong>${log.pagesRead} pages</strong> of <strong>${log.title}</strong> on ${new Date(log.timestamp).toLocaleDateString()} at ${new Date(log.timestamp).toLocaleTimeString()}</p>
                `;
                readingLogsDiv.appendChild(logItem);
            });
        }
    });
}
