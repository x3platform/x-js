describe('expressions', function () {
  describe('#x.regexp.match()', function () {
    it('should return true when the value is not present', function () {
      assert.equal('123456', x.regexp.match({ text: '123456', regexp: /^\d{6}$/g }));
    });
  });
  describe('#x.regexp.exists()', function () {
    it('should return true when the value is not present', function () {
      assert.equal(true, x.regexp.exists({ text: '123456', regexp: /^\d{6}$/g }));
      assert.equal(false, x.regexp.exists({ text: 'abcd', regexp: /^\d{6}$/g }));
    });
  });
  describe('#x.regexp.isFileExt()', function () {
    it('should return true when the value is not present', function () {
      assert.equal(true, x.regexp.isFileExt('abc.txt', 'txt'));
      assert.equal(false, x.regexp.isFileExt('abc.txt', 'doc'));
    });
  });
  describe('#x.regexp.formatInteger()', function () {
    it('should return "100" when the value "100abc"', function () {
      assert.equal('100', x.regexp.formatInteger('100abc'));
    });
  });
  describe('#x.regexp.formatNumberRound2()', function () {
    it('should return "12345.00" when the value is "12345"', function () {
      assert.equal('12345.00', x.regexp.formatNumberRound2('12345'));
      assert.equal('12345.00', x.regexp.formatNumberRound2('012345'));
      assert.equal('12345.67', x.regexp.formatNumberRound2('012345.671'));
      assert.equal('12345.68', x.regexp.formatNumberRound2('012345.6789'));
    });
  });
});
