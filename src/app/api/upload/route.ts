import { NextResponse } from "next/server";

// POST /api/upload — terima file, teruskan ke Cloudinary/UploadThing/S3, kembalikan URL CDN
export async function POST() {
  return NextResponse.json({
    url: "/images/products/vase-terra.webp",
    note: "Simulasi upload — hubungkan ke provider storage di produksi.",
  });
}
