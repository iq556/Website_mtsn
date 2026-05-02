/* =========================
   SIDEBAR MENU
========================= */
const sidebar = document.getElementById("sidebarMenu");
const backdrop = document.getElementById("sidebarBackdrop");
const openSidebarBtn = document.getElementById("openSidebarBtn");
const navLinks = document.querySelectorAll(".side-nav a");
const sections = document.querySelectorAll("main section[id]");

function openSidebar() {
  sidebar?.classList.add("show");
  backdrop?.classList.add("show");
}

function closeSidebar() {
  sidebar?.classList.remove("show");
  backdrop?.classList.remove("show");
}

function setActiveMenu(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
  });
}

function setActiveMenuFromHash() {
  const hash = window.location.hash.replace("#", "");

  if (hash) {
    setActiveMenu(hash);
  } else {
    setActiveMenu("beranda");
  }
}

openSidebarBtn?.addEventListener("click", openSidebar);
backdrop?.addEventListener("click", closeSidebar);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const id = link.getAttribute("href").replace("#", "");
    setActiveMenu(id);
    closeSidebar();
  });
});

if (sections.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveMenu(entry.target.id);
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: "-20% 0px -55% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
}

window.addEventListener("load", setActiveMenuFromHash);
window.addEventListener("hashchange", setActiveMenuFromHash);


/* =========================
   QUIZ SUHU & KALOR
========================= */
const quizData = [
  {
    question: "Satuan suhu dalam Sistem Internasional adalah...",
    options: ["Celsius", "Kelvin", "Fahrenheit", "Reamur"],
    answer: "Kelvin",
  },
  {
    question: "Rumus untuk menghitung kalor adalah...",
    options: ["Q = m.c.ΔT", "F = m.a", "P = W/t", "V = I.R"],
    answer: "Q = m.c.ΔT",
  },
  {
    question: "Suhu 100°C sama dengan berapa Kelvin?",
    options: ["273 K", "373 K", "100 K", "212 K"],
    answer: "373 K",
  },
  {
    question: "Air memiliki kalor jenis sekitar...",
    options: ["4200 J/kg°C", "900 J/kg°C", "385 J/kg°C", "130 J/kg°C"],
    answer: "4200 J/kg°C",
  },
  {
    question: "Dalam Asas Black, kalor yang dilepas benda panas akan...",
    options: [
      "Diterima oleh benda dingin",
      "Hilang begitu saja",
      "Menjadi cahaya",
      "Menjadi massa",
    ],
    answer: "Diterima oleh benda dingin",
  },
];

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

const quizProgressText = document.getElementById("quizProgressText");
const quizScoreText = document.getElementById("quizScoreText");
const quizProgressBar = document.getElementById("quizProgressBar");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const quizFeedback = document.getElementById("quizFeedback");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");
const restartQuizBtn = document.getElementById("restartQuizBtn");

function loadQuestion() {
  if (
    !quizProgressText ||
    !quizScoreText ||
    !quizProgressBar ||
    !quizQuestion ||
    !quizOptions ||
    !quizFeedback
  ) {
    return;
  }

  selectedAnswer = null;

  const data = quizData[currentQuestion];

  quizQuestion.textContent = data.question;
  quizOptions.innerHTML = "";
  quizFeedback.textContent = "Pilih salah satu jawaban.";
  quizFeedback.className = "text-secondary";

  quizProgressText.textContent = `Soal ${currentQuestion + 1} dari ${quizData.length}`;
  quizScoreText.textContent = `Skor: ${score}`;

  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  quizProgressBar.style.width = `${progress}%`;

  data.options.forEach((option) => {
    const col = document.createElement("div");
    col.className = "col-md-6";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-outline-primary w-100 rounded-pill py-3 quiz-option";
    button.textContent = option;

    button.addEventListener("click", () => {
      selectedAnswer = option;

      document.querySelectorAll(".quiz-option").forEach((btn) => {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-outline-primary");
      });

      button.classList.remove("btn-outline-primary");
      button.classList.add("btn-primary");

      if (option === data.answer) {
        quizFeedback.textContent = "Benar! Jawaban kamu tepat.";
        quizFeedback.className = "text-success fw-semibold";
      } else {
        quizFeedback.textContent = `Kurang tepat. Jawaban yang benar adalah ${data.answer}.`;
        quizFeedback.className = "text-danger fw-semibold";
      }
    });

    col.appendChild(button);
    quizOptions.appendChild(col);
  });
}

nextQuestionBtn?.addEventListener("click", () => {
  if (!quizFeedback || !quizQuestion || !quizOptions) {
    return;
  }

  if (!selectedAnswer) {
    quizFeedback.textContent = "Pilih jawaban terlebih dahulu.";
    quizFeedback.className = "text-warning fw-semibold";
    return;
  }

  if (selectedAnswer === quizData[currentQuestion].answer) {
    score += 20;
  }

  currentQuestion++;

  if (currentQuestion >= quizData.length) {
    quizQuestion.textContent = "Kuis selesai!";
    quizOptions.innerHTML = "";
    quizFeedback.innerHTML = `Skor akhir kamu adalah <strong>${score}</strong> dari 100.`;
    quizFeedback.className = "text-primary fw-semibold";

    if (quizProgressText) {
      quizProgressText.textContent = "Selesai";
    }

    if (quizScoreText) {
      quizScoreText.textContent = `Skor: ${score}`;
    }

    if (quizProgressBar) {
      quizProgressBar.style.width = "100%";
    }

    nextQuestionBtn.disabled = true;
    return;
  }

  loadQuestion();
});

restartQuizBtn?.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  selectedAnswer = null;

  if (nextQuestionBtn) {
    nextQuestionBtn.disabled = false;
  }

  loadQuestion();
});

loadQuestion();
 
/* =========================
   KALKULATOR KALOR
========================= */
const massInput = document.getElementById("massInput");
const specificHeatInput = document.getElementById("specificHeatInput");
const deltaTemperatureInput = document.getElementById("deltaTemperatureInput");
const materialPreset = document.getElementById("materialPreset");
const heatResult = document.getElementById("heatResult");

materialPreset?.addEventListener("change", function () {
  specificHeatInput.value = materialPreset.value;
});

function hitungKalor() {
  const massa = parseFloat(massInput.value);
  const kalorJenis = parseFloat(specificHeatInput.value);
  const deltaT = parseFloat(deltaTemperatureInput.value);

  if (isNaN(massa) || isNaN(kalorJenis) || isNaN(deltaT)) {
    heatResult.textContent = "Mohon isi massa, kalor jenis, dan ΔT terlebih dahulu.";
    return;
  }

  const Q = massa * kalorJenis * deltaT;

  heatResult.textContent =
    "Energi kalor = " + Q.toLocaleString("id-ID") + " Joule";
}
/* =========================
   KONVERSI SUHU REAL-TIME
========================= */
const temperatureInput = document.getElementById("temperatureInput");
const temperatureUnit = document.getElementById("temperatureUnit");

const celsiusResult = document.getElementById("celsiusResult");
const fahrenheitResult = document.getElementById("fahrenheitResult");
const reamurResult = document.getElementById("reamurResult");
const kelvinResult = document.getElementById("kelvinResult");

function konversiSuhu() {
  const nilaiSuhu = parseFloat(temperatureInput.value);
  const satuanAsal = temperatureUnit.value;

  if (isNaN(nilaiSuhu)) {
    celsiusResult.textContent = "Celsius: -";
    fahrenheitResult.textContent = "Fahrenheit: -";
    reamurResult.textContent = "Reamur: -";
    kelvinResult.textContent = "Kelvin: -";
    return;
  }

  let celsius;

  if (satuanAsal === "celsius") {
    celsius = nilaiSuhu;
  } else if (satuanAsal === "fahrenheit") {
    celsius = (nilaiSuhu - 32) * 5 / 9;
  } else if (satuanAsal === "reamur") {
    celsius = nilaiSuhu * 5 / 4;
  } else if (satuanAsal === "kelvin") {
    celsius = nilaiSuhu - 273.15;
  }

  const fahrenheit = (celsius * 9 / 5) + 32;
  const reamur = celsius * 4 / 5;
  const kelvin = celsius + 273.15;

  celsiusResult.textContent = "Celsius: " + celsius.toFixed(2) + " °C";
  fahrenheitResult.textContent = "Fahrenheit: " + fahrenheit.toFixed(2) + " °F";
  reamurResult.textContent = "Reamur: " + reamur.toFixed(2) + " °R";
  kelvinResult.textContent = "Kelvin: " + kelvin.toFixed(2) + " K";
}

temperatureInput?.addEventListener("input", konversiSuhu);
temperatureUnit?.addEventListener("change", konversiSuhu);

/* =========================
   WOKWI SIMULATION TANPA BLYNK
   Rumus:
   tinggiAir = tinggiWadah - jarakSensor
   V balok = p x l x h
   V tabung = π x r² x h
   m = ρ x V
   Q = m x c x ΔT
=========================*/

const wokwiSuhuInput = document.getElementById("wokwiSuhuInput");
const wokwiSuhuAwalInput = document.getElementById("wokwiSuhuAwalInput");
const wokwiKelembabanInput = document.getElementById("wokwiKelembabanInput");
const wokwiJarakInput = document.getElementById("wokwiJarakInput");
const wokwiTinggiWadahInput = document.getElementById("wokwiTinggiWadahInput");
const wokwiBentukWadahInput = document.getElementById("wokwiBentukWadahInput");
const wokwiPanjangInput = document.getElementById("wokwiPanjangInput");
const wokwiLebarInput = document.getElementById("wokwiLebarInput");
const wokwiJariJariInput = document.getElementById("wokwiJariJariInput");
const wokwiMassaInput = document.getElementById("wokwiMassaInput");
const wokwiKalorJenisInput = document.getElementById("wokwiKalorJenisInput");
const wokwiDeltaInput = document.getElementById("wokwiDeltaInput");

const hitungWokwiBtn = document.getElementById("hitungWokwiBtn");
const simulasiOtomatisBtn = document.getElementById("simulasiOtomatisBtn");
const stopSimulasiBtn = document.getElementById("stopSimulasiBtn");

const wokwiSuhuOutput = document.getElementById("wokwiSuhuOutput");
const wokwiKelembabanOutput = document.getElementById("wokwiKelembabanOutput");
const wokwiJarakOutput = document.getElementById("wokwiJarakOutput");
const wokwiTinggiAirOutput = document.getElementById("wokwiTinggiAirOutput");
const wokwiVolumeOutput = document.getElementById("wokwiVolumeOutput");
const wokwiMassaDipakaiOutput = document.getElementById("wokwiMassaDipakaiOutput");
const wokwiKalorOutput = document.getElementById("wokwiKalorOutput");
const wokwiRelayOutput = document.getElementById("wokwiRelayOutput");
const wokwiLedOutput = document.getElementById("wokwiLedOutput");
const wokwiBuzzerOutput = document.getElementById("wokwiBuzzerOutput");
const wokwiServoOutput = document.getElementById("wokwiServoOutput");

const wokwiStatusOutput = document.getElementById("wokwiStatusOutput");
const wokwiActionOutput = document.getElementById("wokwiActionOutput");

let wokwiSimulationTimer = null;
let wokwiAutoStopTimer = null;

const BATAS_WAKTU_SIMULASI = 10000;
const MASSA_JENIS_AIR = 1000; // kg/m3
const TARGET_SUHU_OVEN = 60; // derajat Celsius

function setElementText(element, value) {
  if (element) {
    element.textContent = value;
  }
}

function getInputNumber(input) {
  if (!input || input.value.trim() === "") {
    return NaN;
  }

  return Number(input.value.replace(",", "."));
}

function formatAngka(value, digit = 1) {
  if (Number.isNaN(value)) {
    return "-";
  }

  return value.toFixed(digit);
}

function cmKeMeter(nilaiCm) {
  return nilaiCm / 100;
}

function hitungTinggiAir(tinggiWadahCm, jarakSensorCm) {
  const tinggiAirCm = tinggiWadahCm - jarakSensorCm;

  if (tinggiAirCm < 0) {
    return 0;
  }

  return tinggiAirCm;
}

function hitungVolumeAirM3(bentukWadah, tinggiAirCm, panjangCm, lebarCm, jariJariCm) {
  const tinggiAirM = cmKeMeter(tinggiAirCm);

  if (bentukWadah === "balok") {
    if (Number.isNaN(panjangCm) || Number.isNaN(lebarCm)) {
      return NaN;
    }

    const panjangM = cmKeMeter(panjangCm);
    const lebarM = cmKeMeter(lebarCm);

    return panjangM * lebarM * tinggiAirM;
  }

  if (bentukWadah === "tabung") {
    if (Number.isNaN(jariJariCm)) {
      return NaN;
    }

    const jariJariM = cmKeMeter(jariJariCm);

    return Math.PI * Math.pow(jariJariM, 2) * tinggiAirM;
  }

  return NaN;
}

function hitungKalorWokwi(massaKg, kalorJenis, deltaSuhu) {
  return massaKg * kalorJenis * deltaSuhu;
}

function getStatusSistem(jarakSensorCm, tinggiWadahCm, kalor) {
  if (jarakSensorCm >= tinggiWadahCm) {
    return {
      label: "KOSONG",
      className: "status-kosong",
      relay: "ON",
      led: kalor > 0 ? "ON" : "OFF",
      buzzer: "ON",
      servo: "90°",
      action:
        "Air kosong. Relay aktif, buzzer menyala, dan servo bergerak ke 90° sesuai logika ESP32.",
    };
  }

  if (jarakSensorCm < 10) {
    return {
      label: "PENUH",
      className: "status-penuh",
      relay: "OFF",
      led: kalor > 0 ? "ON" : "OFF",
      buzzer: "OFF",
      servo: "0°",
      action:
        "Air penuh. Relay mati, buzzer mati, dan servo berada di 0° sesuai logika ESP32.",
    };
  }

  return {
    label: "AMAN",
    className: "status-aman",
    relay: "OFF",
    led: kalor > 0 ? "ON" : "OFF",
    buzzer: "OFF",
    servo: "0°",
    action:
      "Kondisi air aman. Sistem membaca sensor dan menghitung kalor secara normal.",
  };
}

function tampilkanErrorWokwi(message) {
  if (wokwiStatusOutput) {
    wokwiStatusOutput.textContent = message;
    wokwiStatusOutput.className = "text-danger fw-semibold";
  }

  setElementText(wokwiActionOutput, "-");
}

function stopSimulasiWokwi(pesan, className = "text-secondary", action = "-") {
  clearInterval(wokwiSimulationTimer);
  clearTimeout(wokwiAutoStopTimer);

  wokwiSimulationTimer = null;
  wokwiAutoStopTimer = null;

  if (wokwiStatusOutput) {
    wokwiStatusOutput.textContent = pesan;
    wokwiStatusOutput.className = className;
  }

  setElementText(wokwiActionOutput, action);
}

function hitungSimulasiWokwi() {
  if (!wokwiSuhuInput) {
    return;
  }

  const suhuAkhir = getInputNumber(wokwiSuhuInput);
  const suhuAwal = getInputNumber(wokwiSuhuAwalInput);
  const kelembaban = getInputNumber(wokwiKelembabanInput);
  const jarakSensorCm = getInputNumber(wokwiJarakInput);
  const tinggiWadahCm = getInputNumber(wokwiTinggiWadahInput);
  const bentukWadah = wokwiBentukWadahInput?.value || "balok";

  const panjangCm = getInputNumber(wokwiPanjangInput);
  const lebarCm = getInputNumber(wokwiLebarInput);
  const jariJariCm = getInputNumber(wokwiJariJariInput);

  const massaTimbanganKg = getInputNumber(wokwiMassaInput);
  const kalorJenis = getInputNumber(wokwiKalorJenisInput);

  if (
    Number.isNaN(suhuAkhir) ||
    Number.isNaN(suhuAwal) ||
    Number.isNaN(kelembaban) ||
    Number.isNaN(jarakSensorCm) ||
    Number.isNaN(tinggiWadahCm) ||
    Number.isNaN(kalorJenis)
  ) {
    tampilkanErrorWokwi(
      "Mohon isi suhu akhir, suhu awal, kelembaban, jarak sensor, tinggi wadah, dan kalor jenis."
    );
    return;
  }

  const tinggiAirCm = hitungTinggiAir(tinggiWadahCm, jarakSensorCm);
  const volumeAirM3 = hitungVolumeAirM3(
    bentukWadah,
    tinggiAirCm,
    panjangCm,
    lebarCm,
    jariJariCm
  );

  const adaMassaTimbangan =
    !Number.isNaN(massaTimbanganKg) && massaTimbanganKg > 0;

  if (!adaMassaTimbangan && Number.isNaN(volumeAirM3)) {
    tampilkanErrorWokwi(
      "Isi massa dari timbangan, atau lengkapi ukuran wadah agar massa air bisa dihitung dari volume."
    );
    return;
  }

  const massaDariVolumeKg = Number.isNaN(volumeAirM3)
    ? NaN
    : MASSA_JENIS_AIR * volumeAirM3;

  const massaDipakaiKg = adaMassaTimbangan
    ? massaTimbanganKg
    : massaDariVolumeKg;

  let deltaSuhu = suhuAkhir - suhuAwal;

  if (deltaSuhu < 0) {
  deltaSuhu = 0;
  }

  const kalor = hitungKalorWokwi(massaDipakaiKg, kalorJenis, deltaSuhu);
  const status = getStatusSistem(jarakSensorCm, tinggiWadahCm, kalor);

  if (wokwiDeltaInput) {
    wokwiDeltaInput.value = deltaSuhu.toFixed(2);
  }

  setElementText(wokwiSuhuOutput, `${formatAngka(suhuAkhir, 1)} °C`);
  setElementText(wokwiKelembabanOutput, `${formatAngka(kelembaban, 0)} %`);
  setElementText(wokwiJarakOutput, `${formatAngka(jarakSensorCm, 1)} cm`);
  setElementText(wokwiTinggiAirOutput, `${formatAngka(tinggiAirCm, 1)} cm`);

  if (Number.isNaN(volumeAirM3)) {
    setElementText(wokwiVolumeOutput, "-");
  } else {
    setElementText(wokwiVolumeOutput, `${volumeAirM3.toFixed(5)} m³`);
  }

  setElementText(wokwiMassaDipakaiOutput, `${massaDipakaiKg.toFixed(3)} kg`);
  setElementText(wokwiKalorOutput, `${kalor.toLocaleString("id-ID")} J`);

  setElementText(wokwiRelayOutput, status.relay);
  setElementText(wokwiLedOutput, status.led);
  setElementText(wokwiBuzzerOutput, status.buzzer);
  setElementText(wokwiServoOutput, status.servo);

  if (wokwiStatusOutput) {
    wokwiStatusOutput.innerHTML = `Status: <span class="${status.className}">${status.label}</span>`;
    wokwiStatusOutput.className = "";
  }

  setElementText(
    wokwiActionOutput,
    `${status.action} ΔT = ${deltaSuhu.toFixed(2)}°C, massa yang dipakai = ${massaDipakaiKg.toFixed(3)} kg.`
  );
}

function isiNilaiSimulasiOtomatis() {
  if (!wokwiSuhuInput) {
    return;
  }

  const suhuAwal = 30;
  const suhuAkhirAcak = Math.random() * (75 - 25) + 25;
  const kelembabanAcak = Math.random() * (90 - 45) + 45;
  const tinggiWadah = 50;
  const jarakAcak = Math.random() * (48 - 5) + 5;

  wokwiSuhuInput.value = suhuAkhirAcak.toFixed(1);
  wokwiSuhuAwalInput.value = suhuAwal;
  wokwiKelembabanInput.value = kelembabanAcak.toFixed(0);
  wokwiJarakInput.value = jarakAcak.toFixed(1);
  wokwiTinggiWadahInput.value = tinggiWadah;

  wokwiBentukWadahInput.value = "balok";
  wokwiPanjangInput.value = 20;
  wokwiLebarInput.value = 15;
  wokwiJariJariInput.value = "";

  // Kosongkan massa agar sistem menghitung massa dari volume air.
  wokwiMassaInput.value = "";

  wokwiKalorJenisInput.value = 4200;

  hitungSimulasiWokwi();

  const tinggiAirCm = tinggiWadah - jarakAcak;

  if (tinggiAirCm <= 2) {
    stopSimulasiWokwi(
      "Simulasi berhenti otomatis karena air terlalu sedikit.",
      "text-danger fw-semibold",
      "Relay oven dimatikan demi keamanan."
    );
  }
}

hitungWokwiBtn?.addEventListener("click", () => {
  stopSimulasiWokwi("Simulasi otomatis dihentikan.");
  hitungSimulasiWokwi();
});

simulasiOtomatisBtn?.addEventListener("click", () => {
  clearInterval(wokwiSimulationTimer);
  clearTimeout(wokwiAutoStopTimer);

  isiNilaiSimulasiOtomatis();

  wokwiSimulationTimer = setInterval(() => {
    isiNilaiSimulasiOtomatis();
  }, 2000);

  wokwiAutoStopTimer = setTimeout(() => {
    stopSimulasiWokwi(
      "Simulasi otomatis selesai setelah 10 detik.",
      "text-secondary",
      "Simulasi berhenti karena sudah mencapai batas waktu."
    );
  }, BATAS_WAKTU_SIMULASI);
});

stopSimulasiBtn?.addEventListener("click", () => {
  stopSimulasiWokwi(
    "Simulasi otomatis dihentikan.",
    "text-secondary",
    "-"
  );
});
/* =========================
   ASAS BLACK
========================= */
function hitungAsasBlack() {
  const blackMassHot = document.getElementById("blackMassHot");
  const blackHeatHot = document.getElementById("blackHeatHot");
  const blackTempHot = document.getElementById("blackTempHot");

  const blackMassCold = document.getElementById("blackMassCold");
  const blackHeatCold = document.getElementById("blackHeatCold");
  const blackTempCold = document.getElementById("blackTempCold");

  const result = document.getElementById("blackResult");
  const explanation = document.getElementById("blackExplanation");

  if (
    !blackMassHot ||
    !blackHeatHot ||
    !blackTempHot ||
    !blackMassCold ||
    !blackHeatCold ||
    !blackTempCold ||
    !result ||
    !explanation
  ) {
    return;
  }

  const m1 = parseFloat(blackMassHot.value);
  const c1 = parseFloat(blackHeatHot.value);
  const t1 = parseFloat(blackTempHot.value);

  const m2 = parseFloat(blackMassCold.value);
  const c2 = parseFloat(blackHeatCold.value);
  const t2 = parseFloat(blackTempCold.value);

  if (
    isNaN(m1) || isNaN(c1) || isNaN(t1) ||
    isNaN(m2) || isNaN(c2) || isNaN(t2)
  ) {
    result.textContent = "-";
    explanation.textContent = "Lengkapi semua data terlebih dahulu.";
    explanation.className = "text-danger fw-semibold mb-0";
    return;
  }

  if (m1 <= 0 || c1 <= 0 || m2 <= 0 || c2 <= 0) {
    result.textContent = "-";
    explanation.textContent = "Massa dan kalor jenis harus lebih dari 0.";
    explanation.className = "text-danger fw-semibold mb-0";
    return;
  }

  const suhuCampuran =
    ((m1 * c1 * t1) + (m2 * c2 * t2)) /
    ((m1 * c1) + (m2 * c2));

  result.textContent = suhuCampuran.toFixed(2) + " °C";
  explanation.textContent =
    "Suhu campuran dihitung dari keseimbangan kalor antara benda panas dan benda dingin.";
  explanation.className = "text-secondary mb-0";
}

function resetAsasBlack() {
  const inputIds = [
    "blackMassHot",
    "blackHeatHot",
    "blackTempHot",
    "blackMassCold",
    "blackHeatCold",
    "blackTempCold"
  ];

  inputIds.forEach(function (id) {
    const input = document.getElementById(id);

    if (input) {
      input.value = "";
    }
  });

  const result = document.getElementById("blackResult");
  const explanation = document.getElementById("blackExplanation");

  if (result) {
    result.textContent = "-";
  }

  if (explanation) {
    explanation.textContent = "Masukkan data lalu klik tombol hitung.";
    explanation.className = "text-secondary mb-0";
  }
}