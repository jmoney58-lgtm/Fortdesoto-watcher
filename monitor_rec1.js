import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const POLL_INTERVAL = (process.env.POLL_INTERVAL_SECONDS || 60) * 1000;

const TARGET_URL = "https://secure.rec1.com/FL/pinellas-county-fl/catalog/index/0a87a6fe98b93da3d0c297fc5260b8f4";

// Fort De Soto: pet-friendly sites = 86–164
const PET_FRIENDLY_MIN = 86;
const PET_FRIENDLY_MAX = 164;

async function checkAvailability() {
  try {
    console.log("Checking Fort De Soto…");

    const res = await fetch(TARGET_URL);
    const html = await res.text();

    let availableSites = [];
    for (let i = PET_FRIENDLY_MIN; i <= PET_FRIENDLY_MAX; i++) {
      const pattern = new RegExp(`Site\\s*${i}[^<]*available`, "i");
      if (pattern.test(html)) {
        availableSites.push(i);
      }
    }

    if (availableSites.length > 0) {
      console.log("🚨 SITE AVAILABLE!", availableSites);
      sendAlert(availableSites.join(", "));
    } else {
      console.log("No pet-friendly sites available.");
    }

  } catch (err) {
    console.error("Error:", err);
  }
}

function sendAlert(sites) {
  console.log("🚨 Alert! Sites open:", sites);
}

console.log("Watcher started. Checking every", POLL_INTERVAL / 1000, "seconds.");
checkAvailability();
setInterval(checkAvailability, POLL_INTERVAL);
