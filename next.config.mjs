/** @type {import('next').NextConfig} */
const nextConfig = {
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

        ],
    },
    experimental: {
        ppr: "incremental", // v14.xではboolean
    },
};

export default nextConfig;
