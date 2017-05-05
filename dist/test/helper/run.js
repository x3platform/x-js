//mocha-phantomjs 不支持 https
if (typeof window.callPhantom === 'undefined') {
  // window.test7();
}

window.onload = function(){
  //
    // mocha.checkLeaks();
    // mocha.globals(['jQuery']);
    mocha.run();
}
