const { app, BrowserWindow, dialog } = require("electron");
const http = require("node:http");
const path = require("node:path");

const PORT = 3210;

function getAppRoot() {
  return app.isPackaged
    ? path.join(process.resourcesPath, "app")
    : path.join(__dirname, "..");
}

function waitForServer(url, attempts = 60) {
  return new Promise((resolve, reject) => {
    const check = (remaining) => {
      const request = http.get(url, (response) => {
        response.resume();
        if (response.statusCode >= 200 && response.statusCode < 500) {
          resolve();
        } else if (remaining > 0) {
          setTimeout(() => check(remaining - 1), 250);
        } else {
          reject(new Error(`Локальный сервер вернул HTTP ${response.statusCode}`));
        }
      });
      request.on("error", () => {
        if (remaining > 0) setTimeout(() => check(remaining - 1), 250);
        else reject(new Error("Не удалось запустить локальный сервер"));
      });
      request.setTimeout(1000, () => request.destroy());
    };
    check(attempts);
  });
}

async function startServer() {
  const root = getAppRoot();
  const standaloneServer = app.isPackaged
    ? path.join(root, "server.js")
    : path.join(root, ".next", "standalone", "server.js");

  process.env.NODE_ENV = "production";
  process.env.PORT = String(PORT);
  process.env.HOSTNAME = "127.0.0.1";
  process.chdir(root);

  try {
    require(standaloneServer);
    await waitForServer(`http://127.0.0.1:${PORT}/`);
  } catch (error) {
    dialog.showErrorBox("Генератор пушей", `${error.message}\n\nПуть: ${standaloneServer}`);
    throw error;
  }
}

async function createWindow() {
  await startServer();
  const window = new BrowserWindow({
    width: 1440,
    height: 950,
    minWidth: 1100,
    minHeight: 700,
    title: "Генератор пушей",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  await window.loadURL(`http://127.0.0.1:${PORT}/app`);
}

app.whenReady().then(createWindow).catch(() => app.quit());
app.on("window-all-closed", () => app.quit());
