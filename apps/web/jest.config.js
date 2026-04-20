const config = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    roots: ["<rootDir>/src"],
    setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    },
    passWithNoTests: true
};
export default config;
