// common.js

// 日夜模式切换功能
function initTheme() {
    console.log('初始化主题模式');

    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (!themeToggle) {
        console.error('未找到ID为"theme-toggle"的元素');
        return;
    }

    // 检查本地存储中的主题偏好
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '🌙';
        console.log('已应用黑暗主题');
    } else {
        console.log('使用默认明亮主题');
    }

    // 主题切换功能
    themeToggle.addEventListener('click', function () {
        console.log('主题按钮被点击');

        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'light');
            console.log('已切换到明亮主题');
        } else {
            body.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
            console.log('已切换到黑暗主题');
        }

        // 触发自定义事件，以便其他组件可以响应主题变化
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: body.getAttribute('data-theme') || 'light' }
        }));
    });
}

// 页面加载完成后初始化主题
document.addEventListener('DOMContentLoaded', initTheme);

// 监听存储事件以实现跨标签页同步
window.addEventListener('storage', function (e) {
    if (e.key === 'theme') {
        console.log('检测到主题变化，同步中...');
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');

        if (e.newValue === 'dark') {
            body.setAttribute('data-theme', 'dark');
            if (themeToggle) themeToggle.textContent = '🌙';
        } else {
            body.removeAttribute('data-theme');
            if (themeToggle) themeToggle.textContent = '☀️';
        }
    }
});


// 动态标题功能
(function () {
    // 保存原始标题和图标
    const originalTitle = document.title;
    const originalFavicon = document.querySelector("link[rel*='icon']") || document.createElement('link');

    // 确保favicon元素存在
    if (!document.querySelector("link[rel*='icon']")) {
        originalFavicon.rel = 'icon';
        document.head.appendChild(originalFavicon);
    }

    // 创建新favicon
    const newFavicon = document.createElement('link');
    newFavicon.rel = 'icon';
    newFavicon.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>😢</text></svg>';

    // 挽留标题
    const stayTitle = "别走呀，快回来！QAQ";

    // 处理可见性变化
    function handleVisibilityChange() {
        if (document.hidden) {
            document.title = stayTitle;
            document.head.removeChild(originalFavicon);
            document.head.appendChild(newFavicon);
        } else {
            document.title = originalTitle;
            document.head.removeChild(newFavicon);
            document.head.appendChild(originalFavicon);
        }
    }

    // 添加事件监听
    document.addEventListener('visibilitychange', handleVisibilityChange);
})();

// Emoji 光标功能
(function () {
    console.log('初始化 Emoji 光标');

    // 创建 emoji 光标
    const cursor = document.createElement('div');
    cursor.classList.add('emoji-cursor', 'default');
    cursor.innerHTML = '👉'; // 默认光标
    document.body.appendChild(cursor);

    // 创建光标跟随效果
    const cursorFollower = document.createElement('div');
    cursorFollower.classList.add('cursor-follower');
    document.body.appendChild(cursorFollower);

    // 光标状态和对应的 emoji
    const cursorStates = {
        'default': '👉',
        'hand': '👆',
        'heart': '❤️',
        'star': '⭐',
        'text': '✏️',
        'link': '🔗',
        'not-allowed': '🚫',
        'loading': '⏳'
    };

    // 跟踪光标位置
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        // 添加延迟效果给跟随光标
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 80);
    });

    // 为不同元素添加悬停效果
    const handElements = document.querySelectorAll('a, button, .clickable');
    const heartElements = document.querySelectorAll('.heart, .love, .favorite');
    const starElements = document.querySelectorAll('.star, .rating, .important');
    const textElements = document.querySelectorAll('input[type="text"], textarea, [contenteditable]');
    const linkElements = document.querySelectorAll('a[href], .link');
    const notAllowedElements = document.querySelectorAll('.disabled, [disabled]');

    console.log('找到元素:', {
        hand: handElements.length,
        heart: heartElements.length,
        star: starElements.length,
        text: textElements.length,
        link: linkElements.length,
        notAllowed: notAllowedElements.length
    });

    // 设置光标状态函数
    function setCursorState(state) {
        // 移除所有状态类
        Object.keys(cursorStates).forEach(cls => {
            cursor.classList.remove(cls);
        });

        // 添加新状态类
        cursor.classList.add(state);
        cursor.innerHTML = cursorStates[state];
    }

    // 添加鼠标悬停事件监听
    function addHoverEffect(elements, state) {
        elements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                setCursorState(state);
            });

            el.addEventListener('mouseleave', () => {
                setCursorState('default');
            });
        });
    }

    // 应用悬停效果到不同元素类型
    addHoverEffect(handElements, 'hand');
    addHoverEffect(heartElements, 'heart');
    addHoverEffect(starElements, 'star');
    addHoverEffect(textElements, 'text');
    addHoverEffect(linkElements, 'link');
    addHoverEffect(notAllowedElements, 'not-allowed');

    // 添加点击效果
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });

    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // 处理页面可见性变化
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cursor.style.opacity = '0';
            cursorFollower.style.opacity = '0';
        } else {
            cursor.style.opacity = '1';
            cursorFollower.style.opacity = '1';
        }
    });

    // 确保光标在页面加载时显示
    document.addEventListener('DOMContentLoaded', () => {
        cursor.style.display = 'block';
        cursorFollower.style.display = 'block';
        console.log('Emoji 光标已显示');
    });

    // 添加错误处理
    setTimeout(() => {
        if (cursor.style.display !== 'block') {
            console.warn('光标可能未正确显示');
        }
    }, 1000);
})();