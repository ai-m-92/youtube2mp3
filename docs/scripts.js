document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const formatToggle = document.getElementById('format-toggle');
    const form = document.getElementById('conversion-form');
    const progressContainer = document.getElementById('progress-container');
    const resultContainer = document.getElementById('result');

    let format = 'mp4'; // Default format

    themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const currentTheme = themeToggle.textContent;
        const newTheme = currentTheme === 'Light' ? 'Dark' : 'Light';
        themeToggle.textContent = newTheme;
        document.body.style.backgroundColor = newTheme === 'Light' ? '#fff' : '#333';
        document.body.style.color = newTheme === 'Light' ? '#000' : '#fff';
        document.cookie = `theme=${newTheme}; path=/`;
    });

    formatToggle.addEventListener('click', (e) => {
        e.preventDefault();
        format = format === 'mp4' ? 'mp3' : 'mp4';
        formatToggle.textContent = format === 'mp4' ? 'video to MP4' : 'video to MP3';
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const url = document.getElementById('url').value.trim();
        if (!url) {
            resultContainer.innerHTML = 'Please enter a valid YouTube URL.';
            return;
        }

        progressContainer.querySelector('span').textContent = 'Preparing conversion...';

        fetch('/convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url, format })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                progressContainer.querySelector('span').textContent = 'Conversion completed!';
                resultContainer.innerHTML = `
                    Your video has been converted to ${format.toUpperCase()}!
                    <br>
                    <a href="${data.fileUrl}" download="converted_video.${format}">Download your file</a>
                `;
            } else {
                progressContainer.querySelector('span').textContent = 'Conversion failed.';
                resultContainer.innerHTML = '';
            }
        })
        .catch(error => {
            progressContainer.querySelector('span').textContent = 'An error occurred.';
            resultContainer.innerHTML = '';
            console.error('Error:', error);
        });
    });
});
