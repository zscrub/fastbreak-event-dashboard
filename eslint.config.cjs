module.exports = {
  extends: ["next/core-web-vitals", "eslint:recommended"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@next/next/no-html-link-for-pages": "off",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-unused-expressions": "warn",
  },
};
