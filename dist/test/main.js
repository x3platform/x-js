require(["x"], function (x) {
  window.x = x;
  debugger;

  // 填写测试代码
  console.log(x.camelCase('AbcdAbc'));
  console.log(x.randomText.create());
  console.log(x.date.create('1997-06-01 01:01:00').getDatePart('week'));
  console.log(x.date.create());
  console.log(x.date.create('1997年6月1日 00:00:00'));
  console.log(x.date.create([1997, 6, 1]));
  console.log(x.date.add('1997-06-01 01:01:00', 'year', '1'));
});
