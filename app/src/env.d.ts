declare namespace Cloudflare {
    interface Env {
        CF_ACCESS_CLIENT_ID: SecretsStoreSecret;
        CF_ACCESS_CLIENT_SECRET: SecretsStoreSecret;
        R2_PUBLIC_URL: string;
    }
}

// Vite の `?raw` インポートを文字列として扱うための型宣言。
declare module "*.md?raw" {
    const content: string;
    export default content;
}
