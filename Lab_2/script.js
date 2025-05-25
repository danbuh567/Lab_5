document.addEventListener('DOMContentLoaded', function () {
    const systemInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        online: navigator.onLine,
        product: navigator.product,
        appName: navigator.appName,
        appVersion: navigator.appVersion,
        vendor: navigator.vendor
    };

    for (const key in systemInfo) {
        localStorage.setItem(key, systemInfo[key]);
    }

    const footer = document.querySelector('footer');
    const storedInfo = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        storedInfo.push(`<strong>${key}</strong>: ${value}`);
    }

    if (footer) {
        footer.innerHTML += `<div style="margin-top:20px; text-align:left;">${storedInfo.join('<br>')}</div>`;
    }

    const commentsContainer = document.getElementById('comments-container');
    const variantNumber = 3;

    fetch(`https://jsonplaceholder.typicode.com/posts/${variantNumber}/comments`)
        .then(response => response.json())
        .then(comments => {
            if (commentsContainer) {
                const listItems = comments.map(comment =>
                    `<li><strong>${comment.name}</strong> (${comment.email})<br>${comment.body}</li>`
                ).join('');
                commentsContainer.innerHTML = `<ul>${listItems}</ul>`;
            }
        })
        .catch(error => {
            if (commentsContainer) {
                commentsContainer.innerHTML = `<p style="color: red;">Помилка завантаження: ${error}</p>`;
            }
        });

    setTimeout(function () {
        const modal = document.getElementById('feedback-modal');
        if (modal) {
            modal.style.display = 'block';
        }
    }, 60000);

    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
        closeButton.onclick = function () {
            const modal = document.getElementById('feedback-modal');
            if (modal) {
                modal.style.display = 'none';
            }
        };
    }

    window.onclick = function (event) {
        const modal = document.getElementById('feedback-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    const toggle = document.getElementById('theme-toggle');
    const userChangedTheme = localStorage.getItem('userChangedTheme') === 'true';
    function applyTheme(theme) {
        document.body.classList.remove('day-theme', 'night-theme');
        document.body.classList.add(`${theme}-theme`);
        if (toggle) toggle.checked = theme === 'night';
    }

    function checkAndApplyTheme() {
        if (userChangedTheme) {
            applyTheme(localStorage.getItem('theme'));
            return;
        }

        const currentHour = new Date().getHours();
        const newTheme = (currentHour >= 7 && currentHour < 21) ? 'day' : 'night';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    checkAndApplyTheme();
    setInterval(checkAndApplyTheme, 600000);
    if (toggle) {
        toggle.addEventListener('change', function () {
            const newTheme = toggle.checked ? 'night' : 'day';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            localStorage.setItem('userChangedTheme', 'true');
        });
    }
});
