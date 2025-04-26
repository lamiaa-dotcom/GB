document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
  
    // Hardcoded credentials
    if (username === 'Admin' && password === 'admin') {
      // Store login state (simple approach using localStorage)
      localStorage.setItem('isLoggedIn', 'true');
      // Redirect to index page
      window.location.href = '/index.html';
    } else {
      errorMessage.textContent = 'Invalid username or password';
      errorMessage.style.display = 'block';
    }
  });