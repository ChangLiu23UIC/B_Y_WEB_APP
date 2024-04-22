const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, 'index.html'), function (err) { 
        if (err) { 
            console.log(err); 
            res.status(500).send('Server Error'); 
        } 
    });
});

app.post('/process-data', (req, res) => {
    const inputString = req.body.data;

    const pythonProcess = exec('python python/main.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send(stderr);
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(stdout);
    });

    pythonProcess.stdin.write(inputString);
    pythonProcess.stdin.end();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Open the default browser after the server starts
    switch (process.platform) { 
        case 'darwin':
            exec(`open http://localhost:${PORT}`);
            break;
        case 'win32':
            exec(`start http://localhost:${PORT}`);
            break;
        default:
            exec(`xdg-open http://localhost:${PORT}`);
            break;
    }
});