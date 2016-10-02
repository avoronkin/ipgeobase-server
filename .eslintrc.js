module.exports = {
    "extends": "airbnb",
    "plugins": [
        "import",
        "mocha"
    ],
    "env": {
        "node": true,
        "mocha": true
    },
    "rules": {
        "space-before-function-paren": [2, "always"],
        "import/no-extraneous-dependencies": ["error", {"devDependencies": ["**/*.spec.js"]}]
    }
};
