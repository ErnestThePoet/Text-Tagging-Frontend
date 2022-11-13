/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // required for docker
  // output: 'standalone'
}

module.exports = nextConfig
