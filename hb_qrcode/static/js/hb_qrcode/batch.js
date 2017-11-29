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


var Product = [{ id: "fee_slow", name: "全国话费慢充" }, { id: "jyk", name: "加油卡" }, { id: "service_jyk", name: "客服加油卡" }],
    Price = {
    fee_slow: [{ id: "100", name: "100" }, { id: "200", name: "200" }, { id: "300", name: "300" }, { id: "500", name: "500" }, { id: "1000", name: "1000" }, { id: "2000", name: "2000" }, { id: "3000", name: "3000" }, { id: "4000", name: "4000" }, { id: "5000", name: "5000" }, { id: "10000", name: "10000" }],
    jyk: [{ id: "1000", name: "1000" }, { id: "2000", name: "2000" }, { id: "3000", name: "3000" }, { id: "4000", name: "4000" }, { id: "5000", name: "5000" }, { id: "6000", name: "6000" }, { id: "7000", name: "7000" }, { id: "8000", name: "8000" }, { id: "9000", name: "9000" }, { id: "10000", name: "10000" }],
    service_jyk: [{ id: "500", name: "500" }, { id: "1000", name: "1000" }, { id: "3000", name: "3000" }, { id: "5000", name: "5000" }, { id: "10000", name: "10000" }, { id: "20000", name: "20000" }] },
    pd_map = {
    fee_slow: "全国话费慢充",
    jyk: "加油卡",
    service_jyk: "客服加油卡"
};

var MainPanel = function (_Component) {
    _inherits(MainPanel, _Component);

    function MainPanel() {
        _classCallCheck(this, MainPanel);

        var _this = _possibleConstructorReturn(this, (MainPanel.__proto__ || Object.getPrototypeOf(MainPanel)).call(this));

        _this.state = {
            start: false,
            list: []
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
                    _this3.setState({ list: data });
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
                    img_task = setTimeout(_this4.loadCodeImage.bind(_this4, i, order_id), 30000);
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
            console.log("CleanInterval: ", list);
            this.setState({ list: list });
        }

        // 开始任务

    }, {
        key: 'onIntervalTask',
        value: function onIntervalTask(i) {
            var list = this.state.list;

            this.handleSubmitData(i);
            list[i].task = setInterval(this.handleSubmitData.bind(this, i), 100000);
            console.log("Interval: ", list);
            this.setState({ start: true, list: list });
        }

        // 开始批量任务

    }, {
        key: 'onStartBatchTask',
        value: function onStartBatchTask() {
            var list = this.state.list;

            for (var i in list) {
                list[i].status = true;
                setTimeout(this.onIntervalTask.bind(this, i), 5000);
            }
            console.log("StartBatch: ", list);
            this.setState({ list: list });
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
            console.log("StopBatch: ", list);
            this.setState({ start: false, list: list });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            // 设置弹窗
            var onShowConfig = function onShowConfig() {
                $("#modal").modal("show");
            };

            var _state = this.state,
                list = _state.list,
                start = _state.start;

            var btnNode = !start ? _react2.default.createElement(
                'a',
                { className: 'btn btn-success btn-sm', href: 'javascript:void(0);', onClick: this.onStartBatchTask.bind(this) },
                _react2.default.createElement('i', { className: 'fa fa-play' }),
                ' \u5F00\u59CB'
            ) : _react2.default.createElement(
                'a',
                { className: 'btn btn-danger btn-sm', href: 'javascript:void(0);', onClick: this.onStopBatchTask.bind(this) },
                _react2.default.createElement('i', { className: 'fa fa-stop' }),
                ' \u7ED3\u675F'
            );

            // let startNodes = start ? "disabled":"";
            var codeNodes = list.map(function (d, i) {
                return _react2.default.createElement(QRcodePanel, { key: i, data: d, onIntervalTask: _this5.onIntervalTask.bind(_this5), index: i });
            });
            return _react2.default.createElement(
                'section',
                { className: 'wrapper' },
                _react2.default.createElement(
                    'div',
                    { className: 'row' },
                    _react2.default.createElement(
                        'div',
                        { className: 'col-lg-12' },
                        _react2.default.createElement(
                            'section',
                            { className: 'panel row' },
                            _react2.default.createElement(
                                'div',
                                { className: 'panel-body' },
                                _react2.default.createElement(
                                    'span',
                                    { className: 'pull-right margin-right10', style: { marginBottom: "-5px" } },
                                    btnNode,
                                    _react2.default.createElement(
                                        'a',
                                        { href: 'javascript:void(0);', className: 'btn btn-primary btn-sm', onClick: onShowConfig.bind(this) },
                                        _react2.default.createElement('i', { className: 'fa fa-cog fa-lg' })
                                    )
                                )
                            )
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'row' },
                    codeNodes
                ),
                _react2.default.createElement(ModalPanel, { list: list, onClearInterval: this.onClearInterval.bind(this), onIntervalTask: this.onIntervalTask.bind(this),
                    onStartBatchTask: this.onStartBatchTask.bind(this), onStopBatchTask: this.onStopBatchTask.bind(this), handleConfig: this.handleConfig.bind(this) })
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
            data: _this6.props.data,
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
            function formatDate(date) {
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
                var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
                var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
                return Y + M + D + h + m + s;
            }

            var _state2 = this.state,
                qrcode = _state2.qrcode,
                index = _state2.index,
                _state2$data = _state2.data,
                product = _state2$data.product,
                price = _state2$data.price,
                image = _state2$data.image,
                timestamp = _state2$data.timestamp,
                status = _state2$data.status;

            var ts = new Date(parseInt(timestamp));
            var btnNode = !status ? "" : "disabled";
            return _react2.default.createElement(
                'div',
                { className: 'col-xs-4 col-sm-2 col-lg-1 code-box' },
                _react2.default.createElement(
                    'section',
                    { className: 'panel row' },
                    _react2.default.createElement(
                        'header',
                        { className: 'panel-heading row' },
                        _react2.default.createElement(
                            'span',
                            { className: 'pull-left' },
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

var ModalPanel = function (_Component3) {
    _inherits(ModalPanel, _Component3);

    function ModalPanel(props) {
        _classCallCheck(this, ModalPanel);

        var _this7 = _possibleConstructorReturn(this, (ModalPanel.__proto__ || Object.getPrototypeOf(ModalPanel)).call(this, props));

        _this7.state = {
            data: []
        };
        return _this7;
    }

    // 全部保存


    _createClass(ModalPanel, [{
        key: 'onSaveAllConfig',
        value: function onSaveAllConfig() {
            var data = this.state.data;

            if (data !== [] || data.length !== 0) {
                this.props.handleConfig("update", data);
                this.props.onStopBatchTask();
                this.props.onStartBatchTask();
            }
        }

        // state更新

    }, {
        key: 'handleState',
        value: function handleState(type, i, val) {
            var data = this.props.list;
            data[i][type] = val;
            this.setState({ data: data });
        }

        // 关闭

    }, {
        key: 'onCancel',
        value: function onCancel() {
            this.props.handleConfig("all");
            $('#modal').modal("hide");
        }
    }, {
        key: 'render',
        value: function render() {
            var _this8 = this;

            var list = this.props.list;

            var inputNode = list.map(function (d, i) {
                return _react2.default.createElement(ConfigInput, { key: i, index: i, data: d, handleConfig: _this8.props.handleConfig.bind(_this8),
                    onClearInterval: _this8.props.onClearInterval.bind(_this8), onIntervalTask: _this8.props.onIntervalTask.bind(_this8),
                    handleState: _this8.handleState.bind(_this8) });
            });
            return _react2.default.createElement(
                'div',
                { className: 'modal fade', id: 'modal', tabIndex: '-1', role: 'dialog', 'aria-labelledby': 'addModalLabel', 'data-backdrop': 'static' },
                _react2.default.createElement(
                    'div',
                    { className: 'modal-dialog' },
                    _react2.default.createElement(
                        'div',
                        { className: 'modal-content' },
                        _react2.default.createElement(
                            'div',
                            { className: 'modal-header' },
                            _react2.default.createElement(
                                'h4',
                                { className: 'pull-left' },
                                '\u8BBE\u7F6E'
                            ),
                            _react2.default.createElement(
                                'span',
                                { className: 'pull-right' },
                                _react2.default.createElement(
                                    'a',
                                    { href: 'javascript:void(0);', className: 'btn btn-primary btn-sm', onClick: this.onSaveAllConfig.bind(this) },
                                    '\u5168\u90E8\u4FDD\u5B58'
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'modal-body row' },
                            inputNode
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'modal-footer' },
                            _react2.default.createElement(
                                'a',
                                { className: 'btn btn-default', 'data-dismiss': 'modal', onClick: this.onCancel.bind(this) },
                                '\u5173\u95ED'
                            )
                        )
                    )
                )
            );
        }
    }]);

    return ModalPanel;
}(_react.Component);

var ConfigInput = function (_Component4) {
    _inherits(ConfigInput, _Component4);

    function ConfigInput(props) {
        _classCallCheck(this, ConfigInput);

        var _this9 = _possibleConstructorReturn(this, (ConfigInput.__proto__ || Object.getPrototypeOf(ConfigInput)).call(this, props));

        _this9.state = {
            data: _this9.props.data,
            index: _this9.props.index
        };
        return _this9;
    }

    _createClass(ConfigInput, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.setState({
                data: nextProps.data,
                index: nextProps.index
            });
        }

        // 修改值

    }, {
        key: 'onChangeValue',
        value: function onChangeValue(type, id) {
            var index = this.state.index;

            this.setState(_defineProperty({}, type, id));
            this.props.handleState(type, index, id);
        }

        // 修改帐号

    }, {
        key: 'onChangeAccount',
        value: function onChangeAccount(e) {
            var index = this.state.index;

            var account = e.target.value;
            this.props.handleState("account", index, account);
        }

        // 保存修改

    }, {
        key: 'onSaveConfig',
        value: function onSaveConfig() {
            var _state3 = this.state,
                index = _state3.index,
                data = _state3.data;

            var d = [];
            d[0] = data;
            this.props.handleConfig("update", d);
            this.props.onClearInterval(index);
            this.props.onIntervalTask(index);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this10 = this;

            var _state$data = this.state.data,
                id = _state$data.id,
                product = _state$data.product,
                price = _state$data.price,
                account = _state$data.account;

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
                    _react2.default.createElement('input', { type: 'text', className: 'form-control input-sm', defaultValue: account, onChange: this.onChangeAccount.bind(this) }),
                    _react2.default.createElement(
                        'div',
                        { className: 'input-group-btn' },
                        _react2.default.createElement(
                            'button',
                            { type: 'button', className: 'btn btn-default', onClick: this.onSaveConfig.bind(this) },
                            '\u4FDD\u5B58'
                        )
                    )
                )
            );
        }
    }]);

    return ConfigInput;
}(_react.Component);

_reactDom2.default.render(_react2.default.createElement(MainPanel, null), document.getElementById('main-content'));

},{"react":"react","react-dom":"react-dom"}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzeFxcaGJfcXJjb2RlXFxiYXRjaC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7OytlQUZBOzs7SUFHTyxPLEdBQTJCLENBQzlCLEVBQUMsSUFBRyxVQUFKLEVBQWUsTUFBSyxRQUFwQixFQUQ4QixFQUU5QixFQUFDLElBQUcsS0FBSixFQUFVLE1BQUssS0FBZixFQUY4QixFQUc5QixFQUFDLElBQUcsYUFBSixFQUFrQixNQUFLLE9BQXZCLEVBSDhCLEM7SUFBbEIsSyxHQUliO0FBQ0MsY0FBUyxDQUNMLEVBQUMsSUFBRyxLQUFKLEVBQVUsTUFBSyxLQUFmLEVBREssRUFFTCxFQUFDLElBQUcsS0FBSixFQUFVLE1BQUssS0FBZixFQUZLLEVBR0wsRUFBQyxJQUFHLEtBQUosRUFBVSxNQUFLLEtBQWYsRUFISyxFQUlMLEVBQUMsSUFBRyxLQUFKLEVBQVUsTUFBSyxLQUFmLEVBSkssRUFLTCxFQUFDLElBQUcsTUFBSixFQUFXLE1BQUssTUFBaEIsRUFMSyxFQU1MLEVBQUMsSUFBRyxNQUFKLEVBQVcsTUFBSyxNQUFoQixFQU5LLEVBT0wsRUFBQyxJQUFHLE1BQUosRUFBVyxNQUFLLE1BQWhCLEVBUEssRUFRTCxFQUFDLElBQUcsTUFBSixFQUFXLE1BQUssTUFBaEIsRUFSSyxFQVNMLEVBQUMsSUFBRyxNQUFKLEVBQVcsTUFBSyxNQUFoQixFQVRLLEVBVUwsRUFBQyxJQUFHLE9BQUosRUFBWSxNQUFLLE9BQWpCLEVBVkssQ0FEVjtBQWFDLFNBQUksQ0FDQSxFQUFDLElBQUcsTUFBSixFQUFXLE1BQUssTUFBaEIsRUFEQSxFQUVBLEVBQUMsSUFBRyxNQUFKLEVBQVcsTUFBSyxNQUFoQixFQUZBLEVBR0EsRUFBQyxJQUFHLE1BQUosRUFBVyxNQUFLLE1BQWhCLEVBSEEsRUFJQSxFQUFDLElBQUcsTUFBSixFQUFXLE1B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QUpKLHFCQURKO0FBU0k7QUFBQTtBQUFBLDBCQUFLLFdBQVUsaUJBQWY7QUFDSTtBQUFBO0FBQUEsOEJBQVEsTUFBSyxRQUFiLEVBQXNCLFdBQVUsMkNBQWhDLEVBQTRFLGVBQVksVUFBeEYsRUFBbUcsaUJBQWMsTUFBakgsRUFBd0gsaUJBQWMsT0FBdEk7QUFDSztBQURMLHlCQURKO0FBSUk7QUFBQTtBQUFBLDhCQUFJLFdBQVUsZUFBZDtBQUNLO0FBREw7QUFKSixxQkFUSjtBQWlCSSw2REFBTyxNQUFLLE1BQVosRUFBbUIsV0FBVSx1QkFBN0IsRUFBcUQsY0FBYyxPQUFuRSxFQUE0RSxVQUFVLEtBQUssZUFBTCxDQUFxQixJQUFyQixDQUEwQixJQUExQixDQUF0RixHQWpCSjtBQWtCSTtBQUFBO0FBQUEsMEJBQUssV0FBVSxpQkFBZjtBQUNJO0FBQUE7QUFBQSw4QkFBUSxNQUFLLFFBQWIsRUFBc0IsV0FBVSxpQkFBaEMsRUFBa0QsU0FBUyxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBM0Q7QUFBQTtBQUFBO0FBREo7QUFsQko7QUFGRyxhQUFQO0FBeUJIOzs7Ozs7QUFHTCxtQkFBUyxNQUFULENBQ0ksOEJBQUMsU0FBRCxPQURKLEVBRUksU0FBUyxjQUFULENBQXdCLGNBQXhCLENBRkoiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogd2VhaHd3dyBjcmVhdGUgKi9cclxuaW1wb3J0IFJlYWN0LHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XHJcbmNvbnN0IFtQcm9kdWN0LCBQcmljZSwgcGRfbWFwXSA9IFtbXHJcbiAgICB7aWQ6XCJmZWVfc2xvd1wiLG5hbWU6XCLlhajlm73or53otLnmhaLlhYVcIn0sXHJcbiAgICB7aWQ6XCJqeWtcIixuYW1lOlwi5Yqg5rK55Y2hXCJ9LFxyXG4gICAge2lkOlwic2VydmljZV9qeWtcIixuYW1lOlwi5a6i5pyN5Yqg5rK55Y2hXCJ9LFxyXG5dLCB7XHJcbiAgICBmZWVfc2xvdzpbXHJcbiAgICAgICAge2lkOlwiMTAwXCIsbmFtZTpcIjEwMFwifSxcclxuICAgICAgICB7aWQ6XCIyMDBcIixuYW1lOlwiMjAwXCJ9LFxyXG4gICAgICAgIHtpZDpcIjMwMFwiLG5hbWU6XCIzMDBcIn0sXHJcbiAgICAgICAge2lkOlwiNTAwXCIsbmFtZTpcIjUwMFwifSxcclxuICAgICAgICB7aWQ6XCIxMDAwXCIsbmFtZTpcIjEwMDBcIn0sXHJcbiAgICAgICAge2lkOlwiMjAwMFwiLG5hbWU6XCIyMDAwXCJ9LFxyXG4gICAgICAgIHtpZDpcIjMwMDBcIixuYW1lOlwiMzAwMFwifSxcclxuICAgICAgICB7aWQ6XCI0MDAwXCIsbmFtZTpcIjQwMDBcIn0sXHJcbiAgICAgICAge2lkOlwiNTAwMFwiLG5hbWU6XCI1MDAwXCJ9LFxyXG4gICAgICAgIHtpZDpcIjEwMDAwXCIsbmFtZTpcIjEwMDAwXCJ9XHJcbiAgICBdLFxyXG4gICAganlrOltcclxuICAgICAgICB7aWQ6XCIxMDAwXCIsbmFtZTpcIjEwMDBcIn0sXHJcbiAgICAgICAge2lkOlwiMjAwMFwiLG5hbWU6XCIyMDAwXCJ9LFxyXG4gICAgICAgIHtpZDpcIjMwMDBcIixuYW1lOlwiMzAwMFwifSxcclxuICAgICAgICB7aWQ6XCI0MDAwXCIsbmFtZTpcIjQwMDBcIn0sXHJcbiAgICAgICAge2lkOlwiNTAwMFwiLG5hbWU6XCI1MDAwXCJ9LFxyXG4gICAgICAgIHtpZDpcIjYwMDBcIixuYW1lOlwiNjAwMFwifSxcclxuICAgICAgICB7aWQ6XCI3MDAwXCIsbmFtZTpcIjcwMDBcIn0sXHJcbiAgICAgICAge2lkOlwiODAwMFwiLG5hbWU6XCI4MDAwXCJ9LFxyXG4gICAgICAgIHtpZDpcIjkwMDBcIixuYW1lOlwiOTAwMFwifSxcclxuICAgICAgICB7aWQ6XCIxMDAwMFwiLG5hbWU6XCIxMDAwMFwifSxcclxuICAgIF0sXHJcbiAgICBzZXJ2aWNlX2p5azpbXHJcbiAgICAgICAge2lkOlwiNTAwXCIsbmFtZTpcIjUwMFwifSxcclxuICAgICAgICB7aWQ6XCIxMDAwXCIsbmFtZTpcIjEwMDBcIn0sXHJcbiAgICAgICAge2lkOlwiMzAwMFwiLG5hbWU6XCIzMDAwXCJ9LFxyXG4gICAgICAgIHtpZDpcIjUwMDBcIixuYW1lOlwiNTAwMFwifSxcclxuICAgICAgICB7aWQ6XCIxMDAwMFwiLG5hbWU6XCIxMDAwMFwifSxcclxuICAgICAgICB7aWQ6XCIyMDAwMFwiLG5hbWU6XCIyMDAwMFwifSxcclxuICAgIF19LHtcclxuICAgIGZlZV9zbG93Olwi5YWo5Zu96K+d6LS55oWi5YWFXCIsXHJcbiAgICBqeWs6XCLliqDmsrnljaFcIixcclxuICAgIHNlcnZpY2VfanlrOlwi5a6i5pyN5Yqg5rK55Y2hXCJcclxufV07XHJcblxyXG5cclxuY2xhc3MgTWFpblBhbmVsIGV4dGVuZHMgQ29tcG9uZW50e1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnN0YXRlID17XHJcbiAgICAgICAgICAgIHN0YXJ0OmZhbHNlLFxyXG4gICAgICAgICAgICBsaXN0OltdLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5oYW5kbGVDb25maWcoXCJhbGxcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5Y+R6YCB55Sf5oiQ5LqM57u056CB6K+35rGCXHJcbiAgICBoYW5kbGVTdWJtaXREYXRhKGkpe1xyXG4gICAgICAgIGxldCB7bGlzdH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGxpc3RbaV0udGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgJC5wb3N0KCcvYXBpL3FyY29kZS9zdWJtaXQnLEpTT04uc3RyaW5naWZ5KGxpc3RbaV0pKVxyXG4gICAgICAgICAgICAuZG9uZSgoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgICAgICBsZXQge3N0YXR1cywgb3JkZXJfaWR9ID0gSlNPTi5wYXJzZShkKTtcclxuICAgICAgICAgICAgICAgIGlmKHN0YXR1cyA9PT0gJ29rJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbGlzdFtpXS5pbWcgPSBpbWc7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdFtpXS5vcmRlcl9pZCA9IG9yZGVyX2lkO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3RbaV0uc3RhdHVzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQobGlzdFtpXS5pbWdfdGFzayk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdFtpXS5pbWdfdGFzayA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29kZUltYWdlKGksb3JkZXJfaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2xpc3R9KVxyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+WIm+W7uuiuouWNleWksei0pScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgn5Yib5bu66K6i5Y2V5byC5bi4Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOWKoOi9vSAvIOS/ruaUuemFjee9rlxyXG4gICAgaGFuZGxlQ29uZmlnKHR5cGUsZGF0YT10aGlzLnN0YXRlLmxpc3Qpe1xyXG4gICAgICAgICQucG9zdCgnL2FwaS9xcmNvZGUvY29uZmlnJyxKU09OLnN0cmluZ2lmeSh7dHlwZSxkYXRhfSkpXHJcbiAgICAgICAgICAgIC5kb25lKChkKT0+e1xyXG4gICAgICAgICAgICAgICAgbGV0IHtzdGF0dXMsZGF0YX0gPSBKU09OLnBhcnNlKGQpO1xyXG4gICAgICAgICAgICAgICAgaWYoc3RhdHVzID09PSBcIm9rXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2xpc3Q6ZGF0YX0pO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+WKoOi9vemFjee9ruWksei0pScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbCgoKT0+e1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ+WKoOi9vemFjee9ruW8guW4uCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLy8g6I635Y+W5Zu+54mHXHJcbiAgICBsb2FkQ29kZUltYWdlKGksb3JkZXJfaWQpe1xyXG4gICAgICAgIGxldCB7bGlzdH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGxldCBpbWdfdGFzayA9IG51bGw7XHJcbiAgICAgICAgJC5wb3N0KCcvYXBpL3FyY29kZS9xcmNvZGVfZ2V0JyxKU09OLnN0cmluZ2lmeSh7b3JkZXJfaWR9KSlcclxuICAgICAgICAgICAgLmRvbmUoKGQpPT57XHJcbiAgICAgICAgICAgICAgICBsZXQge3N0YXR1cyxpbWFnZX0gPSBKU09OLnBhcnNlKGQpO1xyXG4gICAgICAgICAgICAgICAgaWYoc3RhdHVzID09PSBcIm9rXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3RbaV0uaW1hZ2UgPSBpbWFnZTtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0W2ldLnN0YXR1cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2xpc3R9KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGltZ190YXNrID0gc2V0VGltZW91dCh0aGlzLmxvYWRDb2RlSW1hZ2UuYmluZCh0aGlzLGksb3JkZXJfaWQpLCAzMDAwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdFtpXS5pbWdfdGFzayA9IGltZ190YXNrO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2xpc3R9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZhaWwoKCk9PntcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCfojrflj5blm77niYflvILluLgnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOWBnOatouS7u+WKoVxyXG4gICAgb25DbGVhckludGVydmFsKGkpe1xyXG4gICAgICAgIGxldCB7bGlzdH0gPXRoaXMuc3RhdGU7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbChsaXN0W2ldLnRhc2spO1xyXG4gICAgICAgIGNsZWFyVGltZW91dChsaXN0W2ldLmltZ190YXNrKTtcclxuICAgICAgICBsaXN0W2ldLnRhc2sgPSBudWxsO1xyXG4gICAgICAgIGxpc3RbaV0uaW1nX3Rhc2sgPSBudWxsO1xyXG4gICAgICAgIGxpc3RbaV0uc3RhdHVzID0gZmFsc2U7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJDbGVhbkludGVydmFsOiBcIixsaXN0KTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtsaXN0fSlcclxuICAgIH1cclxuXHJcbiAgICAvLyDlvIDlp4vku7vliqFcclxuICAgIG9uSW50ZXJ2YWxUYXNrKGkpe1xyXG4gICAgICAgIGxldCB7bGlzdH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlU3VibWl0RGF0YShpKTtcclxuICAgICAgICBsaXN0W2ldLnRhc2sgPSBzZXRJbnRlcnZhbCh0aGlzLmhhbmRsZVN1Ym1pdERhdGEuYmluZCh0aGlzLGkpLDEwMDAwMCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJJbnRlcnZhbDogXCIsIGxpc3QpO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3N0YXJ0OnRydWUsbGlzdH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOW8gOWni+aJuemHj+S7u+WKoVxyXG4gICAgb25TdGFydEJhdGNoVGFzaygpe1xyXG4gICAgICAgIGxldCB7bGlzdH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGZvcihsZXQgaSBpbiBsaXN0KXtcclxuICAgICAgICAgICAgbGlzdFtpXS5zdGF0dXMgPSB0cnVlO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMub25JbnRlcnZhbFRhc2suYmluZCh0aGlzLGkpLDUwMDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhcIlN0YXJ0QmF0Y2g6IFwiLCBsaXN0KTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtsaXN0fSlcclxuICAgIH1cclxuXHJcbiAgICAvLyDlgZzmraLmibnph4/ku7vliqFcclxuICAgIG9uU3RvcEJhdGNoVGFzaygpe1xyXG4gICAgICAgIGxldCB7bGlzdH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGZvcihsZXQgaSBpbiBsaXN0KXtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChsaXN0W2ldLnRhc2spO1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQobGlzdFtpXS5pbWdfdGFzayk7XHJcbiAgICAgICAgICAgIGxpc3RbaV0uc3RhdHVzID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxpc3RbaV0udGFzayA9IG51bGw7XHJcbiAgICAgICAgICAgIGxpc3RbaV0uaW1nX3Rhc2sgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhcIlN0b3BCYXRjaDogXCIsbGlzdCk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c3RhcnQ6ZmFsc2UsbGlzdH0pXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCl7XHJcbiAgICAgICAgLy8g6K6+572u5by556qXXHJcbiAgICAgICAgbGV0IG9uU2hvd0NvbmZpZyA9ICgpPT57XHJcbiAgICAgICAgICAgICQoXCIjbW9kYWxcIikubW9kYWwoXCJzaG93XCIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IHtsaXN0LHN0YXJ0fSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgbGV0IGJ0bk5vZGUgPSAhc3RhcnQgPyA8YSBjbGFzc05hbWU9XCJidG4gYnRuLXN1Y2Nlc3MgYnRuLXNtXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKTtcIiBvbkNsaWNrPXt0aGlzLm9uU3RhcnRCYXRjaFRhc2suYmluZCh0aGlzKX0+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLXBsYXlcIi8+IOW8gOWni1xyXG4gICAgICAgIDwvYT4gOiA8YSBjbGFzc05hbWU9XCJidG4gYnRuLWRhbmdlciBidG4tc21cIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApO1wiIG9uQ2xpY2s9e3RoaXMub25TdG9wQmF0Y2hUYXNrLmJpbmQodGhpcyl9PlxyXG4gICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1zdG9wXCIvPiDnu5PmnZ9cclxuICAgICAgICA8L2E+O1xyXG5cclxuICAgICAgICAvLyBsZXQgc3RhcnROb2RlcyA9IHN0YXJ0ID8gXCJkaXNhYmxlZFwiOlwiXCI7XHJcbiAgICAgICAgbGV0IGNvZGVOb2RlcyA9IGxpc3QubWFwKChkLGkpID0+e1xyXG4gICAgICAgICAgICByZXR1cm4gPFFSY29kZVBhbmVsIGtleT17aX0gZGF0YT17ZH0gb25JbnRlcnZhbFRhc2s9e3RoaXMub25JbnRlcnZhbFRhc2suYmluZCh0aGlzKX0gaW5kZXg9e2l9Lz5cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gPHNlY3Rpb24gY2xhc3NOYW1lPVwid3JhcHBlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctMTJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJwYW5lbCByb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0IG1hcmdpbi1yaWdodDEwXCIgc3R5bGU9e3ttYXJnaW5Cb3R0b206XCItNXB4XCJ9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7YnRuTm9kZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApO1wiIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBidG4tc21cIiBvbkNsaWNrPXtvblNob3dDb25maWcuYmluZCh0aGlzKX0+PGkgY2xhc3NOYW1lPVwiZmEgZmEtY29nIGZhLWxnXCIvPjwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAge2NvZGVOb2Rlc31cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxNb2RhbFBhbmVsIGxpc3Q9e2xpc3R9IG9uQ2xlYXJJbnRlcnZhbD17dGhpcy5vbkNsZWFySW50ZXJ2YWwuYmluZCh0aGlzKX0gb25JbnRlcnZhbFRhc2s9e3RoaXMub25JbnRlcnZhbFRhc2suYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25TdGFydEJhdGNoVGFzaz17dGhpcy5vblN0YXJ0QmF0Y2hUYXNrLmJpbmQodGhpcyl9IG9uU3RvcEJhdGNoVGFzaz17dGhpcy5vblN0b3BCYXRjaFRhc2suYmluZCh0aGlzKX0gaGFuZGxlQ29uZmlnPXt0aGlzLmhhbmRsZUNvbmZpZy5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBRUmNvZGVQYW5lbCBleHRlbmRzIENvbXBvbmVudHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKXtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZT17XHJcbiAgICAgICAgICAgIHFyY29kZTpcIi9pbWcvZmFpbC5wbmdcIixcclxuICAgICAgICAgICAgZGF0YTogdGhpcy5wcm9wcy5kYXRhLFxyXG4gICAgICAgICAgICBpbmRleDp0aGlzLnByb3BzLmluZGV4LFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgb25JbnRlcnZhbFRhc2soaSl7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5vbkludGVydmFsVGFzayhpKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICBmdW5jdGlvbiBmb3JtYXREYXRlKGRhdGUpIHtcclxuICAgICAgICAgICAgbGV0IFk9ZGF0ZS5nZXRGdWxsWWVhcigpICsgJy0nO1xyXG4gICAgICAgICAgICBsZXQgTT0oZGF0ZS5nZXRNb250aCgpKzEgPCAxMCA/ICcwJysoZGF0ZS5nZXRNb250aCgpKzEpIDogZGF0ZS5nZXRNb250aCgpKzEpICsgJy0nO1xyXG4gICAgICAgICAgICBsZXQgRD0oZGF0ZS5nZXREYXRlKCk8IDEwID8gJzAnICsgKGRhdGUuZ2V0RGF0ZSgpKSA6IGRhdGUuZ2V0RGF0ZSgpKSArICcgJztcclxuICAgICAgICAgICAgbGV0IGg9KGRhdGUuZ2V0SG91cnMoKTwgMTAgPyAnMCcgKyBkYXRlLmdldEhvdXJzKCkgOiBkYXRlLmdldEhvdXJzKCkpICsgJzonO1xyXG4gICAgICAgICAgICBsZXQgbT0oZGF0ZS5nZXRNaW51dGVzKCkgPDEwID8gJzAnICsgZGF0ZS5nZXRNaW51dGVzKCkgOiBkYXRlLmdldE1pbnV0ZXMoKSkgKyAnOic7XHJcbiAgICAgICAgICAgIGxldCBzPShkYXRlLmdldFNlY29uZHMoKSA8MTAgPyAnMCcgKyBkYXRlLmdldFNlY29uZHMoKSA6IGRhdGUuZ2V0U2Vjb25kcygpKTtcclxuICAgICAgICAgICAgcmV0dXJuIFkrTStEK2grbStzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qge3FyY29kZSxpbmRleCxkYXRhOntwcm9kdWN0LCBwcmljZSwgaW1hZ2UsIHRpbWVzdGFtcCwgc3RhdHVzfX09dGhpcy5zdGF0ZTtcclxuICAgICAgICBsZXQgdHMgPSBuZXcgRGF0ZShwYXJzZUludCh0aW1lc3RhbXApKTtcclxuICAgICAgICBsZXQgYnRuTm9kZSA9ICFzdGF0dXMgPyBcIlwiIDogXCJkaXNhYmxlZFwiO1xyXG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy00IGNvbC1zbS0yIGNvbC1sZy0xIGNvZGUtYm94XCI+XHJcbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInBhbmVsIHJvd1wiPlxyXG4gICAgICAgICAgICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nIHJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInB1bGwtbGVmdFwiPntwZF9tYXBbcHJvZHVjdF19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInB1bGwtcmlnaHQgdGV4dC1kYW5nZXJcIj48c3Ryb25nPntwcmljZX08L3N0cm9uZz48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2hlYWRlcj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keSBmb3JtLWhvcml6b250YWxcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXAgdGV4dC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e2ltYWdlID8gaW1hZ2UgOiBxcmNvZGV9IGNsYXNzTmFtZT1cImltZy10aHVtYm5haWxcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoNj48c21hbGw+e3RpbWVzdGFtcCA/IGZvcm1hdERhdGUodHMpIDogXCLmnKrlvIDlp4tcIn08L3NtYWxsPjwvaDY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAgaW5wdXQtZ3JvdXAtc21cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiB0eXBlPVwidGV4dFwiIGRpc2FibGVkPVwidHJ1ZVwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAtYnRuXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPXtgYnRuIGJ0bi1wcmltYXJ5ICR7YnRuTm9kZX1gfSBvbkNsaWNrPXt0aGlzLm9uSW50ZXJ2YWxUYXNrLmJpbmQodGhpcyxpbmRleCl9PueUn+aIkDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIE1vZGFsUGFuZWwgZXh0ZW5kcyBDb21wb25lbnR7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcyl7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGRhdGE6W11cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5YWo6YOo5L+d5a2YXHJcbiAgICBvblNhdmVBbGxDb25maWcoKSB7XHJcbiAgICAgICAgbGV0IHtkYXRhfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgaWYoZGF0YSAhPT0gW10gfHwgZGF0YS5sZW5ndGggIT09IDApe1xyXG4gICAgICAgICAgICB0aGlzLnByb3BzLmhhbmRsZUNvbmZpZyhcInVwZGF0ZVwiLGRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uU3RvcEJhdGNoVGFzaygpO1xyXG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uU3RhcnRCYXRjaFRhc2soKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBzdGF0ZeabtOaWsFxyXG4gICAgaGFuZGxlU3RhdGUodHlwZSxpLHZhbCkge1xyXG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5wcm9wcy5saXN0O1xyXG4gICAgICAgIGRhdGFbaV1bdHlwZV0gPSB2YWw7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZGF0YX0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOWFs+mXrVxyXG4gICAgb25DYW5jZWwoKXtcclxuICAgICAgICB0aGlzLnByb3BzLmhhbmRsZUNvbmZpZyhcImFsbFwiKTtcclxuICAgICAgICAkKCcjbW9kYWwnKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHtsaXN0fSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgbGV0IGlucHV0Tm9kZSA9IGxpc3QubWFwKChkLGkpPT57XHJcbiAgICAgICAgICAgIHJldHVybiA8Q29uZmlnSW5wdXQga2V5PXtpfSBpbmRleD17aX0gZGF0YT17ZH0gaGFuZGxlQ29uZmlnPXt0aGlzLnByb3BzLmhhbmRsZUNvbmZpZy5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xlYXJJbnRlcnZhbD17dGhpcy5wcm9wcy5vbkNsZWFySW50ZXJ2YWwuYmluZCh0aGlzKX0gb25JbnRlcnZhbFRhc2s9e3RoaXMucHJvcHMub25JbnRlcnZhbFRhc2suYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVTdGF0ZT17dGhpcy5oYW5kbGVTdGF0ZS5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdtb2RhbCBmYWRlJyBpZD0nbW9kYWwnIHRhYkluZGV4PSctMScgcm9sZT0nZGlhbG9nJyBhcmlhLWxhYmVsbGVkYnk9J2FkZE1vZGFsTGFiZWwnIGRhdGEtYmFja2Ryb3A9XCJzdGF0aWNcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21vZGFsLWRpYWxvZyc+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbW9kYWwtY29udGVudCc+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21vZGFsLWhlYWRlcic+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9J3B1bGwtbGVmdCc+6K6+572uPC9oND5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicHVsbC1yaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKTtcIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtXCIgb25DbGljaz17dGhpcy5vblNhdmVBbGxDb25maWcuYmluZCh0aGlzKX0+5YWo6YOo5L+d5a2YPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtb2RhbC1ib2R5IHJvdyc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtpbnB1dE5vZGV9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtb2RhbC1mb290ZXInPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9J2J0biBidG4tZGVmYXVsdCcgZGF0YS1kaXNtaXNzPSdtb2RhbCcgb25DbGljaz17dGhpcy5vbkNhbmNlbC5iaW5kKHRoaXMpfT7lhbPpl608L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIENvbmZpZ0lucHV0IGV4dGVuZHMgQ29tcG9uZW50e1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpe1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlPXtcclxuICAgICAgICAgICAgZGF0YTogdGhpcy5wcm9wcy5kYXRhLFxyXG4gICAgICAgICAgICBpbmRleDp0aGlzLnByb3BzLmluZGV4XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICAgZGF0YTogbmV4dFByb3BzLmRhdGEsXHJcbiAgICAgICAgICAgICBpbmRleDogbmV4dFByb3BzLmluZGV4XHJcbiAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOS/ruaUueWAvFxyXG4gICAgb25DaGFuZ2VWYWx1ZSh0eXBlLGlkKXtcclxuICAgICAgICBjb25zdCB7aW5kZXh9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtbdHlwZV06aWR9KTtcclxuICAgICAgICB0aGlzLnByb3BzLmhhbmRsZVN0YXRlKHR5cGUsaW5kZXgsaWQpXHJcbiAgICB9XHJcblxyXG4gICAgLy8g5L+u5pS55biQ5Y+3XHJcbiAgICBvbkNoYW5nZUFjY291bnQoZSl7XHJcbiAgICAgICAgY29uc3Qge2luZGV4fSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgbGV0IGFjY291bnQgPSBlLnRhcmdldC52YWx1ZTtcclxuICAgICAgICB0aGlzLnByb3BzLmhhbmRsZVN0YXRlKFwiYWNjb3VudFwiLGluZGV4LGFjY291bnQpXHJcbiAgICB9XHJcblxyXG4gICAgLy8g5L+d5a2Y5L+u5pS5XHJcbiAgICBvblNhdmVDb25maWcoKXtcclxuICAgICAgICBjb25zdCB7aW5kZXgsZGF0YX0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGxldCBkID0gW107XHJcbiAgICAgICAgZFswXSA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5oYW5kbGVDb25maWcoXCJ1cGRhdGVcIiwgZCk7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5vbkNsZWFySW50ZXJ2YWwoaW5kZXgpO1xyXG4gICAgICAgIHRoaXMucHJvcHMub25JbnRlcnZhbFRhc2soaW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpe1xyXG4gICAgICAgIGNvbnN0IHtpZCxwcm9kdWN0LHByaWNlLGFjY291bnR9ID0gdGhpcy5zdGF0ZS5kYXRhO1xyXG4gICAgICAgIGxldCBwcm9kdWN0Tm9kZSA9IFByb2R1Y3QubWFwKChkLGkpPT57XHJcbiAgICAgICAgICAgIHJldHVybiA8bGkga2V5PXtpfT48YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApO1wiIG9uQ2xpY2s9e3RoaXMub25DaGFuZ2VWYWx1ZS5iaW5kKHRoaXMsXCJwcm9kdWN0XCIsZC5pZCl9PntkLm5hbWV9PC9hPjwvbGk+XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IHByaWNlTm9kZSA9IFByaWNlW3Byb2R1Y3RdLm1hcCgoZCxpKT0+e1xyXG4gICAgICAgICAgICByZXR1cm4gPGxpIGtleT17aX0+PGEgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKTtcIiBvbkNsaWNrPXt0aGlzLm9uQ2hhbmdlVmFsdWUuYmluZCh0aGlzLFwicHJpY2VcIixkLmlkKX0+e2QubmFtZX08L2E+PC9saT5cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tMTIgcm93IG1hcmdpbi1ib3R0b201XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTFcIj48aDU+e2lkfTwvaDU+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTExIGlucHV0LWdyb3VwIGlucHV0LWdyb3VwLXNtXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwLWJ0blwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGUgY29sLXNtLTEyXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtwZF9tYXBbcHJvZHVjdF19XHJcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImRyb3Bkb3duLW1lbnVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3Byb2R1Y3ROb2RlfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAtYnRuXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZSBjb2wtc20tMTJcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3ByaWNlfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJkcm9wZG93bi1tZW51XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtwcmljZU5vZGV9XHJcbiAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sIGlucHV0LXNtXCIgZGVmYXVsdFZhbHVlPXthY2NvdW50fSBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZUFjY291bnQuYmluZCh0aGlzKX0vPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1ncm91cC1idG5cIj5cclxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBvbkNsaWNrPXt0aGlzLm9uU2F2ZUNvbmZpZy5iaW5kKHRoaXMpfT7kv53lrZg8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIH1cclxufVxyXG5cclxuUmVhY3RET00ucmVuZGVyKFxyXG4gICAgPE1haW5QYW5lbCAvPiAsXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1jb250ZW50JylcclxuKTsiXX0=
