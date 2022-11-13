/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // required for standalone build and for docker
  output: 'standalone'
}

module.exports = nextConfig
