import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_ROOT = path.resolve(process.cwd(), "public", "uploads", "banners");
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const MIME_EXTENSION_MAP = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const detectMimeTypeFromBuffer = (buffer) => {
  if (!buffer || buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return "image/gif";
  }
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
};

export async function saveBannerImage(file) {
  if (!file || typeof file !== "object" || typeof file.arrayBuffer !== "function") {
    return null;
  }

  if (file.size === 0) {
    return null;
  }

  if (file.size > MAX_FILE_SIZE) {
    const error = new Error("حجم تصویر نباید بیشتر از ۵ مگابایت باشد");
    error.status = 400;
    throw error;
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const detectedMime = detectMimeTypeFromBuffer(buffer);
  const claimedMime = file.type;

  if (!detectedMime || !MIME_EXTENSION_MAP[detectedMime]) {
    const error = new Error("فرمت تصویر نامعتبر است. فقط JPG, PNG, WEBP, GIF مجاز است");
    error.status = 400;
    throw error;
  }

  if (claimedMime && claimedMime !== detectedMime && !(claimedMime === "image/jpg" && detectedMime === "image/jpeg")) {
    const error = new Error("محتوای فایل با پسوند آن مطابقت ندارد");
    error.status = 400;
    throw error;
  }

  const ext = MIME_EXTENSION_MAP[detectedMime];
  const hash = crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 16);
  const random = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  const filename = `${Date.now()}-${random}-${hash}${ext}`;

  await mkdir(UPLOAD_ROOT, { recursive: true });
  const targetPath = path.join(UPLOAD_ROOT, filename);
  await writeFile(targetPath, buffer);

  return `/uploads/banners/${filename}`;
}

export async function removeUploadFile(relativeUrl) {
  if (!relativeUrl || typeof relativeUrl !== "string") return false;

  const normalized = path.normalize(relativeUrl).replace(/^[/\\]+/, "");
  const absolutePath = path.resolve(process.cwd(), "public", normalized);

  if (!absolutePath.startsWith(UPLOAD_ROOT)) {
    return false;
  }

  try {
    await unlink(absolutePath);
    return true;
  } catch (err) {
    if (err.code === "ENOENT") return false;
    return false;
  }
}
