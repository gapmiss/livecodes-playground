import tsParser from "@typescript-eslint/parser";
import tseslint from "typescript-eslint";
import obsidianmd from "eslint-plugin-obsidianmd";

export default [
    { ignores: ["node_modules/**", "main.js", "*.mjs", "package.json", "package-lock.json", "versions.json", "tsconfig.json"] },
    ...tseslint.configs.recommendedTypeChecked.map(config => ({
        ...config,
        files: ["src/**/*.ts"],
    })),
    ...obsidianmd.configs.recommended,
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.json",
                sourceType: "module",
            },
        },
        rules: {
            "no-console": ["error", { allow: ["warn", "error", "debug"] }],
            "@typescript-eslint/no-unused-vars": ["error", {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
            }],
            // Disable strictTypeChecked rules (scanner only uses recommendedTypeChecked)
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            // sentence-case is disabled by default in v0.3.0 (not working as intended)
            "obsidianmd/ui/sentence-case": "off",
            // False positives: rule matches config.style.language as DOM element.style
            "obsidianmd/no-static-styles-assignment": "off",
        },
    },
];
