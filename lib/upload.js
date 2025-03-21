// lib/upload.js
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const { fromBuffer } = require("file-type");
const path = require("path");
const fakeUserAgent = require("fake-useragent");
const { filesize } = require('filesize');
// Perbaikan import HttpsProxyAgent
const { HttpsProxyAgent } = require('https-proxy-agent');
const createFormData = (content, fieldName, ext) => {
  const { mime } = fromBuffer(content) || {};
  const formData = new FormData();
  formData.append(fieldName, content, `${new Date()}.${ext}`);
  return formData;
};
async function getWorkingProxy() {
  try {
    // Mengambil daftar proxy gratis dari API
    const response = await axios.get('https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all');
    const proxies = response.data.split('\n').filter(proxy => proxy.trim() !== '');
    
    // Jika tidak ada proxy yang ditemukan, kembalikan null
    if (proxies.length === 0) return null;
    
    // Pilih proxy secara acak
    const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];
    return `http://${randomProxy}`;
  } catch (error) {
    console.error('Gagal mendapatkan daftar proxy:', error.message);
    // Alternatif beberapa proxy publik gratis
    const fallbackProxies = [
      'http://103.152.112.162:80',
      'http://103.83.232.122:80',
      'http://103.117.192.14:80',
      'http://175.106.17.62:57406',
      'http://36.91.203.101:8080'
    ];
    return fallbackProxies[Math.floor(Math.random() * fallbackProxies.length)];
  }
}
async function catbox(m, conn) {
  return new Promise(async (resolve, reject) => {
    try {
      let q = m.quoted ? m.quoted : m;
      let mime = (q.msg || q).mimetype || "";
      if (!mime) return conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });

      let content = await q.download();
      console.log(`File size: ${content.length} bytes`);

      // **Cek batas ukuran maksimal (200MB)**
      if (content.length > 200 * 1024 * 1024) {
        return reject(new Error("File terlalu besar untuk diunggah ke Catbox"));
      }

      conn.sendMessage(m.chat, { react: { text: "⏱", key: m.key } });

      // **Pastikan ekstensi valid**
      const { ext, mime: fileMime } = (await fromBuffer(content)) || {};
      if (!ext) {
        return reject(new Error("Gagal menentukan format file"));
      }

      // **Gunakan stream untuk upload**
      let filePath = `./temp/upload.${ext}`;
      fs.writeFileSync(filePath, content);

      let formData = new FormData();
      formData.append("reqtype", "fileupload");
      formData.append("fileToUpload", fs.createReadStream(filePath));

      const response = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: formData,
        headers: {
          ...formData.getHeaders(),
          "User-Agent": "Mozilla/5.0",
        },
      });

      if (!response.ok) throw new Error(`Gagal upload: ${response.statusText}`);

      const link = await response.text();
      if (!link.startsWith("https://")) throw new Error("Upload gagal: respon tidak valid");

      console.log(`Link: ${link}`);
      fs.unlinkSync(filePath); // Hapus file sementara setelah upload selesai

      let size = content.length;
      let caption = `*SUCCESS UPLOAD FILE*\n\n🔗 *LINK :* ${link} !\n📊 *SIZE :* ${size} Byte`;

      resolve({ success: true, media: { type: "photo", caption, url: link, size } });
    } catch (error) {
      console.log(error);
      reject(new Error("Gagal mengunggah gambar ke Catbox"));
    }
  });
}

function TelegraPh(Path) {
  return new Promise(async (resolve, reject) => {
    if (!fs.existsSync(Path)) return reject(new Error("File not Found"));
    
    // Pertama coba tanpa proxy
    try {
      console.log("Mencoba upload tanpa proxy...");
      const form = new FormData();
      
      // Baca file dan tambahkan ke form
      const fileBuffer = fs.readFileSync(Path);
      const fileName = Path.split('/').pop();
      
      form.append("file", fileBuffer, {
        filename: fileName,
        contentType: getMimeType(fileName)
      });
      
      const response = await axios({
        url: "https://telegra.ph/upload",
        method: "POST",
        headers: {
          ...form.getHeaders(),
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        data: form,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 15000
      });
      
      if (response.data && response.data[0] && response.data[0].src) {
        return resolve("https://telegra.ph" + response.data[0].src);
      }
    } catch (directErr) {
      console.log("Upload tanpa proxy gagal:", directErr.message);
      // Jika gagal tanpa proxy, coba dengan proxy
      
      try {
        // Dapatkan proxy yang berfungsi
        const proxy = await getWorkingProxy();
        console.log(`Mencoba menggunakan proxy: ${proxy}`);
        
        // Buat agent proxy jika proxy tersedia
        let httpsAgent = null;
        if (proxy) {
          try {
            httpsAgent = new HttpsProxyAgent(proxy);
          } catch (proxyErr) {
            console.error("Error membuat proxy agent:", proxyErr.message);
            // Jika HttpsProxyAgent error, coba dengan metode lain
            httpsAgent = null;
          }
        }
        
        const form = new FormData();
        
        // Baca file dan tambahkan ke form
        const fileBuffer = fs.readFileSync(Path);
        const fileName = Path.split('/').pop();
        
        form.append("file", fileBuffer, {
          filename: fileName,
          contentType: getMimeType(fileName)
        });
        
        // Konfigurasi request dengan proxy
        const config = {
          url: "https://telegra.ph/upload",
          method: "POST",
          headers: {
            ...form.getHeaders(),
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          data: form,
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          timeout: 30000 // timeout 30 detik
        };
        
        // Tambahkan httpsAgent jika proxy tersedia
        if (httpsAgent) {
          config.httpsAgent = httpsAgent;
        }
        
        const response = await axios(config);
        
        if (response.data && response.data[0] && response.data[0].src) {
          return resolve("https://telegra.ph" + response.data[0].src);
        } else {
          console.error("Respons API Telegraph:", response.data);
          return reject(new Error("Invalid response from Telegraph API"));
        }
      } catch (err) {
        console.error("Error lengkap:", err);
        return reject(new Error(String(err)));
      }
    }
  });
}

// Fungsi untuk mendapatkan MIME type berdasarkan ekstensi file
function getMimeType(fileName) {
  const extension = fileName.split('.').pop().toLowerCase();
  const mimeTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'mp4': 'video/mp4'
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
}

// Versi sederhana tanpa proxy jika masih bermasalah
function TelegraPh_NoProxy(Path) {
  return new Promise(async (resolve, reject) => {
    if (!fs.existsSync(Path)) return reject(new Error("File not Found"));
    
    try {
      const form = new FormData();
      
      // Baca file dan tambahkan ke form
      const fileBuffer = fs.readFileSync(Path);
      const fileName = Path.split('/').pop();
      
      form.append("file", fileBuffer, {
        filename: fileName,
        contentType: getMimeType(fileName)
      });
      
      const response = await axios({
        url: "https://telegra.ph/upload",
        method: "POST",
        headers: {
          ...form.getHeaders(),
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        data: form,
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      });
      
      if (response.data && response.data[0] && response.data[0].src) {
        return resolve("https://telegra.ph" + response.data[0].src);
      } else {
        console.error("Respons API Telegraph:", response.data);
        return reject(new Error("Invalid response from Telegraph API"));
      }
    } catch (err) {
      console.error("Error lengkap:", err);
      return reject(new Error(String(err)));
    }
  });
}
async function uploadBufferToTelegraph(buffer, fileName = "image.jpg") {
  console.log("Debug Buffer:", buffer);
  if (!Buffer.isBuffer(buffer)) throw new Error("Buffer tidak valid");

  const form = new FormData();
  form.append("file", buffer, { filename: fileName, contentType: "image/jpeg" });

  console.log("FormData Boundary:", form.getBoundary());
  console.log("FormData Length:", form.getLengthSync());
  const headers = form.getHeaders();
  console.log("Headers:", headers);

  const response = await fetch("https://telegra.ph/upload", {
    method: "POST",
    body: form,
    headers,
  });

  console.log("Status Respon:", response.status, response.statusText);
  const result = await response.text();
  console.log("Respon Mentah:", result);

  let parsedResult;
  try {
    parsedResult = JSON.parse(result);
  } catch (e) {
    throw new Error("Respon dari Telegraph bukan JSON: " + result);
  }

  if (!parsedResult || parsedResult.error) {
    throw new Error("Gagal upload ke Telegraph: " + (parsedResult.error || "Respon kosong"));
  }
  return "https://telegra.ph" + parsedResult[0].src;
}
async function kucingBox(m, conn) {
  const fs = require("fs").promises;
  return new Promise(async (resolve, reject) => {
    try {
      let q = m.quoted ? m.quoted : m;
      let mime = (q.msg || q).mimetype || '';
      if (!mime) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        return reject(new Error("No media found"));
      }

      await conn.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });

      // Download media sebagai buffer
      let media = await q.download();
      
      // Simpan buffer ke file sementara
      const tempFilePath = path.join(__dirname, `temp-${Date.now()}.tmp`);
      await fs.writeFile(tempFilePath, media);

      // Unggah ke Catbox
      const { ext } = (await fromBuffer(media)) || {};
      if (!ext) throw new Error("Gagal menentukan format file");

      let formData = createFormData(media, "fileToUpload", ext);
      formData.append("reqtype", "fileupload");

      const response = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: formData,
        headers: {
          "User-Agent": fakeUserAgent(),
        },
      });

      if (!response.ok) throw new Error(`Gagal upload: ${response.statusText}`);
      const link = await response.text();
      if (!link.startsWith("https://")) throw new Error("Upload gagal: respon tidak valid");

      // Hapus file sementara
      await fs.unlink(tempFilePath);

      // Resolve hanya dengan URL
      resolve(link);
    } catch (error) {
      console.error("Error in tourl:", error);
      reject(new Error("Gagal mengunggah file: " + error.message));
    }
  });
}
module.exports = { TelegraPh, TelegraPh_NoProxy, kucingBox, catbox,uploadBufferToTelegraph};