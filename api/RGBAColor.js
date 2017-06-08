L.RGBAColor = L.Class.extend( /** @lends L.RGBAColor.prototype */ {
  statics: /**@lends L.RGBAColor */ {
    /**
     * 将16进制颜色转为RGBAColor对象
     * @param color24 {Number} 16进制颜色
     * @param alpha {Number} 透明度 0~255
     * @returns {L.RGBAColor}
     */
    createRGBAColor: function (color24, alpha) {
      if (color24 == undefined) {
        color24 = 0;
      }
      if (alpha == undefined) {
        alpha = 255;
      }
      var color = new L.RGBAColor();
      color.alpha = alpha;
      color.red = this.getRed(color24);
      color.green = this.getGreen(color24);
      color.blue = this.getBlue(color24);
      return color;
    },
  },
  /**
   * @classdesc RGBA颜色类
   * @constructs
   * @param {Number} r 红，取值范围0~255
   * @param {Number} g 绿，取值范围0~255
   * @param {Number} b 蓝，取值范围0~255
   * @param {Number} a 透明度，取值范围0~255
   * @extends L.Class
   * @example
   * var rgbaColor = new L.RGBAColor(255,0,0,255);
   * //return L.RGBAColor instance
   */
  initialize: function (r, g, b, a) {
    /**
     * 红色
     * @memberof! L.RGBAColor.prototype
     * @type {Number}
     */
    this.red = r ? r : 0;
    /**
     * 绿色
     * @memberof! L.RGBAColor.prototype
     * @type {Number}
     */
    this.green = g ? g : 0;
    /**
     * 蓝色
     * @memberof! L.RGBAColor.prototype
     * @type {Number}
     */
    this.blue = b ? b : 0;
    /**
     * 透明度
     * @memberof! L.RGBAColor.prototype
     * @type {Number}
     */
    this.alpha = a != undefined ? a : 255;
  },
  /**
   * 获取16进制颜色值
   * @returns {number}
   */
  getColorValue: function () {
    var color24 = this.red << 16 | this.green << 8 | this.blue;
    return color24;
  }
});