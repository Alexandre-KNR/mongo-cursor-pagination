interface Config {
    MAX_LIMIT: number;
    DEFAULT_LIMIT: number;
    COLLATION: Record<string, any> | null;
}
declare const config: Config;
export default config;
