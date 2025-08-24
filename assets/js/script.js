    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => { document.body.removeChild(notification); }, 300);
        }, 3000);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const loginFormContainer = document.getElementById('loginForm');
    const registerFormContainer = document.getElementById('registerForm');
    const switchToRegisterBtn = document.getElementById('switchToRegister');
    const switchToLoginBtn = document.getElementById('switchToLogin');

    document.addEventListener('DOMContentLoaded', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const formType = urlParams.get('form');
        if (formType === 'register') {
            registerFormContainer.style.display = 'block';
            loginFormContainer.style.display = 'none';
        } else {
            loginFormContainer.style.display = 'block';
            registerFormContainer.style.display = 'none';
        }
    });

    switchToRegisterBtn.addEventListener('click', () => {
        registerFormContainer.style.display = 'block';
        loginFormContainer.style.display = 'none';
    });

    switchToLoginBtn.addEventListener('click', () => {
        loginFormContainer.style.display = 'block';
        registerFormContainer.style.display = 'none';
    });

    document.getElementById('loginFormElement').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        if (!isValidEmail(email)) {
            showNotification('Vui lòng nhập đúng định dạng email!', 'error');
            return;
        }
        if (password.length < 6) {
            showNotification('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
            showNotification('Đăng nhập thành công! Chuyển hướng...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showNotification('Email hoặc mật khẩu không đúng!', 'error');
        }
    });

    document.getElementById('registerFormElement').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value.trim();
        const confirmPassword = document.getElementById('registerConfirmPassword').value.trim();

        if (!name) {
            showNotification('Vui lòng nhập họ và tên!', 'error');
            return;
        }
        if (!isValidEmail(email)) {
            showNotification('Vui lòng nhập đúng định dạng email!', 'error');
            return;
        }
        if (password.length < 6) {
            showNotification('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
            return;
        }
        if (password !== confirmPassword) {
            showNotification('Mật khẩu xác nhận không khớp!', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            showNotification('Email này đã được đăng ký!', 'error');
            return;
        }

        users.push({ name: name, email: email, password: password });
        localStorage.setItem('users', JSON.stringify(users));

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', JSON.stringify({ name: name, email: email }));
        showNotification('Đăng ký thành công! Chuyển hướng...', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });