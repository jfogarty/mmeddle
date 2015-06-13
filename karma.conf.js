module.exports = function(config) {
  config.set({
    basePath: '.',
    autoWatch: true,
    frameworks: ['mocha'],
    plugins : [
      'karma-chrome-launcher',
      'karma-html2js-preprocessor',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-mocha'
    ],
    preprocessors: {
      '**/*.html': ['html2js']
    },
    files: [
      'test/testMocha.html'
    ],
//  browsers: ['PhantomJS', 'Firefox'],
    browsers: ['PhantomJS', 'Firefox', 'Chrome'],

    reporters: ['progress'],
//  reporters: ['progress', 'coverage'],
//  preprocessors: { '*.js': ['coverage'] },

    singleRun: true
  });
};
