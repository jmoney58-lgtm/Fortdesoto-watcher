const dotenv = require("dotenv");
dotenv.config();

const POLL_INTERVAL =
  parseInt(process.env.POLL_INTERVAL_SECONDS || "60", 10) * 1000;

const TARGET_URL =
  "https://secure.rec1.com/FL/pinellas-county-fl/catalog/index/0a87a6fe98b93da3d0c297fc5260b8f4";

// Fort De Soto: pet-friendly sites 86–164
const PET_FRIENDLY_MIN = 86;
const PET_FRIENDLY_MAX = 164;

async function checkAvailability() {
  try {
    console.log("Checking Fort De Soto…");

    // Node 18+ on Render has global fetch
    const res = await fetch(TARGET_URL);
    const html = await res.text();

    const availableSites = [];

    for (let i = PET_FRIENDLY_MIN; i <= PET_FRIENDLY_MAX; i++) {
      // Look for the site number and nearby "Available"/"Reserve"/"Book"
      const pattern = new RegExp(
        `\\b${i}\\b[\\s\\s]{0,200}?(Available|Reserve|Book|Select|Open)`,
        "i"
      );
      if (pattern.test(html)) {
        availableSites.push(i);
      }
    }

    if (availableSites.length > 0) {
      console.log("🚨 SITE AVAILABLE!", availableSites.join(", "));
    } else {
      console.log("No pet-friendly sites available.");
    }
  } catch (err) {
    console.error("Error while checking:", err);
  }
}

console.log(
  "Watcher started. Checking every",
  POLL_INTERVAL / 1000,
  "seconds."
);
checkAvailability();
setInterval(checkAvailability, POLL_INTERVAL);
