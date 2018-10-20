module.exports = {
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: [
        '**/*.js',
        '!**/node_modules/**',
        '!**/scripts/**',
        '!**/config/**',
        '!**/credentials/**',
        '!**/tools/writer.js',
        '!**/tools/logger.js',
    ],
    coverageReporters: ['text-summary'],
    coverageThreshold: {
        global: {
            // lines: 50,
        },
    },
    reporters: [
        'default',
        ['./node_modules/jest-html-reporter', {
            pageTitle: 'Test Report',
            includeFailureMsg: true,
        }],
        'jest-junit',
    ],
    testMatch: [
        '**/tests/**/?(*.)+(unit|integ).(test).js?(x)',
    ],
};
