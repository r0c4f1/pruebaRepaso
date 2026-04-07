import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
process.loadEnvFile(path.join(__dirname, ".env"));
export const config = {
    port: process.env.PORT || 4000
};
//# sourceMappingURL=config.js.map