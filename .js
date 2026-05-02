const express = require("express");
const serverless = require("serverless-http");

const app = express();

// Middleware untuk membaca data dari form HTML
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Fungsi sederhana untuk mencegah karakter HTML berbahaya ditampilkan langsung
function escapeHtml(value) {
  if (!value) return "";

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Route cek backend
app.get("/cek", function (req, res) {
  res.json({
    status: "aktif",
    message: "Backend Netlify Function berhasil berjalan",
  });
});

// Route untuk menerima data form dari HTML
app.post("/halaman-proses-data", function (req, res) {
  const nama = req.body.sender_name;
  const email = req.body.user_email;
  const subjek = req.body.message_subject;
  const isiPesan = req.body.message_body;

  // Validasi agar data tidak kosong
  if (!nama || !email || !subjek || !isiPesan) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Data Tidak Lengkap</title>
        <style>
          body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            font-family: Arial, sans-serif;
            background: #eef4ff;
            color: #172033;
          }

          .card {
            width: min(92%, 600px);
            padding: 28px;
            border-radius: 22px;
            background: #ffffff;
            box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
          }

          h1 {
            margin-top: 0;
            color: #dc2626;
          }

          a {
            display: inline-block;
            margin-top: 16px;
            padding: 10px 18px;
            border-radius: 999px;
            background: #2563eb;
            color: white;
            text-decoration: none;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Data belum lengkap</h1>
          <p>Mohon isi nama, email, subjek, dan isi pesan terlebih dahulu.</p>
          <a href="/#pesan">Kembali ke form</a>
        </div>
      </body>
      </html>
    `);
  }

  // Amankan data sebelum ditampilkan ke halaman HTML
  const namaAman = escapeHtml(nama);
  const emailAman = escapeHtml(email);
  const subjekAman = escapeHtml(subjek);
  const isiPesanAman = escapeHtml(isiPesan);

  console.log("Data pesan masuk:");
  console.log("Nama:", nama);
  console.log("Email:", email);
  console.log("Subjek:", subjek);
  console.log("Isi Pesan:", isiPesan);

  res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Pesan Berhasil</title>

      <style>
        body {
          margin: 0;
          min-height: 100vh;
          display: grid;
          place-items: center;
          font-family: Arial, sans-serif;
          background: #eef4ff;
          color: #172033;
        }

        .card {
          width: min(92%, 600px);
          padding: 28px;
          border-radius: 22px;
          background: #ffffff;
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
        }

        h1 {
          margin-top: 0;
          color: #2563eb;
        }

        p {
          line-height: 1.6;
        }

        a {
          display: inline-block;
          margin-top: 16px;
          padding: 10px 18px;
          border-radius: 999px;
          background: #2563eb;
          color: white;
          text-decoration: none;
          font-weight: bold;
        }
      </style>
    </head>

    <body>
      <div class="card">
        <h1>Pesan Berhasil Dikirim</h1>

        <p><strong>Nama:</strong> ${namaAman}</p>
        <p><strong>Email:</strong> ${emailAman}</p>
        <p><strong>Subjek:</strong> ${subjekAman}</p>
        <p><strong>Isi Pesan:</strong> ${isiPesanAman}</p>

        <a href="/#pesan">Kembali ke halaman utama</a>
      </div>
    </body>
    </html>
  `);
});

// Export app sebagai Netlify Function
module.exports.handler = serverless(app);