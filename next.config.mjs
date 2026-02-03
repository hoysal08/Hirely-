/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['cdn.prod.website-files.com'],
    },
  
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: [
                "default-src 'self'",
  
                // Images (thumbnails etc.)
                "img-src 'self' https://cdn.prod.website-files.com https://i.ytimg.com data: blob:",
  
                // API / network requests
                "connect-src 'self' https://cdn.prod.website-files.com https://www.youtube.com https://youtube.com",
  
                // Allow YouTube iframe embeds
                "frame-src https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com",
  
                // Scripts (YouTube player loads scripts)
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://s.ytimg.com",
  
                // Styles
                "style-src 'self' 'unsafe-inline'",
  
                // Fonts
                "font-src 'self' data:",
  
                // Media (video/audio streams)
                "media-src https://www.youtube.com https://youtube.com https://*.googlevideo.com blob:",
              ].join('; '),
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  