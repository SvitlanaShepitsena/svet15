require.config({
  paths: {
    requirejs: '../lib/requirejs/require',
    famous: "../lib/famous/src",
    d3: '../lib/d3/',
    nv: '../lib/nvd3/',
    data: '../src/data',
      jade:'../jade/'
  }
});
require(['main']);
