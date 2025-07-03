export default {
  content: ["./src/**/*.{js,ts,vue}"],
  extends: ["@vue/eslint-config-typescript", "@vue/eslint-config-prettier"],
  plugins: ["@typescript-eslint"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "vue/multi-word-component-names": "off",
    "prettier/prettier": "error"
  }
}