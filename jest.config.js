const { getJestProjects } = require('@nrwl/jest');

module.exports = {
  projects: [
    ...getJestProjects(),
    '<rootDir>/apps/challenge90days',
    '<rootDir>/apps/api',
    '<rootDir>/libs/firework',
  ],
};
