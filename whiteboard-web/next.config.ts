import withPWA from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default withPWA({
  dest: "public",
  register: true,
  disable: false, // PWA enabled in all environments
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
    // Disable document registration for app router compatibility
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
      {
        urlPattern: /\/api\/.*$/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
        },
      },
      {
        urlPattern: /\/courses.*$/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'courses-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60, // 1 hour
          },
        },
      },
      {
        urlPattern: /\/assignments.*$/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'assignments-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 60, // 30 minutes
          },
        },
      },
      {
        urlPattern: /\/messages.*$/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'messages-cache',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 15 * 60, // 15 minutes
          },
        },
      },
      // Add offline fallback for navigation requests
      {
        urlPattern: ({ request }) => request.mode === 'navigate',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
          networkTimeoutSeconds: 3, // If network takes longer than 3 seconds, use cache
        },
      },
    ],
  },
})(nextConfig);
