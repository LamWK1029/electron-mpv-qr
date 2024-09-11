const { app, BrowserWindow } = require("electron");
const MPV = require("node-mpv");

let mainWindow;
const mpv = new MPV();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", async () => {
  createWindow();

  try {
    await mpv.start();
    mpv.fullscreen();
    mpv.loopPlaylist();
    playVideosSequentially(["video.mp4", "video2.mp4"]);
  } catch (error) {
    console.log(error);
  }
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

function playVideosSequentially(videoFiles) {
  videoFiles.forEach((file, index) => {
    if (index === 0) {
      mpv.load(file);
    } else {
      mpv.load(file, "append");
    }
  });
}
