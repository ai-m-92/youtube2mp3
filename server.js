const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (e.g., HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files (e.g., converted files) from the 'downloads' directory
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// Serve the manifest.json file
app.use('/manifest.json', express.static(path.join(__dirname, 'public', 'manifest.json')));

// Serve the service worker
app.use('/service-worker.js', express.static(path.join(__dirname, 'public', 'service-worker.js')));

app.post('/convert', (req, res) => {
    const { url, format } = req.body;

    if (!url || !format) {
        return res.status(400).json({ success: false, message: 'URL and format are required' });
    }

    // Generate a unique filename based on the current timestamp
    const filename = `converted_file_${Date.now()}.${format}`;
    const filepath = path.join(__dirname, 'downloads', filename);

    let command;

    if (format === 'mp4') {
        // For video conversion to MP4
        command = `yt-dlp -f best --output "${filepath}" --recode-video mp4 "${url}"`;
    } else if (format === 'mp3') {
        // For audio extraction to MP3
        command = `yt-dlp --extract-audio --audio-format mp3 --output "${filepath}" "${url}"`;
    } else {
        return res.status(400).json({ success: false, message: 'Invalid format' });
    }

    // Execute the yt-dlp command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ success: false, message: 'File conversion failed' });
        }

        if (stderr) {
            console.error(`Stderr: ${stderr}`);
        }

        console.log(`Stdout: ${stdout}`);

        // Respond with the URL to the converted file
        res.json({
            success: true,
            fileUrl: `/downloads/${filename}`
        });
    });
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
