import { NextResponse } from "next/server";

// POST /api/upload — terima file, teruskan ke Cloudinary/UploadThing/S3, kembalikan URL CDN
export async function POST() {
  return NextResponse.json({
    url: "https://picsum.photos/seed/uploaded/800/800",
    note: "Simulasi upload — hubungkan ke provider storage di produksi.",
  });
}
