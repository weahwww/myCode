(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* weahwww create */


var Product = [{ id: "fee_slow", name: "话费慢充" }, { id: "jyk", name: "加油卡" }, { id: "service_jyk", name: "客服加油卡" }],
    Price = {
    fee_slow: [{ id: "100", name: "100" }, { id: "200", name: "200" }, { id: "300", name: "300" }, { id: "500", name: "500" }, { id: "1000", name: "1000" }, { id: "2000", name: "2000" }, { id: "3000", name: "3000" }, { id: "4000", name: "4000" }, { id: "5000", name: "5000" }, { id: "10000", name: "10000" }],
    jyk: [{ id: "1000", name: "1000" }, { id: "2000", name: "2000" }, { id: "3000", name: "3000" }, { id: "4000", name: "4000" }, { id: "5000", name: "5000" }, { id: "6000", name: "6000" }, { id: "7000", name: "7000" }, { id: "8000", name: "8000" }, { id: "9000", name: "9000" }, { id: "10000", name: "10000" }],
    service_jyk: [{ id: "500", name: "500" }, { id: "1000", name: "1000" }, { id: "3000", name: "3000" }, { id: "5000", name: "5000" }, { id: "10000", name: "10000" }, { id: "20000", name: "20000" }] },
    pd_map = {
    fee_slow: "话费慢充",
    jyk: "加油卡",
    service_jyk: "客服加油卡"
};

var MainPanel = function (_Component) {
    _inherits(MainPanel, _Component);

    function MainPanel() {
        _classCallCheck(this, MainPanel);

        var _this = _possibleConstructorReturn(this, (MainPanel.__proto__ || Object.getPrototypeOf(MainPanel)).call(this));

        _this.state = {
            s_view: false,
            start: false,
            list: [],
            o_list: []
            // list:[{"account":"1000113100001791937","price":"3000","product":"jyk","id":"1","timestamp":1512005925815,"task":null,"order_id":"qr15120059141755a1f611aab5d5922c027dbcf","status":false,"img_task":null}]
        };
        _this.handleConfig("all");
        return _this;
    }

    // 发送生成二维码请求


    _createClass(MainPanel, [{
        key: 'handleSubmitData',
        value: function handleSubmitData(i) {
            var _this2 = this;

            var list = this.state.list;

            list[i].timestamp = new Date().getTime();
            $.post('/api/qrcode/submit', JSON.stringify(list[i])).done(function (d) {
                console.log(d);

                var _JSON$parse = JSON.parse(d),
                    status = _JSON$parse.status,
                    order_id = _JSON$parse.order_id;

                if (status === 'ok') {
                    // list[i].img = img;
                    list[i].order_id = order_id;
                    list[i].status = true;
                    clearTimeout(list[i].img_task);
                    list[i].img_task = null;
                    _this2.loadCodeImage(i, order_id);
                    console.log(list);
                    _this2.setState({ list: list });
                } else {
                    alert('创建订单失败');
                }
            }).fail(function () {
                alert('创建订单异常');
            });
        }

        // 加载 / 修改配置

    }, {
        key: 'handleConfig',
        value: function handleConfig(type) {
            var _this3 = this;

            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.state.list;

            $.post('/api/qrcode/config', JSON.stringify({ type: type, data: data })).done(function (d) {
                var _JSON$parse2 = JSON.parse(d),
                    status = _JSON$parse2.status,
                    data = _JSON$parse2.data;

                if (status === "ok") {
                    _this3.setState({ list: data, o_list: data });
                } else {
                    alert('加载配置失败');
                    return false;
                }
            }).fail(function () {
                alert('加载配置异常');
                return false;
            });
        }

        // 获取图片

    }, {
        key: 'loadCodeImage',
        value: function loadCodeImage(i, order_id) {
            var _this4 = this;

            var list = this.state.list;

            var img_task = null;
            $.post('/api/qrcode/qrcode_get', JSON.stringify({ order_id: order_id })).done(function (d) {
                var _JSON$parse3 = JSON.parse(d),
                    status = _JSON$parse3.status,
                    image = _JSON$parse3.image;

                if (status === "ok") {
                    list[i].image = image;
                    list[i].status = false;
                    _this4.setState({ list: list });
                    return false;
                } else {
                    img_task = setTimeout(_this4.loadCodeImage.bind(_this4, i, order_id), 60000);
                    list[i].img_task = img_task;
                    _this4.setState({ list: list });
                }
            }).fail(function () {
                alert('获取图片异常');
                return false;
            });
        }

        // 停止任务

    }, {
        key: 'onClearInterval',
        value: function onClearInterval(i) {
            var list = this.state.list;

            clearInterval(list[i].task);
            clearTimeout(list[i].img_task);
            list[i].task = null;
            list[i].img_task = null;
            list[i].status = false;
            // console.log("CleanInterval: ",list);
            this.setState({ list: list });
        }

        // 开始任务

    }, {
        key: 'onIntervalTask',
        value: function onIntervalTask(i) {
            var list = this.state.list;

            this.handleSubmitData(i);
            list[i].task = setInterval(this.handleSubmitData.bind(this, i), 180000);
            // console.log("Interval: ", list);
            this.setState({ list: list });
        }

        // 开始批量任务

    }, {
        key: 'onStartBatchTask',
        value: function onStartBatchTask() {
            var list = this.state.list;

            for (var i in list) {
                clearInterval(list[i].task);
                clearTimeout(list[i].img_task);
                list[i].task = null;
                list[i].img_task = null;
                list[i].status = true;
                setTimeout(this.onIntervalTask.bind(this, i), 5000);
            }
            // console.log("StartBatch: ", list);
            this.setState({ start: true, list: list });
        }

        // 停止批量任务

    }, {
        key: 'onStopBatchTask',
        value: function onStopBatchTask() {
            var list = this.state.list;

            for (var i in list) {
                clearInterval(list[i].task);
                clearTimeout(list[i].img_task);
                list[i].status = false;
                list[i].task = null;
                list[i].img_task = null;
            }
            // console.log("StopBatch: ",list);
            this.setState({ start: false, list: list });
        }

        // 全部保存

    }, {
        key: 'onSaveAllConfig',
        value: function onSaveAllConfig() {
            var list = this.state.list;

            if (list !== [] || list.length !== 0) {
                this.handleConfig("update", list);
                this.onStopBatchTask();
                this.onStartBatchTask();
            }
        }

        // state更新

    }, {
        key: 'handleState',
        value: function handleState(type, i, val) {
            var list = this.state.list;

            console.log("i: ", i, "; con: ", list);
            list[i][type] = val;
            this.setState({ list: list });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            // 设置弹窗
            // let onShowConfig =()=>{
            //     $("#modal").modal("show");
            // };

            var _state = this.state,
                list = _state.list,
                o_list = _state.o_list,
                start = _state.start,
                s_view = _state.s_view;

            var viewNode = s_view ? "col-lg-11" : "col-lg-9";

            // let startNodes = start ? "disabled":"";
            var codeNodes = list.map(function (d, i) {
                return _react2.default.createElement(QRcodePanel, { key: i, con_data: d, onIntervalTask: _this5.onIntervalTask.bind(_this5), index: i });
            });

            return _react2.default.createElement(
                'section',
                { className: 'wrapper' },
                _react2.default.createElement(ConfigPanel, { s_view: s_view }),
                _react2.default.createElement(
                    'div',
                    { className: viewNode },
                    _react2.default.createElement(
                        'section',
                        { className: 'panel row' },
                        _react2.default.createElement(
                            'div',
                            { className: 'panel-heading' },
                            _react2.default.createElement(
                                'div',
                                { className: 'panel-title' },
                                '\u4E8C\u7EF4\u7801'
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'panel-wrapper' },
                            codeNodes
                        )
                    )
                )
            );
        }
    }]);

    return MainPanel;
}(_react.Component);

var QRcodePanel = function (_Component2) {
    _inherits(QRcodePanel, _Component2);

    function QRcodePanel(props) {
        _classCallCheck(this, QRcodePanel);

        var _this6 = _possibleConstructorReturn(this, (QRcodePanel.__proto__ || Object.getPrototypeOf(QRcodePanel)).call(this, props));

        _this6.state = {
            qrcode: "/img/fail.png",
            con_data: _this6.props.con_data,
            index: _this6.props.index
        };
        return _this6;
    }

    _createClass(QRcodePanel, [{
        key: 'onIntervalTask',
        value: function onIntervalTask(i) {
            this.props.onIntervalTask(i);
        }
    }, {
        key: 'render',
        value: function render() {
            function formatDate(d) {
                var Y = d.getFullYear() + '-';
                var M = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '-';
                var D = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + ' ';
                var h = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ':';
                var m = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + ':';
                var s = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
                return Y + M + D + h + m + s;
            }

            var _state2 = this.state,
                qrcode = _state2.qrcode,
                index = _state2.index,
                _state2$con_data = _state2.con_data,
                id = _state2$con_data.id,
                product = _state2$con_data.product,
                price = _state2$con_data.price,
                image = _state2$con_data.image,
                timestamp = _state2$con_data.timestamp,
                status = _state2$con_data.status;

            var ts = new Date(parseInt(timestamp));
            var btnNode = status ? "disabled" : "";
            return _react2.default.createElement(
                'div',
                { className: 'col-xs-4 col-sm-2 col-lg-1 code-box' },
                _react2.default.createElement(
                    'section',
                    { className: 'panel row' },
                    _react2.default.createElement(
                        'div',
                        { className: 'panel-heading row' },
                        _react2.default.createElement(
                            'span',
                            { className: 'pull-left' },
                            _react2.default.createElement(
                                'strong',
                                null,
                                id
                            ),
                            ' ',
                            pd_map[product]
                        ),
                        _react2.default.createElement(
                            'span',
                            { className: 'pull-right text-danger' },
                            _react2.default.createElement(
                                'strong',
                                null,
                                price
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'panel-body form-horizontal' },
                        _react2.default.createElement(
                            'div',
                            { className: 'form-group text-center' },
                            _react2.default.createElement('img', { src: image ? image : qrcode, className: 'img-thumbnail' })
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'form-group' },
                            _react2.default.createElement(
                                'h6',
                                null,
                                _react2.default.createElement(
                                    'small',
                                    null,
                                    timestamp ? formatDate(ts) : "未开始"
                                )
                            ),
                            status ? _react2.default.createElement(CountDown, { time: 120 }) : "",
                            _react2.default.createElement(
                                'div',
                                { className: 'input-group input-group-sm' },
                                _react2.default.createElement('input', { className: 'form-control', type: 'text', disabled: 'true' }),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'input-group-btn' },
                                    _react2.default.createElement(
                                        'a',
                                        { className: 'btn btn-primary ' + btnNode, onClick: this.onIntervalTask.bind(this, index) },
                                        '\u751F\u6210'
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return QRcodePanel;
}(_react.Component);

var ConfigPanel = function (_Component3) {
    _inherits(ConfigPanel, _Component3);

    function ConfigPanel(props) {
        _classCallCheck(this, ConfigPanel);

        return _possibleConstructorReturn(this, (ConfigPanel.__proto__ || Object.getPrototypeOf(ConfigPanel)).call(this, props));
    }

    _createClass(ConfigPanel, [{
        key: 'render',
        value: function render() {
            var _this8 = this;

            var _props = this.props,
                list = _props.list,
                start = _props.start,
                s_view = _props.s_view;

            var inputNode = list.map(function (d, i) {
                // console.log(d);
                return _react2.default.createElement(ConfigInput, { key: i, index: i, con_data: d, handleState: _this8.handleState.bind(_this8) });
            });

            var btnNode = !start ? _react2.default.createElement(
                'a',
                { className: 'btn btn-success btn-sm', href: 'javascript:void(0);', onClick: this.onStartBatchTask.bind(this) },
                _react2.default.createElement('i', { className: 'fa fa-play' }),
                ' \u5168\u90E8\u5F00\u59CB'
            ) : _react2.default.createElement(
                'a',
                { className: 'btn btn-danger btn-sm', href: 'javascript:void(0);', onClick: this.onStopBatchTask.bind(this) },
                _react2.default.createElement('i', { className: 'fa fa-stop' }),
                ' \u5168\u90E8\u7ED3\u675F'
            );

            var panelNode = _react2.default.createElement(
                'div',
                { className: 'col-lg-3' },
                _react2.default.createElement(
                    'section',
                    { className: 'panel' },
                    _react2.default.createElement(
                        'div',
                        { className: 'panel-heading' },
                        _react2.default.createElement(
                            'div',
                            { className: 'panel-title' },
                            '\u8BBE\u7F6E',
                            _react2.default.createElement(
                                'span',
                                { className: 'pull-right' },
                                btnNode
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'panel-body row' },
                        inputNode
                    )
                )
            );
            if (s_view) {
                panelNode = _react2.default.createElement(
                    'div',
                    { className: 'col-lg-1' },
                    _react2.default.createElement(
                        'section',
                        { className: 'panel' },
                        _react2.default.createElement(
                            'div',
                            { className: 'panel-heading' },
                            _react2.default.createElement(
                                'div',
                                { className: 'panel-title' },
                                btnNode
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'panel-body row' },
                            inputNode
                        )
                    )
                );
            }
            return _react2.default.createElement(
                'div',
                null,
                panelNode
            );
        }
    }]);

    return ConfigPanel;
}(_react.Component);

var ConfigInput = function (_Component4) {
    _inherits(ConfigInput, _Component4);

    function ConfigInput(props) {
        _classCallCheck(this, ConfigInput);

        var _this9 = _possibleConstructorReturn(this, (ConfigInput.__proto__ || Object.getPrototypeOf(ConfigInput)).call(this, props));

        _this9.state = {
            index: _this9.props.index
        };
        return _this9;
    }

    // 修改值


    _createClass(ConfigInput, [{
        key: 'onChangeValue',
        value: function onChangeValue(type, id) {
            var index = this.state.index;

            this.setState(_defineProperty({}, type, id));
            this.props.handleState(type, index, id);
        }

        // 修改帐号

    }, {
        key: 'onChangeAccount',
        value: function onChangeAccount(id) {
            var index = this.state.index;

            var account = $('account_' + id).val();
            console.log(account);
            if (account != "") {
                this.props.handleState("account", index, account);
            } else {
                alert("输入的数据有误");
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this10 = this;

            var _props$con_data = this.props.con_data,
                id = _props$con_data.id,
                product = _props$con_data.product,
                price = _props$con_data.price,
                account = _props$con_data.account;

            var productNode = Product.map(function (d, i) {
                return _react2.default.createElement(
                    'li',
                    { key: i },
                    _react2.default.createElement(
                        'a',
                        { href: 'javascript:void(0);', onClick: _this10.onChangeValue.bind(_this10, "product", d.id) },
                        d.name
                    )
                );
            });
            var priceNode = Price[product].map(function (d, i) {
                return _react2.default.createElement(
                    'li',
                    { key: i },
                    _react2.default.createElement(
                        'a',
                        { href: 'javascript:void(0);', onClick: _this10.onChangeValue.bind(_this10, "price", d.id) },
                        d.name
                    )
                );
            });
            return _react2.default.createElement(
                'div',
                { className: 'col-sm-12 row margin-bottom5' },
                _react2.default.createElement(
                    'div',
                    { className: 'col-sm-1' },
                    _react2.default.createElement(
                        'h5',
                        null,
                        id
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'col-sm-11 input-group input-group-sm' },
                    _react2.default.createElement(
                        'div',
                        { className: 'input-group-btn' },
                        _react2.default.createElement(
                            'button',
                            { type: 'button', className: 'btn btn-default dropdown-toggle col-sm-12', 'data-toggle': 'dropdown', 'aria-haspopup': 'true', 'aria-expanded': 'false' },
                            pd_map[product]
                        ),
                        _react2.default.createElement(
                            'ul',
                            { className: 'dropdown-menu' },
                            productNode
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'input-group-btn' },
                        _react2.default.createElement(
                            'button',
                            { type: 'button', className: 'btn btn-default dropdown-toggle col-sm-12', 'data-toggle': 'dropdown', 'aria-haspopup': 'true', 'aria-expanded': 'false' },
                            price
                        ),
                        _react2.default.createElement(
                            'ul',
                            { className: 'dropdown-menu' },
                            priceNode
                        )
                    ),
                    _react2.default.createElement('input', { id: 'account_' + id, type: 'text', className: 'form-control input-sm', defaultValue: account }),
                    _react2.default.createElement(
                        'div',
                        { className: 'input-group-btn' },
                        _react2.default.createElement(
                            'a',
                            { className: 'btn btn-success btn-sm', onClick: this.onChangeAccount.bind(this, id) },
                            _react2.default.createElement('i', { className: 'fa fa-play' }),
                            ' \u5F00\u59CB'
                        )
                    )
                )
            );
        }
    }]);

    return ConfigInput;
}(_react.Component);

var CountDown = function (_React$Component) {
    _inherits(CountDown, _React$Component);

    function CountDown(props) {
        _classCallCheck(this, CountDown);

        var _this11 = _possibleConstructorReturn(this, (CountDown.__proto__ || Object.getPrototypeOf(CountDown)).call(this, props));

        _this11.state = { time: _this11.props.time };
        return _this11;
    }

    _createClass(CountDown, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this12 = this;

            this.timerID = setInterval(function () {
                return _this12.tick();
            }, 1000);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            clearInterval(this.timerID);
        }
    }, {
        key: 'tick',
        value: function tick() {
            this.setState({
                time: this.state.time - 1
            });
            if (this.state.time <= 0) {
                clearInterval(this.timerID);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'h6',
                null,
                _react2.default.createElement(
                    'small',
                    null,
                    this.state.time
                )
            );
        }
    }]);

    return CountDown;
}(_react2.default.Component);

_reactDom2.default.render(_react2.default.createElement(MainPanel, null), document.getElementById('main-content'));

},{"react":"react","react-dom":"react-dom"}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzeFxcaGJfcXJjb2RlXFxiYXRjaC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7OytlQUZBOzs7SUFHTyxPLEdBQTJCLENBQzlCLEVBQUMsSUFBRyxVQUFKLEVBQWUsTUFBSyxNQUFwQixFQUQ4QixFQUU5QixFQUFDLElBQUcsS0FBSixFQUFVLE1BQUssS0FBZixFQUY4QixFQUc5QixFQUFDLElBQUcsYUFBSixFQUFrQixNQUFLLE9BQXZCLEVBSDhCLEM7SUFBbEIsSyxHQUliO0FBQ0MsY0FBUyxDQUNMLEVBQUMsSUFBRyxLQUFKLEVBQVUsTUFBSyxLQUFmLEVBREssRUFFTCxFQUFDLElBQUcsS0FBSixFQUFVLE1BQUssS0FBZixFQUZLLEVBR0wsRUFBQyxJQUFHLEtBQUosRUFBVSxNQUFLLEtBQWYsRUFISyxFQUlMLEVBQUMsSUFBRyxLQUFKLEVBQVUsTUFBSyxLQUFmLEVBSkssRUFLTCxFQUFDLElBQUcsTUFBSixFQUFXLE1BQUssTUFBaEIsRUFMSyxFQU1MLEVBQUMsSUFBRyxNQUFKLEVBQVcsTUFBSyxNQUFoQixFQU5LLEVBT0wsRUFBQyxJQUFHLE1BQUosRUFBVyxNQUFLLE1BQWhCLEVBUEssRUFRTCxFQUFDLElBQUcsTUFBSixFQUFXLE1BQUssTUFBaEIsRUFSSyxFQVNMLEVBQUMsSUFBRyxNQUFKLEVBQVcsTUFBSyxNQUFoQixFQVRLLEVBVUwsRUFBQyxJQUFHLE9BQUosRUFBWSxNQUFLLE9BQWpCLEVBVkssQ0FEVjtBQWFDLFNBQUksQ0FDQSxFQUFDLElBQUcsTUFBSixFQUFXLE1BQUssTUFBaEIsRUFEQSxFQUVBLEVBQUMsSUFBRyxNQUFKLEVBQVcsTUFBSyxNQUFoQixFQUZBLEVBR0EsRUFBQyxJQUFHLE1BQUosRUFBVyxNQUFLLE1BQWhCLEVBSEEsRUFJQSxFQUFDLElBQUcsTUFBSixFQUFXLE1B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QjtBQURkLGFBQWQ7QUFHQSxnQkFBRyxLQUFLLEtBQUwsQ0FBVyxJQUFYLElBQWtCLENBQXJCLEVBQXVCO0FBQ25CLDhCQUFjLEtBQUssT0FBbkI7QUFDSDtBQUNKOzs7aUNBRVE7QUFDTCxtQkFBTztBQUFBO0FBQUE7QUFBSTtBQUFBO0FBQUE7QUFBUSx5QkFBSyxLQUFMLENBQVc7QUFBbkI7QUFBSixhQUFQO0FBQ0g7Ozs7RUF6Qm1CLGdCQUFNLFM7O0FBNEI5QixtQkFBUyxNQUFULENBQ0ksOEJBQUMsU0FBRCxPQURKLEVBRUksU0FBUyxjQUFULENBQXdCLGNBQXhCLENBRkoiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogd2VhaHd3dyBjcmVhdGUgKi9cclxuaW1wb3J0IFJlYWN0LHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XHJcbmNvbnN0IFtQcm9kdWN0LCBQcmljZSwgcGRfbWFwXSA9IFtbXHJcbiAgICB7aWQ6XCJmZWVfc2xvd1wiLG5hbWU6XCLor53otLnmhaLlhYVcIn0sXHJcbiAgICB7aWQ6XCJqeWtcIixuYW1lOlwi5Yqg5rK55Y2hXCJ9LFxyXG4gICAge2lkOlwic2VydmljZV9qeWtcIixuYW1lOlwi5a6i5pyN5Yqg5rK55Y2hXCJ9LFxyXG5dLCB7XHJcbiAgICBmZWVfc2xvdzpbXHJcbiAgICAgICAge2lkOlwiMTAwXCIsbmFtZTpcIjEwMFwifSxcclxuICAgICAgICB7aWQ6XCIyMDBcIixuYW1lOlwiMjAwXCJ9LFxyXG4gICAgICAgIHtpZDpcIjMwMFwiLG5hbWU6XCIzMDBcIn0sXHJcbiAgICAgICAge2lkOlwiNTAwXCIsbmFtZTpcIjUwMFwifSxcclxuICAgICAgICB7aWQ6XCIxMDAwXCIsbmFtZTpcIjEwMDBcIn0sXHJcbiAgICAgICAge2lkOlwiMjAwMFwiLG5hbWU6XCIyMDAwXCJ9LFxyXG4gICAgICAgIHtpZDpcIjMwMDBcIixuYW1lOlwiMzAwMFwifSxcclxuICAgICAgICB7aWQ6XCI0MDAwXCIsbmFtZTpcIjQwMDBcIn0sXHJcbiAgICAgICAge2lkOlwiNTAwMFwiLG5hbWU6XCI1MDAwXCJ9LFxyXG4gICAgICAgIHtpZDpcIjEwMDAwXCIsbmFtZTpcIjEwMDAwXCJ9XHJcbiAgICBdLFxyXG4gICAganlrOltcclxuICAgICAgICB7aWQ6XCIxMDAwXCIsbmFtZTpcIjEwMDBcIn0sXHJcbiAgICAgICAge2lkOlwiMjAwMFwiLG5hbWU6XCIyMDAwXCJ9LFxyXG4gICAgICAgIHtpZDpcIjMwMDBcIixuYW1lOlwiMzAwMFwifSxcclxuICAgICAgICB7aWQ6XCI0MDAwXCIsbmFtZTpcIjQwMDBcIn0sXHJcbiAgICAgICAge2lkOlwiNTAwMFwiLG5hbWU6XCI1MDAwXCJ9LFxyXG4gICAgICAgIHtpZDpcIjYwMDBcIixuYW1lOlwiNjAwMFwifSxcclxuICAgICAgICB7aWQ6XCI3MDAwXCIsbmFtZTpcIjcwMDBcIn0sXHJcbiAgICAgICAge2lkOlwiODAwMFwiLG5hbWU6XCI4MDAwXCJ9LFxyXG4gICAgICAgIHtpZDpcIjkwMDBcIixuYW1lOlwiOTAwMFwifSxcclxuICAgICAgICB7aWQ6XCIxMDAwMFwiLG5hbWU6XCIxMDAwMFwifSxcclxuICAgIF0sXHJcbiAgICBzZXJ2aWNlX2p5azpbXHJcbiAgICAgICAge2lkOlwiNTAwXCIsbmFtZTpcIjUwMFwifSxcclxuICAgICAgICB7aWQ6XCIxMDAwXCIsbmFtZTpcIjEwMDBcIn0sXHJcbiAgICAgICAge2lkOlwiMzAwMFwiLG5hbWU6XCIzMDAwXCJ9LFxyXG4gICAgICAgIHtpZDpcIjUwMDBcIixuYW1lOlwiNTAwMFwifSxcclxuICAgICAgICB7aWQ6XCIxMDAwMFwiLG5hbWU6XCIxMDAwMFwifSxcclxuICAgICAgICB7aWQ6XCIyMDAwMFwiLG5hbWU6XCIyMDAwMFwifSxcclxuICAgIF19LHtcclxuICAgIGZlZV9zbG93Olwi6K+d6LS55oWi5YWFXCIsXHJcbiAgICBqeWs6XCLliqDmsrnljaFcIixcclxuICAgIHNlcnZpY2VfanlrOlwi5a6i5pyN5Yqg5rK55Y2hXCJcclxufV07XHJcblxyXG5jbGFzcyBNYWluUGFuZWwgZXh0ZW5kcyBDb21wb25lbnR7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPXtcclxuICAgICAgICAgICAgc192aWV3OmZhbHNlLFxyXG4gICAgICAgICAgICBzdGFydDpmYWxzZSxcclxuICAgICAgICAgICAgbGlzdDpbXSxcclxuICAgICAgICAgICAgb19saXN0OltdLFxyXG4gICAgICAgICAgICAvLyBsaXN0Olt7XCJhY2NvdW50XCI6XCIxMDAwMTEzMTAwMDAxNzkxOTM3XCIsXCJwcmljZVwiOlwiMzAwMFwiLFwicHJvZHVjdFwiOlwianlrXCIsXCJpZFwiOlwiMVwiLFwidGltZXN0YW1wXCI6MTUxMjAwNTkyNTgxNSxcInRhc2tcIjpudWxsLFwib3JkZXJfaWRcIjpcInFyMTUxMjAwNTkxNDE3NTVhMWY2MTFhYWI1ZDU5MjJjMDI3ZGJjZlwiLFwic3RhdHVzXCI6ZmFsc2UsXCJpbWdfdGFza1wiOm51bGx9XVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5oYW5kbGVDb25maWcoXCJhbGxcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5Y+R6YCB55Sf5oiQ5LqM57u056CB6K+35rGCXHJcbiAgICBoYW5kbGVTdWJtaXREYXRhKGkpe1xyXG4gICAgICAgIGxldCB7bGlzdH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGxpc3RbaV0udGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgJC5wb3N0KCcvYXBpL3FyY29kZS9zdWJtaXQnLEpTT04uc3RyaW5naWZ5KGxpc3RbaV0pKVxyXG4gICAgICAgICAgICAuZG9uZSgoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgICAgICBsZXQge3N0YXR1cywgb3JkZXJfaWR9ID0gSlNPTi5wYXJzZShkKTtcclxuICAgICAgICAgICAgICAgIGlmKHN0YXR1cyA9PT0gJ29rJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbGlzdFtpXS5pbWcgPSBpbWc7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdFtpXS5vcmRlcl9pZCA9IG9yZGVyX2lkO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3RbaV0uc3RhdHVzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQobGlzdFtpXS5pbWdfdGFzayk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdFtpXS5pbWdfdGFzayA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29kZUltYWdlKGksb3JkZXJfaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2xpc3R9KVxyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+WIm+W7uuiuouWNleWksei0pScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgn5Yib5bu66K6i5Y2V5byC5bi4Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOWKoOi9vSAvIOS/ruaUuemFjee9rlxyXG4gICAgaGFuZGxlQ29uZmlnKHR5cGUsZGF0YT10aGlzLnN0YXRlLmxpc3Qpe1xyXG4gICAgICAgICQucG9zdCgnL2FwaS9xcmNvZGUvY29uZmlnJyxKU09OLnN0cmluZ2lmeSh7dHlwZSxkYXRhfSkpXHJcbiAgICAgICAgICAgIC5kb25lKChkKT0+e1xyXG4gICAgICAgICAgICAgICAgbGV0IHtzdGF0dXMsZGF0YX0gPSBKU09OLnBhcnNlKGQpO1xyXG4gICAgICAgICAgICAgICAgaWYoc3RhdHVzID09PSBcIm9rXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2xpc3Q6ZGF0YSxvX2xpc3Q6ZGF0YX0pO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+WKoOi9vemFjee9ruWksei0pScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbCgoKT0+e1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ+WKoOi9vemFjee9ruW8guW4uCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLy8g6I635Y+W5Zu+54mHXHJcbiAgICBsb2FkQ29kZUltYWdlKGksb3JkZXJfaWQpe1xyXG4gICAgICAgIGxldCB7bGlzdH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGxldCBpbWdfdGFzayA9IG51bGw7XHJcbiAgICAgICAgJC5wb3N0KCcvYXBpL3FyY29kZS9xcmNvZGVfZ2V0JyxKU09OLnN0cmluZ2lmeSh7b3JkZXJfaWR9KSlcclxuICAgICAgICAgICAgLmRvbmUoKGQpPT57XHJcbiAgICAgICAgICAgICAgICBsZXQge3N0YXR1cyxpbWFnZX0gPSBKU09OLnBhcnNlKGQpO1xyXG4gICAgICAgICAgICAgICAgaWYoc3RhdHVzID09PSBcIm9rXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3RbaV0uaW1hZ2UgPSBpbWFnZTtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0W2ldLnN0YXR1cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2xpc3R9KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGltZ190YXNrID0gc2V0VGltZW91dCh0aGlzLmxvYWRDb2RlSW1hZ2UuYmluZCh0aGlzLGksb3JkZXJfaWQpLCA2MDAwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdFtpXS5pbWdfdGFzayA9IGltZ190YXNrO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2xpc3R9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZhaWwoKCk9PntcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCfojrflj5blm77niYflvILluLgnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOWBnOatouS7u+WKoVxyXG4gICAgb25DbGVhckludGVydmFsKGkpe1xyXG4gICAgICAgIGxldCB7bGlzdH0gPXRoaXMuc3RhdGU7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbChsaXN0W2ldLnRhc2spO1xyXG4gICAgICAgIGNsZWFyVGltZW91dChsaXN0W2ldLmltZ190YXNrKTtcclxuICAgICAgICBsaXN0W2ldLnRhc2sgPSBudWxsO1xyXG4gICAgICAgIGxpc3RbaV0uaW1nX3Rhc2sgPSBudWxsO1xyXG4gICAgICAgIGxpc3RbaV0uc3RhdHVzID0gZmFsc2U7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJDbGVhbkludGVydmFsOiBcIixsaXN0KTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtsaXN0fSlcclxuICAgIH1cclxuXHJcbiAgICAvLyDlvIDlp4vku7vliqFcclxuICAgIG9uSW50ZXJ2YWxUYXNrKGkpe1xyXG4gICAgICAgIGxldCB7bGlzdH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlU3VibWl0RGF0YShpKTtcclxuICAgICAgICBsaXN0W2ldLnRhc2sgPSBzZXRJbnRlcnZhbCh0aGlzLmhhbmRsZVN1Ym1pdERhdGEuYmluZCh0aGlzLGkpLDE4MDAwMCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJJbnRlcnZhbDogXCIsIGxpc3QpO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2xpc3R9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDlvIDlp4vmibnph4/ku7vliqFcclxuICAgIG9uU3RhcnRCYXRjaFRhc2soKXtcclxuICAgICAgICBsZXQge2xpc3R9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICBmb3IobGV0IGkgaW4gbGlzdCl7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwobGlzdFtpXS50YXNrKTtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGxpc3RbaV0uaW1nX3Rhc2spO1xyXG4gICAgICAgICAgICBsaXN0W2ldLnRhc2sgPSBudWxsO1xyXG4gICAgICAgICAgICBsaXN0W2ldLmltZ190YXNrID0gbnVsbDtcclxuICAgICAgICAgICAgbGlzdFtpXS5zdGF0dXMgPSB0cnVlO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMub25JbnRlcnZhbFRhc2suYmluZCh0aGlzLGkpLDUwMDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlN0YXJ0QmF0Y2g6IFwiLCBsaXN0KTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtzdGFydDp0cnVlLCBsaXN0fSlcclxuICAgIH1cclxuXHJcbiAgICAvLyDlgZzmraLmibnph4/ku7vliqFcclxuICAgIG9uU3RvcEJhdGNoVGFzaygpe1xyXG4gICAgICAgIGxldCB7bGlzdH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGZvcihsZXQgaSBpbiBsaXN0KXtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChsaXN0W2ldLnRhc2spO1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQobGlzdFtpXS5pbWdfdGFzayk7XHJcbiAgICAgICAgICAgIGxpc3RbaV0uc3RhdHVzID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxpc3RbaV0udGFzayA9IG51bGw7XHJcbiAgICAgICAgICAgIGxpc3RbaV0uaW1nX3Rhc2sgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlN0b3BCYXRjaDogXCIsbGlzdCk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c3RhcnQ6ZmFsc2UsbGlzdH0pXHJcbiAgICB9XHJcblxyXG4gICAgLy8g5YWo6YOo5L+d5a2YXHJcbiAgICBvblNhdmVBbGxDb25maWcoKSB7XHJcbiAgICAgICAgbGV0IHtsaXN0fSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgaWYobGlzdCAhPT0gW10gfHwgbGlzdC5sZW5ndGggIT09IDApe1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZUNvbmZpZyhcInVwZGF0ZVwiLGxpc3QpO1xyXG4gICAgICAgICAgICB0aGlzLm9uU3RvcEJhdGNoVGFzaygpO1xyXG4gICAgICAgICAgICB0aGlzLm9uU3RhcnRCYXRjaFRhc2soKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBzdGF0ZeabtOaWsFxyXG4gICAgaGFuZGxlU3RhdGUodHlwZSxpLHZhbCkge1xyXG4gICAgICAgIGxldCB7bGlzdH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiaTogXCIsaSxcIjsgY29uOiBcIixsaXN0KTtcclxuICAgICAgICBsaXN0W2ldW3R5cGVdID0gdmFsO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2xpc3R9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmVuZGVyKCl7XHJcbiAgICAgICAgLy8g6K6+572u5by556qXXHJcbiAgICAgICAgLy8gbGV0IG9uU2hvd0NvbmZpZyA9KCk9PntcclxuICAgICAgICAvLyAgICAgJChcIiNtb2RhbFwiKS5tb2RhbChcInNob3dcIik7XHJcbiAgICAgICAgLy8gfTtcclxuXHJcbiAgICAgICAgY29uc3Qge2xpc3Qsb19saXN0LHN0YXJ0LHNfdmlld30gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGxldCB2aWV3Tm9kZSA9IHNfdmlldyA/IFwiY29sLWxnLTExXCIgOiBcImNvbC1sZy05XCI7XHJcblxyXG5cclxuXHJcbiAgICAgICAgLy8gbGV0IHN0YXJ0Tm9kZXMgPSBzdGFydCA/IFwiZGlzYWJsZWRcIjpcIlwiO1xyXG4gICAgICAgIGxldCBjb2RlTm9kZXMgPSBsaXN0Lm1hcCgoZCxpKSA9PntcclxuICAgICAgICAgICAgcmV0dXJuIDxRUmNvZGVQYW5lbCBrZXk9e2l9IGNvbl9kYXRhPXtkfSBvbkludGVydmFsVGFzaz17dGhpcy5vbkludGVydmFsVGFzay5iaW5kKHRoaXMpfSBpbmRleD17aX0vPlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gPHNlY3Rpb24gY2xhc3NOYW1lPVwid3JhcHBlclwiPlxyXG4gICAgICAgICAgICA8Q29uZmlnUGFuZWwgc192aWV3PXtzX3ZpZXd9Lz5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXt2aWV3Tm9kZX0+XHJcbiAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJwYW5lbCByb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWhlYWRpbmdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3BhbmVsLXRpdGxlJz7kuoznu7TnoIE8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLXdyYXBwZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2NvZGVOb2Rlc31cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBRUmNvZGVQYW5lbCBleHRlbmRzIENvbXBvbmVudHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKXtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZT17XHJcbiAgICAgICAgICAgIHFyY29kZTpcIi9pbWcvZmFpbC5wbmdcIixcclxuICAgICAgICAgICAgY29uX2RhdGE6IHRoaXMucHJvcHMuY29uX2RhdGEsXHJcbiAgICAgICAgICAgIGluZGV4OnRoaXMucHJvcHMuaW5kZXgsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBvbkludGVydmFsVGFzayhpKXtcclxuICAgICAgICB0aGlzLnByb3BzLm9uSW50ZXJ2YWxUYXNrKGkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpe1xyXG4gICAgICAgIGZ1bmN0aW9uIGZvcm1hdERhdGUoZCkge1xyXG4gICAgICAgICAgICBsZXQgWT1kLmdldEZ1bGxZZWFyKCkgKyAnLSc7XHJcbiAgICAgICAgICAgIGxldCBNPShkLmdldE1vbnRoKCkrMSA8IDEwID8gJzAnKyhkLmdldE1vbnRoKCkrMSkgOiBkLmdldE1vbnRoKCkrMSkgKyAnLSc7XHJcbiAgICAgICAgICAgIGxldCBEPShkLmdldERhdGUoKTwgMTAgPyAnMCcgKyAoZC5nZXREYXRlKCkpIDogZC5nZXREYXRlKCkpICsgJyAnO1xyXG4gICAgICAgICAgICBsZXQgaD0oZC5nZXRIb3VycygpPCAxMCA/ICcwJyArIGQuZ2V0SG91cnMoKSA6IGQuZ2V0SG91cnMoKSkgKyAnOic7XHJcbiAgICAgICAgICAgIGxldCBtPShkLmdldE1pbnV0ZXMoKSA8MTAgPyAnMCcgKyBkLmdldE1pbnV0ZXMoKSA6IGQuZ2V0TWludXRlcygpKSArICc6JztcclxuICAgICAgICAgICAgbGV0IHM9KGQuZ2V0U2Vjb25kcygpIDwxMCA/ICcwJyArIGQuZ2V0U2Vjb25kcygpIDogZC5nZXRTZWNvbmRzKCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gWStNK0QraCttK3M7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB7cXJjb2RlLGluZGV4LGNvbl9kYXRhOntpZCwgcHJvZHVjdCwgcHJpY2UsIGltYWdlLCB0aW1lc3RhbXAsIHN0YXR1c319PXRoaXMuc3RhdGU7XHJcbiAgICAgICAgbGV0IHRzID0gbmV3IERhdGUocGFyc2VJbnQodGltZXN0YW1wKSk7XHJcbiAgICAgICAgbGV0IGJ0bk5vZGUgPSBzdGF0dXMgPyBcImRpc2FibGVkXCIgOiBcIlwiO1xyXG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy00IGNvbC1zbS0yIGNvbC1sZy0xIGNvZGUtYm94XCI+XHJcbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInBhbmVsIHJvd1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nIHJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInB1bGwtbGVmdFwiPjxzdHJvbmc+e2lkfTwvc3Ryb25nPiB7cGRfbWFwW3Byb2R1Y3RdfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0IHRleHQtZGFuZ2VyXCI+PHN0cm9uZz57cHJpY2V9PC9zdHJvbmc+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWJvZHkgZm9ybS1ob3Jpem9udGFsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwIHRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtpbWFnZSA/IGltYWdlIDogcXJjb2RlfSBjbGFzc05hbWU9XCJpbWctdGh1bWJuYWlsXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDY+PHNtYWxsPnt0aW1lc3RhbXAgPyBmb3JtYXREYXRlKHRzKSA6IFwi5pyq5byA5aeLXCJ9PC9zbWFsbD48L2g2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7c3RhdHVzID8gPENvdW50RG93biB0aW1lPXsxMjB9Lz4gOiBcIlwifVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwIGlucHV0LWdyb3VwLXNtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cInRleHRcIiBkaXNhYmxlZD1cInRydWVcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwLWJ0blwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT17YGJ0biBidG4tcHJpbWFyeSAke2J0bk5vZGV9YH0gb25DbGljaz17dGhpcy5vbkludGVydmFsVGFzay5iaW5kKHRoaXMsaW5kZXgpfT7nlJ/miJA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBDb25maWdQYW5lbCBleHRlbmRzIENvbXBvbmVudHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKXtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7bGlzdCxzdGFydCxzX3ZpZXd9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBsZXQgaW5wdXROb2RlID0gbGlzdC5tYXAoKGQsaSk9PntcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgIHJldHVybiA8Q29uZmlnSW5wdXQga2V5PXtpfSBpbmRleD17aX0gY29uX2RhdGE9e2R9IGhhbmRsZVN0YXRlPXt0aGlzLmhhbmRsZVN0YXRlLmJpbmQodGhpcyl9Lz5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IGJ0bk5vZGUgPSAhc3RhcnQgPyA8YSBjbGFzc05hbWU9XCJidG4gYnRuLXN1Y2Nlc3MgYnRuLXNtXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKTtcIiBvbkNsaWNrPXt0aGlzLm9uU3RhcnRCYXRjaFRhc2suYmluZCh0aGlzKX0+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLXBsYXlcIi8+IOWFqOmDqOW8gOWni1xyXG4gICAgICAgIDwvYT4gOiA8YSBjbGFzc05hbWU9XCJidG4gYnRuLWRhbmdlciBidG4tc21cIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApO1wiIG9uQ2xpY2s9e3RoaXMub25TdG9wQmF0Y2hUYXNrLmJpbmQodGhpcyl9PlxyXG4gICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1zdG9wXCIvPiDlhajpg6jnu5PmnZ9cclxuICAgICAgICA8L2E+O1xyXG5cclxuICAgICAgICBsZXQgcGFuZWxOb2RlID0gPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctM1wiPlxyXG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJwYW5lbFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3BhbmVsLWhlYWRpbmcnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAg6K6+572uXHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdwdWxsLXJpZ2h0Jz5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2J0bk5vZGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKjxhIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBidG4tc21cIiBvbkNsaWNrPXt0aGlzLm9uU2F2ZUFsbENvbmZpZy5iaW5kKHRoaXMpfT7lhajpg6jlvIDlp4s8L2E+Ki99XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncGFuZWwtYm9keSByb3cnPlxyXG4gICAgICAgICAgICAgICAgICAgIHtpbnB1dE5vZGV9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgIDwvZGl2PjtcclxuICAgICAgICBpZihzX3ZpZXcpe1xyXG4gICAgICAgICAgICBwYW5lbE5vZGUgPSA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy0xXCI+XHJcbiAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJwYW5lbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdwYW5lbC1oZWFkaW5nJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC10aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2J0bk5vZGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Lyo8YSBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtXCIgb25DbGljaz17dGhpcy5vblNhdmVBbGxDb25maWcuYmluZCh0aGlzKX0+5YWo6YOo5byA5aeLPC9hPiovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncGFuZWwtYm9keSByb3cnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7aW5wdXROb2RlfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgICAgICA8L2Rpdj47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiA8ZGl2PntwYW5lbE5vZGV9PC9kaXY+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIENvbmZpZ0lucHV0IGV4dGVuZHMgQ29tcG9uZW50e1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpe1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlPXtcclxuICAgICAgICAgICAgaW5kZXg6dGhpcy5wcm9wcy5pbmRleFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDkv67mlLnlgLxcclxuICAgIG9uQ2hhbmdlVmFsdWUodHlwZSxpZCl7XHJcbiAgICAgICAgY29uc3Qge2luZGV4fSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7W3R5cGVdOmlkfSk7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5oYW5kbGVTdGF0ZSh0eXBlLGluZGV4LGlkKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOS/ruaUueW4kOWPt1xyXG4gICAgb25DaGFuZ2VBY2NvdW50KGlkKXtcclxuICAgICAgICBjb25zdCB7aW5kZXh9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICBsZXQgYWNjb3VudCA9ICQoYGFjY291bnRfJHtpZH1gKS52YWwoKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhhY2NvdW50KTtcclxuICAgICAgICBpZihhY2NvdW50ICE9IFwiXCIpe1xyXG4gICAgICAgICAgICB0aGlzLnByb3BzLmhhbmRsZVN0YXRlKFwiYWNjb3VudFwiLGluZGV4LGFjY291bnQpXHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwi6L6T5YWl55qE5pWw5o2u5pyJ6K+vXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpe1xyXG4gICAgICAgIGNvbnN0IHtjb25fZGF0YTp7aWQscHJvZHVjdCxwcmljZSxhY2NvdW50fX0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGxldCBwcm9kdWN0Tm9kZSA9IFByb2R1Y3QubWFwKChkLGkpPT57XHJcbiAgICAgICAgICAgIHJldHVybiA8bGkga2V5PXtpfT48YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApO1wiIG9uQ2xpY2s9e3RoaXMub25DaGFuZ2VWYWx1ZS5iaW5kKHRoaXMsXCJwcm9kdWN0XCIsZC5pZCl9PntkLm5hbWV9PC9hPjwvbGk+XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IHByaWNlTm9kZSA9IFByaWNlW3Byb2R1Y3RdLm1hcCgoZCxpKT0+e1xyXG4gICAgICAgICAgICByZXR1cm4gPGxpIGtleT17aX0+PGEgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKTtcIiBvbkNsaWNrPXt0aGlzLm9uQ2hhbmdlVmFsdWUuYmluZCh0aGlzLFwicHJpY2VcIixkLmlkKX0+e2QubmFtZX08L2E+PC9saT5cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tMTIgcm93IG1hcmdpbi1ib3R0b201XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTFcIj48aDU+e2lkfTwvaDU+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTExIGlucHV0LWdyb3VwIGlucHV0LWdyb3VwLXNtXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwLWJ0blwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGUgY29sLXNtLTEyXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtwZF9tYXBbcHJvZHVjdF19XHJcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImRyb3Bkb3duLW1lbnVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3Byb2R1Y3ROb2RlfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAtYnRuXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZSBjb2wtc20tMTJcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3ByaWNlfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJkcm9wZG93bi1tZW51XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtwcmljZU5vZGV9XHJcbiAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPXtgYWNjb3VudF8ke2lkfWB9IHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sIGlucHV0LXNtXCIgZGVmYXVsdFZhbHVlPXthY2NvdW50fS8+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwLWJ0blwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tc3VjY2VzcyBidG4tc21cIiBvbkNsaWNrPXt0aGlzLm9uQ2hhbmdlQWNjb3VudC5iaW5kKHRoaXMsaWQpfT48aSBjbGFzc05hbWU9XCJmYSBmYS1wbGF5XCIvPiDlvIDlp4s8L2E+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIENvdW50RG93biBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge3RpbWU6IHRoaXMucHJvcHMudGltZX07XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgdGhpcy50aW1lcklEID0gc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy50aWNrKCksIDEwMDApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcklEKTtcclxuICAgIH1cclxuXHJcbiAgICB0aWNrKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICB0aW1lOiB0aGlzLnN0YXRlLnRpbWUgLSAxXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYodGhpcy5zdGF0ZS50aW1lIDw9MCl7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcklEKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiA8aDY+PHNtYWxsPnt0aGlzLnN0YXRlLnRpbWV9PC9zbWFsbD48L2g2PlxyXG4gICAgfVxyXG59XHJcblxyXG5SZWFjdERPTS5yZW5kZXIoXHJcbiAgICA8TWFpblBhbmVsIC8+ICxcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWNvbnRlbnQnKVxyXG4pOyJdfQ==
