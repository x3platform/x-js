"use strict";
var self = {
    hex: function (colorRgbCode) {
        if (/^(rgb|RGB)/.test(colorRgbCode)) {
            var colorBuffer = colorRgbCode.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
            var strHex = "#";
            for (var i = 0; i < colorBuffer.length; i++) {
                var hex = Number(colorBuffer[i]).toString(16);
                if (hex === "0") {
                    hex += hex;
                }
                strHex += hex;
            }
            if (strHex.length !== 7) {
                strHex = colorRgbCode;
            }
            return strHex;
        }
        else if (/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(colorRgbCode)) {
            var colorBuffer = colorRgbCode.replace(/#/, "").split("");
            if (colorBuffer.length === 6) {
                return colorRgbCode;
            }
            else if (colorBuffer.length === 3) {
                var numHex = "#";
                for (var i = 0; i < colorBuffer.length; i += 1) {
                    numHex += (colorBuffer[i] + colorBuffer[i]);
                }
                return numHex;
            }
        }
        else {
            return colorRgbCode;
        }
    },
    rgb: function (colorHexCode) {
        var color = colorHexCode.toLowerCase();
        if (color && /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(color)) {
            if (color.length === 4) {
                var originalColor = "#";
                for (var i = 1; i < 4; i += 1) {
                    originalColor += color.slice(i, i + 1).concat(color.slice(i, i + 1));
                }
                color = originalColor;
            }
            var colorBuffer = [];
            for (var i = 1; i < 7; i += 2) {
                colorBuffer.push(parseInt("0x" + color.slice(i, i + 2)));
            }
            return 'rgb(' + colorBuffer.join(', ') + ')';
        }
        else {
            return color;
        }
    }
};
module.exports = self;
