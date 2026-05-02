app.get("/cek", function (req, res) {
  res.json({
    status: "aktif",
    message: "Backend Netlify Function berhasil berjalan",
  });
});

app.post("/halaman-proses-data", function (req, res) {
  // proses data form di sini
});