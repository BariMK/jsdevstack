module.exports = {
    appLocales: ['en', 'cs'],
    defaultLocale: 'en',
    port: 3000,
    version: require('../../package').version,
    isProduction: process.env.NODE_ENV === 'production',
    // apiUrl: 'https://api-dev.mytripman.com',
    apiUrl: 'http://api.mytripman.com'
}