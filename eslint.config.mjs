import { globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  globalIgnores([".next/**", "out/**", "dist/**", "node_modules/**"]),
  ...nextVitals,
];

export default eslintConfig;
