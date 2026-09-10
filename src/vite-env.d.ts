/// <reference types="vite/client" />

// Virtual module provided by vite-plugin-cloudinary.js
declare module 'virtual:cloudinary-photos' {
  export interface CloudinaryPhoto {
    id: string
    publicId: string
    folder: string
    caption: string
    note: string
    tilt: string
    tapeColor: string
    tapeTilt: string
  }
  export const dynamicPhotos: CloudinaryPhoto[]
}
