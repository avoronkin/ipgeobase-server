/* eslint no-param-reassign: 0, consistent-return: 0 */
module.exports = function configureVersionMiddleware () {
  return function versionMiddleware (req, res, next) {
    if (!req.meta || !req.meta.version) return next();

    const version = (req.params.version || req.query.version) || '1';
    const versions = req.meta.version.split(',');

    req.version = version;

    if (versions.indexOf(version) !== -1) {
      next();
    } else {
      next('router');
    }
  };
};
