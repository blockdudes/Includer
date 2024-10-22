/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [{ hostname: "*", pathname: "**" }],
  },
};

export default nextConfig;
