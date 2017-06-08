L.Map.mergeOptions({
  crs: L.CRS.EPSG4326,
  preferCanvas: true,
  attributionControl: false
});

L.Map.include( /** @lends L.Map.prototype */ {
  /**
   * @classdesc 地图类
   * @constructs
   * @param {String} id 地图容器id
   * @param {Object} options
   * @example
   * var map = new L.Map("map");
   */
  _initialize: function (id, options) {
    //	/****
    //	 * 智能捕获，目前智能捕获点图元，默认false
    //	 */
    //	this._captureStated=false;
    //调试使用
  },
  /**
   * 初始化面板
   * @ignore
   */
  _initPanes: function () {
    /**
     * true:表示一次请求数据用于绘制，false:表示分为点、线、面三次请求数据用于绘制,默认true
     */
    this.isQueryAllForDraw = false;
    var panes = this._panes = {};
    this._paneRenderers = {};

    this._mapPane = this.createPane('mapPane', this._container);
    L.DomUtil.setPosition(this._mapPane, new L.Point(0, 0));

    this.createPane('tilePane');
    this.createPane('shadowPane');
    var vectorTilePane = this.createPane("vectorTilePane");
    var superEnginePane = this.createPane("superEnginePane");
    this.createPane('overlayPane');
    this.createPane('markerPane');
    this.createPane('popupPane');

    if (!this.options.markerZoomAnimation) {
      L.DomUtil.addClass(panes.markerPane, 'leaflet-zoom-hide');
      L.DomUtil.addClass(panes.shadowPane, 'leaflet-zoom-hide');
    }
    vectorTilePane.style.zIndex = 400;
    superEnginePane.style.zIndex = 400;
  }
});