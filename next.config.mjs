import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: `${process.env.NEXT_PUBLIC_S3_HOST_NAME}`,
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "picsum.photos",
                port: "",
                pathname: "/**",
            },{
                protocol: "https",
                hostname: "images.microcms-assets.io",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "loremflickr.com",
                port: "",
                pathname: "/**",
            },

        ],
    },
};

export default nextConfig;
