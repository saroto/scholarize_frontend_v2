/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
};

module.exports = nextConfig;
// module.exports = {
//   reactStrictMode: false,
//   webpack: (config) => {
//     config.resolve.alias.canvas = false;
//     return config;
//   },
// };

// const nextConfig = {
//   webpack: (config) => {
//     config.module.rules.push({
//       test: /pdf\.worker\.(min\.)?js/,
//       type: "asset/resource",
//       generator: {
//         filename: "static/worker/[hash][ext][query]",
//       },
//     });
//     return config;
//   },
// };
