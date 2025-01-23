/** @type {import('next').NextConfig} */

import withPWA from "next-pwa";
const nextConfig = {
  distDir: "build",
  reactStrictMode: true,
  compiler: {
    swcMinify: true,
  },
  // compiler: {
  //   removeConsole: process.env.NODE_ENV !== "development",
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default withPWA({
  dest: "public",
  // disable: process.env.NODE_ENV !== "development",
  register: true,
  skipWaiting: true,
})(nextConfig);
// https://www.mridul.tech/tools/manifest-generator
// npm i next-pwa
