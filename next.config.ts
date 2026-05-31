import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Scrape edilen gercek urun fotograflari DeliveryHero CDN uzerinden geliyor; next/image icin host izni gerekiyor.
        protocol: "https",
        hostname: "images.deliveryhero.io",
      },
      {
        // Bazi Yemeksepeti urun gorselleri yeni CDN hostu ile geliyor; arama kartlarinda next/image hatasi vermemesi icin izinliyoruz.
        protocol: "https",
        hostname: "yemeksepeti.dhmedia.io",
      },
    ],
  },
};

export default nextConfig;
