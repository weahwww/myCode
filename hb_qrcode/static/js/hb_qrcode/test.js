(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainPanel = function (_Component) {
    _inherits(MainPanel, _Component);

    function MainPanel() {
        _classCallCheck(this, MainPanel);

        var _this = _possibleConstructorReturn(this, (MainPanel.__proto__ || Object.getPrototypeOf(MainPanel)).call(this));

        _this.state = {
            list: [{ id: "1", product: "", price: "", phone: "", interval: "600000", img: "", timestamp: "", status: false }, { id: "2", product: "", price: "", phone: "", interval: "600000", img: "", timestamp: "", status: false }]
        };
        return _this;
    }

    _createClass(MainPanel, [{
        key: 'handle',
        value: function handle(data) {
            $.post('/api/qrcode/submit', JSON.stringify(data)).done(function (d) {
                var _JSON$parse = JSON.parse(d),
                    msg = _JSON$parse.msg;

                if (msg === 'ok') {
                    // list[i].img = img;
                    data.status = true;
                    data.product = "100yuan";
                    data.price = "100";
                    data.phone = "12332342";
                    data.timestamp = new Date().getTime();
                    data.img = "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1569462993,172008204&fm=5";
                    return data;
                } else {
                    alert('加载二维码错误');
                }
            }).fail(function () {
                alert('加载二维码异常');
            });
        }
    }, {
        key: 'start',
        value: function start(i) {
            var data = this.state.list[i];
            var d = this.handle(data);
            this.setState({ list: d });
        }
    }, {
        key: 'render',
        value: function render() {
            var qrNode = _react2.default.createElement(
                'div',
                { className: 'col-sm-1' },
                _react2.default.createElement(
                    'div',
                    { className: 'panel-body form-horizontal' },
                    _react2.default.createElement(
                        'div',
                        { className: 'form-group text-center' },
                        _react2.default.createElement('img', { src: img ? img : qrcode, className: 'img-thumbnail' })
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'form-group' },
                        _react2.default.createElement(
                            'label',
                            { className: 'control-label' },
                            timestamp
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'input-group input-group-sm' },
                            _react2.default.createElement('input', { className: 'form-control', type: 'text', disabled: 'true' }),
                            _react2.default.createElement(
                                'div',
                                { className: 'input-group-btn' },
                                _react2.default.createElement(
                                    'a',
                                    { className: 'btn btn-primary ' + btnNode, onClick: this.onCreateCode.bind(this, index) },
                                    '\u751F\u6210'
                                )
                            )
                        )
                    )
                )
            );

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'a',
                    { className: 'btn btn-primary', href: 'javascript:void(0);', onClick: this.start.bind(this, 0) },
                    '\u751F\u6210'
                )
            );
        }
    }]);

    return MainPanel;
}(_react.Component);

_reactDom2.default.render(_react2.default.createElement(MainPanel, null), document.getElementById('main-content'));

},{"react":"react","react-dom":"react-dom"}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzeFxcaGJfcXJjb2RlXFx0ZXN0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUNBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTSxTOzs7QUFDRix5QkFBYTtBQUFBOztBQUFBOztBQUVULGNBQUssS0FBTCxHQUFXO0FBQ1Asa0JBQU0sQ0FDRixFQUFDLElBQUcsR0FBSixFQUFRLFNBQVEsRUFBaEIsRUFBbUIsT0FBTSxFQUF6QixFQUE0QixPQUFNLEVBQWxDLEVBQXFDLFVBQVMsUUFBOUMsRUFBdUQsS0FBSSxFQUEzRCxFQUE4RCxXQUFVLEVBQXhFLEVBQTJFLFFBQU8sS0FBbEYsRUFERSxFQUVGLEVBQUMsSUFBRyxHQUFKLEVBQVEsU0FBUSxFQUFoQixFQUFtQixPQUFNLEVBQXpCLEVBQTRCLE9BQU0sRUFBbEMsRUFBcUMsVUFBUyxRQUE5QyxFQUF1RCxLQUFJLEVBQTNELEVBQThELFdBQVUsRUFBeEUsRUFBMkUsUUFBTyxLQUFsRixFQUZFO0FBREMsU0FBWDtBQUZTO0FBUVo7Ozs7K0JBRU0sSSxFQUFNO0FBQ1QsY0FBRSxJQUFGLENBQU8sb0JBQVAsRUFBNEIsS0FBSyxTQUFMLENBQWUsSUFBZixDQUE1QixFQUNLLElBREwsQ0FDVSxVQUFDLENBQUQsRUFBTztBQUFBLGtDQUNLLEtBQUssS0FBTCxDQUFXLENBQVgsQ0FETDtBQUFBLG9CQUNGLEdBREUsZUFDRixHQURFOztBQUVULG9CQUFHLFFBQVEsSUFBWCxFQUFnQjtBQUNaO0FBQ0EseUJBQUssTUFBTCxHQUFjLElBQWQ7QUFDQSx5QkFBSyxPQUFMLEdBQWUsU0FBZjtBQUNBLHlCQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EseUJBQUssS0FBTCxHQUFhLFVBQWI7QUFDQSx5QkFBSyxTQUFMLEdBQWlCLElBQUksSUFBSixHQUFXLE9BQVgsRUFBakI7QUFDQSx5QkFBSyxHQUFMLEdBQVcseUVBQVg7QUFDQSwyQkFBTyxJQUFQO0FBQ0gsaUJBVEQsTUFTSztBQUNELDBCQUFNLFNBQU47QUFDSDtBQUNKLGFBZkwsRUFnQkssSUFoQkwsQ0FnQlUsWUFBTTtBQUNSLHNCQUFNLFNBQU47QUFDSCxhQWxCTDtBQW1CSDs7OzhCQUVLLEMsRUFBRztBQUNMLGdCQUFJLE9BQU8sS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixDQUFoQixDQUFYO0FBQ0EsZ0JBQUksSUFBSSxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQVI7QUFDQSxpQkFBSyxRQUFMLENBQWMsRUFBQyxNQUFLLENBQU4sRUFBZDtBQUNIOzs7aUNBRU87QUFDSixnQkFBSSxTQUFTO0FBQUE7QUFBQSxrQkFBSyxXQUFVLFVBQWY7QUFDVDtBQUFBO0FBQUEsc0JBQUssV0FBVSw0QkFBZjtBQUNJO0FBQUE7QUFBQSwwQkFBSyxXQUFVLHdCQUFmO0FBQ0ksK0RBQUssS0FBSyxNQUFNLEdBQU4sR0FBWSxNQUF0QixFQUE4QixXQUFVLGVBQXhDO0FBREoscUJBREo7QUFJSTtBQUFBO0FBQUEsMEJBQUssV0FBVSxZQUFmO0FBQ0k7QUFBQTtBQUFBLDhCQUFPLFdBQVUsZUFBakI7QUFBa0M7QUFBbEMseUJBREo7QUFFSTtBQUFBO0FBQUEsOEJBQUssV0FBVSw0QkFBZjtBQUNJLHFFQUFPLFdBQVUsY0FBakIsRUFBZ0MsTUFBSyxNQUFyQyxFQUE0QyxVQUFTLE1BQXJELEdBREo7QUFFSTtBQUFBO0FBQUEsa0NBQUssV0FBVSxpQkFBZjtBQUNJO0FBQUE7QUFBQSxzQ0FBRyxnQ0FBOEIsT0FBakMsRUFBNEMsU0FBUyxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsRUFBNEIsS0FBNUIsQ0FBckQ7QUFBQTtBQUFBO0FBREo7QUFGSjtBQUZKO0FBSko7QUFEUyxhQUFiOztBQWlCQSxtQkFBTztBQUFBO0FBQUE7QUFBSztBQUFBO0FBQUEsc0JBQUcsV0FBVSxpQkFBYixFQUErQixNQUFLLHFCQUFwQyxFQUEwRCxTQUFTLEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsRUFBcUIsQ0FBckIsQ0FBbkU7QUFBQTtBQUFBO0FBQUwsYUFBUDtBQUNIOzs7Ozs7QUFHTCxtQkFBUyxNQUFULENBQ0ksOEJBQUMsU0FBRCxPQURKLEVBRUksU0FBUyxjQUFULENBQXdCLGNBQXhCLENBRkoiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFJlYWN0LHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XHJcblxyXG5jbGFzcyBNYWluUGFuZWwgZXh0ZW5kcyBDb21wb25lbnR7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZT17XHJcbiAgICAgICAgICAgIGxpc3Q6IFtcclxuICAgICAgICAgICAgICAgIHtpZDpcIjFcIixwcm9kdWN0OlwiXCIscHJpY2U6XCJcIixwaG9uZTpcIlwiLGludGVydmFsOlwiNjAwMDAwXCIsaW1nOlwiXCIsdGltZXN0YW1wOlwiXCIsc3RhdHVzOmZhbHNlfSxcclxuICAgICAgICAgICAgICAgIHtpZDpcIjJcIixwcm9kdWN0OlwiXCIscHJpY2U6XCJcIixwaG9uZTpcIlwiLGludGVydmFsOlwiNjAwMDAwXCIsaW1nOlwiXCIsdGltZXN0YW1wOlwiXCIsc3RhdHVzOmZhbHNlfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZShkYXRhKSB7XHJcbiAgICAgICAgJC5wb3N0KCcvYXBpL3FyY29kZS9zdWJtaXQnLEpTT04uc3RyaW5naWZ5KGRhdGEpKVxyXG4gICAgICAgICAgICAuZG9uZSgoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qge21zZ30gPSBKU09OLnBhcnNlKGQpO1xyXG4gICAgICAgICAgICAgICAgaWYobXNnID09PSAnb2snKXtcclxuICAgICAgICAgICAgICAgICAgICAvLyBsaXN0W2ldLmltZyA9IGltZztcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnN0YXR1cyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5wcm9kdWN0ID0gXCIxMDB5dWFuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5wcmljZSA9IFwiMTAwXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5waG9uZSA9IFwiMTIzMzIzNDJcIjtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuaW1nID0gXCJodHRwczovL3NzMC5iYWlkdS5jb20vNk9OV3NqaXAwUUlaOHR5aG5xL2l0L3U9MTU2OTQ2Mjk5MywxNzIwMDgyMDQmZm09NVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhXHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgn5Yqg6L295LqM57u056CB6ZSZ6K+vJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mYWlsKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCfliqDovb3kuoznu7TnoIHlvILluLgnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnQoaSkge1xyXG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5zdGF0ZS5saXN0W2ldO1xyXG4gICAgICAgIGxldCBkID0gdGhpcy5oYW5kbGUoZGF0YSk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bGlzdDpkfSlcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICBsZXQgcXJOb2RlID0gPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tMVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWJvZHkgZm9ybS1ob3Jpem9udGFsXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXAgdGV4dC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17aW1nID8gaW1nIDogcXJjb2RlfSBjbGFzc05hbWU9XCJpbWctdGh1bWJuYWlsXCIvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29udHJvbC1sYWJlbFwiPnt0aW1lc3RhbXB9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwIGlucHV0LWdyb3VwLXNtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiB0eXBlPVwidGV4dFwiIGRpc2FibGVkPVwidHJ1ZVwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1ncm91cC1idG5cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT17YGJ0biBidG4tcHJpbWFyeSAke2J0bk5vZGV9YH0gb25DbGljaz17dGhpcy5vbkNyZWF0ZUNvZGUuYmluZCh0aGlzLGluZGV4KX0+55Sf5oiQPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj47XHJcblxyXG4gICAgICAgIHJldHVybiA8ZGl2PjxhIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMCk7XCIgb25DbGljaz17dGhpcy5zdGFydC5iaW5kKHRoaXMsMCl9PueUn+aIkDwvYT48L2Rpdj5cclxuICAgIH1cclxufVxyXG5cclxuUmVhY3RET00ucmVuZGVyKFxyXG4gICAgPE1haW5QYW5lbC8+LFxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tY29udGVudCcpXHJcbik7Il19
