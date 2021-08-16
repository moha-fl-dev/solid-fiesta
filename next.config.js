module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/app',
        destination: '/app/admin',
        permanent: true,
      },
    ]
  },
}
