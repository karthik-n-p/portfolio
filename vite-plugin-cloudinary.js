/**
 * vite-plugin-cloudinary.js
 * Auto-fetches photo list from Cloudinary at dev-server start + build time.
 * Output: virtual module "virtual:cloudinary-photos"
 * Usage: import { dynamicPhotos } from "virtual:cloudinary-photos"
 *
 * Add/delete in Cloudinary -> restart dev server -> auto-reflected!
 */
import https from "https"

const VIRTUAL_ID = "virtual:cloudinary-photos"
const RESOLVED_ID = "\0" + VIRTUAL_ID

// Caption pools per folder
const CAPTION_POOLS = {
  thanjavur: [
    "Brihadisvara. thousand years and still standing.",
    "stone engineering that makes modern software look fragile.",
    "monolithic granite pillars, no cranes.",
    "Chola architecture at dusk.",
    "this took a thousand years to build.",
  ],
  sky_moon: [
    "took 47 photos. kept this sunset.",
    "this view was worth the climb.",
    "nobody warned me about this view.",
    "sky on fire at 6pm.",
    "the clouds were doing something.",
    "golden hour, no filter.",
    "stayed for the light.",
    "not everything needs a caption.",
  ],
  portfolio: [
    "somewhere between lost and happy.",
    "finding a good view & staying there.",
    "probably going back.",
    "unnecessary side quests.",
    "one more photo then i stop.",
    "worth it, no question.",
    "something about this place.",
    "candid camera roll capture.",
  ],
}

const NOTE_POOLS = {
  thanjavur: ["Brihadisvara temple complex", "Chola heritage, Tamil Nadu", "Thanjavur granite architecture"],
  sky_moon: ["golden hour horizon", "twilight sky gradient", "evening sky capture", "coastal sunset"],
  portfolio: ["roadtrip find", "coastal afternoon", "weekend wander", "somewhere in India"],
}

const TAPE_COLORS = [
  "bg-amber-200/90", "bg-rose-200/90", "bg-emerald-200/90", "bg-sky-200/90",
  "bg-yellow-200/90", "bg-orange-200/90", "bg-purple-200/90", "bg-lime-200/90",
  "bg-red-200/90", "bg-teal-200/90", "bg-indigo-200/90", "bg-pink-200/90",
]

function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}
function pick(arr, key) { return arr[hashStr(key) % arr.length] }
function makeTilt(key, range = 3.5) {
  const h = hashStr(key)
  const val = ((h % (range * 200)) / 100 - range).toFixed(1)
  return val + "deg"
}
function isRealPhoto(publicId) {
  const skip = ["samples/", "instagram_automation/", "cld-sample", "main-sample", "IMG_20260127"]
  return !skip.some(s => publicId.includes(s))
}
function getFolderSlug(publicId) {
  const parts = publicId.split("/")
  if (parts.length >= 3) return parts[1].toLowerCase()
  return "portfolio"
}
function buildPhotoMeta(resource) {
  const { public_id, format } = resource
  const folder = getFolderSlug(public_id)
  const id = "cld-" + public_id.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()
  const captions = CAPTION_POOLS[folder] || CAPTION_POOLS.portfolio
  const notes = NOTE_POOLS[folder] || NOTE_POOLS.portfolio
  return {
    id,
    publicId: public_id + "." + format,
    folder,
    caption: pick(captions, public_id),
    note: pick(notes, public_id),
    tilt: makeTilt(public_id),
    tapeColor: pick(TAPE_COLORS, public_id + "tape"),
    tapeTilt: makeTilt(public_id + "tape", 3),
  }
}

function fetchCloudinaryResources({ cloudName, apiKey, apiSecret, folder }) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(apiKey + ":" + apiSecret).toString("base64")
    const path = "/v1_1/" + cloudName + "/resources/image?type=upload&prefix=" + folder + "/&max_results=200"
    const req = https.request(
      { hostname: "api.cloudinary.com", path, method: "GET", headers: { Authorization: "Basic " + auth } },
      (res) => {
        let data = ""
        res.on("data", (chunk) => (data += chunk))
        res.on("end", () => { try { resolve(JSON.parse(data)) } catch (e) { reject(new Error("Parse error")) } })
      }
    )
    req.on("error", reject)
    req.setTimeout(8000, () => req.destroy(new Error("Timeout")))
    req.end()
  })
}

export default function cloudinaryPhotosPlugin(opts = {}) {
  const {
    cloudName = "ddmfpkfce",
    apiKey = "664168187261325",
    apiSecret = "8rrx-pYJ8cf2Hi6217SIhmGquDc",
    folder = "portfolio",
  } = opts

  let photos = []

  async function syncPhotos() {
    try {
      const json = await fetchCloudinaryResources({ cloudName, apiKey, apiSecret, folder })
      const resources = json.resources || []
      photos = resources.filter(r => isRealPhoto(r.public_id)).map(buildPhotoMeta)
      console.log("\n  \u2601  Cloudinary: synced " + photos.length + " photos from portfolio/\n")
    } catch (err) {
      console.warn("\n  \u26a0  Cloudinary sync failed (" + err.message + "). Using fallback.\n")
    }
  }

  return {
    name: "vite-cloudinary-photos",
    async buildStart() { await syncPhotos() },
    resolveId(id) { if (id === VIRTUAL_ID) return RESOLVED_ID },
    load(id) {
      if (id === RESOLVED_ID) {
        return "export const dynamicPhotos = " + JSON.stringify(photos, null, 2)
      }
    },
    configureServer(server) {
      server.middlewares.use("/api/cloudinary-refresh", async (req, res) => {
        await syncPhotos()
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.reloadModule(mod)
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify({ ok: true, count: photos.length }))
      })
    },
  }
}
