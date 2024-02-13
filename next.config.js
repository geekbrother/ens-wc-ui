/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	eslint: {
    // Ignore during builds
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
