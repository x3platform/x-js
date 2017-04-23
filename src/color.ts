// -*- ecoding=utf-8 -*-

import * as x from "./core";

/**
* 颜色编码
* @namespace color
* @memberof x
*/
let self = {

    // 正则规则
    // reg: /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/,

    /**
    * RGB 颜色转为十六进制格式
    */
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

    /**
    * 十六进制颜色转为 RGB 格式
    */
    rgb: function (colorHexCode) {
        var color = colorHexCode.toLowerCase();

        if (color && /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(color)) {
            // 处理简写的颜色
            if (color.length === 4) {
                var originalColor = "#";

                for (var i = 1; i < 4; i += 1) {
                    originalColor += color.slice(i, i + 1).concat(color.slice(i, i + 1));
                }

                color = originalColor;
            }

            // 处理六位的颜色值
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

export = self;
