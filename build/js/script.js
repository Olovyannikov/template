"use strict";

var _mobileHeightAdjust = _interopRequireDefault(require("./modules/mobile-height-adjust.js"));

var _slider = _interopRequireDefault(require("./modules/slider.js"));

var _menu = _interopRequireDefault(require("./modules/menu.js"));

var _footer = _interopRequireDefault(require("./modules/footer.js"));

var _chat = _interopRequireDefault(require("./modules/chat.js"));

var _result = _interopRequireDefault(require("./modules/result.js"));

var _form = _interopRequireDefault(require("./modules/form.js"));

var _social = _interopRequireDefault(require("./modules/social.js"));

var _fullPageScroll = _interopRequireDefault(require("./modules/full-page-scroll"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// modules
// init modules
(0, _mobileHeightAdjust["default"])();
(0, _slider["default"])();
(0, _menu["default"])();
(0, _footer["default"])();
(0, _chat["default"])();
(0, _result["default"])();
(0, _form["default"])();
(0, _social["default"])();
var fullPageScroll = new _fullPageScroll["default"]();
fullPageScroll.init();