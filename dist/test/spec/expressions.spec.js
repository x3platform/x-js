describe('expressions', function () {
  describe('#x.expressions.match()', function () {
    it('should return true when the value is not present', function () {
      assert.equal('123456', x.expressions.match({ text: '123456', regexp: /^\d{6}$/g }));
    });
  });
  describe('#x.expressions.exists()', function () {
    it('should return true when the value is not present', function () {
      assert.equal(true, x.expressions.exists({ text: '123456', regexp: /^\d{6}$/g }));
      assert.equal(false, x.expressions.exists({ text: 'abcd', regexp: /^\d{6}$/g }));
    });
  });
  describe('#x.expressions.isFileExt()', function () {
    it('should return true when the value is not present', function () {
      assert.equal(true, x.expressions.isFileExt('abc.txt', 'txt'));
      assert.equal(false, x.expressions.isFileExt('abc.txt', 'doc'));
    });
  });
  describe('#x.expressions.formatInteger()', function () {
    it('should return "100" when the value "100abc"', function () {
      assert.equal('100', x.expressions.formatInteger('100abc'));
    });
  });
  describe('#x.expressions.formatNumberRound2()', function () {
    it('should return "12345.00" when the value is "12345"', function () {
      assert.equal('12345.00', x.expressions.formatNumberRound2('12345'));
      assert.equal('12345.00', x.expressions.formatNumberRound2('012345'));
      assert.equal('12345.67', x.expressions.formatNumberRound2('012345.671'));
      assert.equal('12345.68', x.expressions.formatNumberRound2('012345.6789'));
    });
  });
});
