/**
 * @author Muhamad Fadlan - Backend Dev
 * @description Auto-backup & restart bot jika terjadi error
 */

process.removeAllListeners("warning");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { google } = require("googleapis");
const chalk = require("chalk");
const { spawn } = require("child_process");

const credsBase64 = process.env.GOOGLE_CREDS_BASE64;
const credsJson = Buffer.from(credsBase64, "base64").toString("utf-8");
const CREDENTIALS_PATH = path.join(__dirname, "google-creds.json");

fs.writeFileSync(CREDENTIALS_PATH, credsJson);

const FOLDER_ID = "1lSkBNqnevpLkfXpgUNizeiuNAu71RIFQ";
const PROJECT_DIR = path.resolve(__dirname);
const BOT_FILE = path.join(__dirname, "alpha.js");

const auth = new google.auth.GoogleAuth({
  keyFile: CREDENTIALS_PATH,
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});
const drive = google.drive({ version: "v3", auth });

let botProcess = null;

function getTimestamp() {
  const now = new Date();
  now.setUTCHours(now.getUTCHours() + 7);
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(now.getSeconds()).padStart(2, "0")}`;
}

async function createBackup() {
  return new Promise((resolve, reject) => {
    console.log(chalk.bgBlue.bold(" 🚀 Membuat backup... "));

    const BACKUP_FILE = path.join(__dirname, `backupBot_${getTimestamp()}.zip`);
    if (fs.existsSync(BACKUP_FILE)) fs.unlinkSync(BACKUP_FILE);

    const output = fs.createWriteStream(BACKUP_FILE);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", async () => {
      console.log(chalk.greenBright(`✅ Backup selesai (${archive.pointer()} bytes). Mengupload ke Google Drive...`));
      await uploadToDrive(BACKUP_FILE);
      resolve();
    });

    archive.on("error", (err) => {
      console.error(chalk.redBright("❌ Gagal backup: ") + err.message);
      reject(err);
    });

    archive.pipe(output);

    fs.readdirSync(PROJECT_DIR).forEach((file) => {
      if (!["node_modules", "backup_temp", path.basename(BACKUP_FILE)].includes(file)) {
        const srcPath = path.join(PROJECT_DIR, file);
        fs.lstatSync(srcPath).isDirectory()
          ? archive.directory(srcPath, file)
          : archive.file(srcPath, { name: file });
      }
    });

    archive.finalize();
  });
}

async function uploadToDrive(filePath) {
  try {
    const { data } = await drive.files.list({
      q: `'${FOLDER_ID}' in parents and name contains 'backupBot_'`,
      fields: "files(id)",
    });

    for (const file of data.files) {
      await drive.files.delete({ fileId: file.id });
    }

    const fileMetadata = { name: path.basename(filePath), parents: [FOLDER_ID] };
    const media = { mimeType: "application/zip", body: fs.createReadStream(filePath) };

    await drive.files.create({ resource: fileMetadata, media, fields: "id" });

    fs.unlinkSync(filePath);
  } catch (error) {
    console.error(chalk.redBright("❌ Gagal upload backup: ") + error.message);
  }
}

function startBot() {
  
  if (!fs.existsSync(BOT_FILE)) return console.error(chalk.redBright("❌ File bot tidak ditemukan: ") + BOT_FILE);

  console.log(chalk.yellow("📌 Menjalankan Bot..."));

  if (botProcess) botProcess.kill();

  botProcess = spawn("node", [BOT_FILE], { stdio: "inherit" });

  botProcess.on("exit", async (code) => {
    console.error(chalk.magenta("⚠️ Bot exited with code: ") + code);
    console.log(chalk.bgBlue("🔄 Memulai ulang setelah backup ulang..."));

   await createBackup();
    startBot();
  });
}

(async () => {
  await createBackup();
  startBot();
})();
