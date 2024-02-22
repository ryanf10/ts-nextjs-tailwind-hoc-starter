/**
 * @type {import('next-sitemap').IConfig}
 * @see https://github.com/iamvishnusankar/next-sitemap#readme
 */
module.exports = {
  // !STARTERCONF Change the siteUrl
  /** Without additional '/' on the end, e.g. https://theodorusclarence.com */
  siteUrl: 'http://128.199.232.254:3005',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
