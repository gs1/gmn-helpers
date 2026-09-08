const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2018,
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
        rules: {
            "no-console": "off",
            "no-empty": ["error", { allowEmptyCatch: true }],
            "no-unused-vars": ["error", { caughtErrors: "none" }]
        }
    }
];
