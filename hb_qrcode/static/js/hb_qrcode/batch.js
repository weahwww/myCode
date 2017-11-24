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

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* weahwww create */


var MainPanel = function (_React$Component) {
    _inherits(MainPanel, _React$Component);

    function MainPanel() {
        _classCallCheck(this, MainPanel);

        var _this = _possibleConstructorReturn(this, (MainPanel.__proto__ || Object.getPrototypeOf(MainPanel)).call(this));

        _this.state = {
            start: false,
            config: [{ id: "1", product: "", price: "", mobile: "", interval: "600000" }, { id: "2", product: "", price: "", mobile: "", interval: "600000" }, { id: "3", product: "", price: "", mobile: "", interval: "600000" }, { id: "4", product: "", price: "", mobile: "", interval: "600000" }, { id: "5", product: "", price: "", mobile: "", interval: "600000" }, { id: "6", product: "", price: "", mobile: "", interval: "600000" }, { id: "7", product: "", price: "", mobile: "", interval: "600000" }, { id: "8", product: "", price: "", mobile: "", interval: "600000" }, { id: "9", product: "", price: "", mobile: "", interval: "600000" }, { id: "10", product: "", price: "", mobile: "", interval: "600000" }, { id: "11", product: "", price: "", mobile: "", interval: "600000" }, { id: "12", product: "", price: "", mobile: "", interval: "600000" }, { id: "13", product: "", price: "", mobile: "", interval: "600000" }, { id: "14", product: "", price: "", mobile: "", interval: "600000" }, { id: "15", product: "", price: "", mobile: "", interval: "600000" }, { id: "16", product: "", price: "", mobile: "", interval: "600000" }, { id: "17", product: "", price: "", mobile: "", interval: "600000" }, { id: "18", product: "", price: "", mobile: "", interval: "600000" }, { id: "19", product: "", price: "", mobile: "", interval: "600000" }, { id: "20", product: "", price: "", mobile: "", interval: "600000" }]
        };
        _this.loadConfig = _this.loadConfig.bind(_this);

        return _this;
    }

    _createClass(MainPanel, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.loadConfig();
        }
    }, {
        key: 'loadConfig',
        value: function loadConfig() {
            var _this2 = this;

            $.post('/api/qrcode/config').done(function (d) {
                var _JSON$parse = JSON.parse(d),
                    status = _JSON$parse.status,
                    data = _JSON$parse.data;

                if (status === "ok") {
                    _this2.setState({ config: data });
                } else {
                    alert('加载配置失败');
                }
            }).fail(function () {
                alert('加载配置异常');
            });
        }

        // 发送号码和价格

    }, {
        key: 'sendPhonePrice',
        value: function sendPhonePrice(phone, price, product) {
            var _this3 = this;

            var timestamp = new Date().getTime();
            var r = {
                product: product,
                num: 1,
                phone: phone,
                price: price,
                timestamp: timestamp
            };
            console.log(r);
            $.post("/api/qrcode/submit", JSON.stringify(r)).done(function (m) {
                var _JSON$parse2 = JSON.parse(m),
                    msg = _JSON$parse2.msg;

                if (msg === "ok") {
                    _this3.loadCodeList();
                } else {
                    console.log('发送失败,请稍候再试!');
                }
            }).fail(function () {
                console.log('服务器获取信息失败');
            });
        }

        // 设置回调结果

    }, {
        key: 'onSetCodeState',
        value: function onSetCodeState(create_time, st) {
            var _this4 = this;

            $.post('/api/qrcode/callback', JSON.stringify({ create_time: create_time, status: st })).done(function (d) {
                var _JSON$parse3 = JSON.parse(d),
                    status = _JSON$parse3.status;

                if (status === 'ok') {
                    if (st !== 'used') {
                        alert('\u8BBE\u7F6E\u6210\u529F');
                    }
                    _this4.loadCodeList();
                } else {
                    if (st !== 'used') {
                        alert('设置失败');
                    }
                }
            }).fail(function () {
                alert('设置异常');
            });
        }

        // 开始运行

    }, {
        key: 'onStartTask',
        value: function onStartTask() {
            this.setState({ start: true });
        }

        // 停止刷新

    }, {
        key: 'onStopTask',
        value: function onStopTask() {
            var task = this.state.task;

            clearInterval(task);
            this.setState({ task: null, refresh: false });
        }

        // 设置弹窗

    }, {
        key: 'onShowConfig',
        value: function onShowConfig(cur_tab) {
            this.setState({ cur_tab: cur_tab });
            this.loadCodeList();
        }

        // 取码弹窗

    }, {
        key: 'onSetConfig',
        value: function onSetConfig(i) {
            var code_list = this.state.code_list;
            var _ref = [code_list[i], { title: "取码", code: "getCode" }],
                _ref$ = _ref[0],
                image = _ref$.image,
                create_time = _ref$.create_time,
                show_type = _ref[1];

            this.setState({ cur_data: { image: image, create_time: create_time }, show_type: show_type });
            this.onSetCodeState(code_list[i].create_time, 'used');
            $('#modal').modal("show");
        }
    }, {
        key: 'render',
        value: function render() {
            var _state = this.state,
                config = _state.config,
                start = _state.start;

            var s_map = { running: "生成中", used: "已取码", wait: "未取码", finish: "完成", fail: "失败" };
            var style_map = { running: "text-primary", used: "", wait: "text-danger", finish: "text-success", fail: "text-danger" };
            var startNodes = start ? "disabled" : "";
            var codeNodes = config.map(function (d, i) {
                return _react2.default.createElement(QRcodePanel, { key: i, data: d, start: start });
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
                                    _react2.default.createElement(
                                        'a',
                                        { className: 'btn btn-success btn-sm ' + startNodes, href: 'javascript:void(0);', onClick: this.onStartTask.bind(this) },
                                        _react2.default.createElement('i', { className: 'fa fa-play' }),
                                        ' \u5F00\u59CB'
                                    ),
                                    _react2.default.createElement(
                                        'a',
                                        { href: 'javascript:void(0);', className: 'btn btn-primary btn-sm', onClick: this.onShowConfig.bind(this) },
                                        _react2.default.createElement('i', { className: 'fa fa-plus fa-lg' })
                                    )
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'section',
                            { className: 'panel row' },
                            codeNodes
                        )
                    )
                )
            );
        }
    }]);

    return MainPanel;
}(_react2.default.Component);

var QRcodePanel = function (_React$Component2) {
    _inherits(QRcodePanel, _React$Component2);

    function QRcodePanel(props) {
        _classCallCheck(this, QRcodePanel);

        var _this5 = _possibleConstructorReturn(this, (QRcodePanel.__proto__ || Object.getPrototypeOf(QRcodePanel)).call(this, props));

        _this5.state = {
            qrcode: "/img/fail.png",
            timestamp: ""
        };
        _this5.onCheckTaskRun();
        return _this5;
    }

    // componentWillMount(){
    //     this.onCheckTaskRun();
    // }

    // 是否运行任务


    _createClass(QRcodePanel, [{
        key: 'onCheckTaskRun',
        value: function onCheckTaskRun() {
            if (this.props.start) {
                alert(111);
            }
        }

        // 加载二维码

    }, {
        key: 'loadCode',
        value: function loadCode() {
            var _this6 = this;

            $.post('/api/qrcode/summary', JSON.stringify(this.props.data)).done(function (d) {
                var _JSON$parse4 = JSON.parse(d),
                    msg = _JSON$parse4.msg,
                    data = _JSON$parse4.data;

                if (msg === 'ok') {
                    _this6.setState({
                        qrcode: data
                    });
                } else {
                    alert('加载二维码错误');
                }
            }).fail(function () {
                alert('加载二维码异常');
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _state2 = this.state,
                qrcode = _state2.qrcode,
                timestamp = _state2.timestamp;

            if (this.props.start) {
                alert(111);
            }
            return _react2.default.createElement(
                'div',
                { className: 'col-sm-1' },
                _react2.default.createElement(
                    'div',
                    { className: 'panel-body form-horizontal' },
                    _react2.default.createElement(
                        'div',
                        { className: 'form-group text-center' },
                        _react2.default.createElement('img', { src: qrcode, className: 'img-thumbnail' })
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
                                    { className: 'btn btn-primary' },
                                    '\u5237\u65B0'
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return QRcodePanel;
}(_react2.default.Component);

// class ModalPanel extends React.Component{
//     constructor(props){
//         super(props);
//         this.state = {
//             product:[
//                 {id:"fee_slow",name:"全国话费慢充"},
//                 {id:"jyk",name:"加油卡"},
//                 {id:"service_jyk",name:"客服加油卡"},
//             ],
//             price:{
//                 fee_slow:[
//                     {id:"100",name:"100"},
//                     {id:"200",name:"200"},
//                     {id:"300",name:"300"},
//                     {id:"500",name:"500"},
//                     {id:"1000",name:"1000"},
//                     {id:"2000",name:"2000"},
//                     {id:"3000",name:"3000"},
//                     {id:"4000",name:"4000"},
//                     {id:"5000",name:"5000"},
//                     {id:"10000",name:"10000"}
//                 ],
//                 jyk:[
//                     {id:"1000",name:"1000"},
//                     {id:"2000",name:"2000"},
//                     {id:"3000",name:"3000"},
//                     {id:"4000",name:"4000"},
//                     {id:"5000",name:"5000"},
//                     {id:"6000",name:"6000"},
//                     {id:"7000",name:"7000"},
//                     {id:"8000",name:"8000"},
//                     {id:"9000",name:"9000"},
//                     {id:"10000",name:"10000"},
//                 ],
//                 service_jyk:[
//                     {id:"500",name:"500"},
//                     {id:"1000",name:"1000"},
//                     {id:"3000",name:"3000"},
//                     {id:"5000",name:"5000"},
//                     {id:"10000",name:"10000"},
//                     {id:"20000",name:"20000"},
//                 ]
//             },
//             cur_product:"service_jyk",
//             cur_price:"500",
//         }
//     }
//
//     // 选择产品
//     onSelectProduct(){
//         let cur_price = product_active==="fee_slow"?"100":"1000";
//         this.setState({product_active,price_active,mobile:""})
//     }
//
//     // 选择价格
//     onSelectPrice(cur_price){
//         this.setState({cur_price})
//     }
//
//     // 发送号码和价格生成二维码
//     sendPhonePrice(){
//         const {mobile, product_active,price_active} = this.state;
//         let [phone, product, price] = [mobile, product_active,price_active];
//         console.log(phone,", ",price,", ",product);
//         if(phone === ''){
//             alert('号码格式错误,请重新输入!');
//             return false;
//         }
//
//         if(window.confirm("确认生成二维码吗?")){
//             this.props.sendPhonePrice(phone,price,product);
//             $("#modal").modal('hide');
//         }else{
//             return false
//         }
//     }
//
//     // 关闭
//     onCancel(){
//         this.setState({mobile:null,product_active:"fee_slow", price_active:"100",});
//         $('#modal').modal("hide");
//     }
//
//     // 手机号码输入
//     onMobileChange(e){
//         console.log(e.target.value);
//         this.setState({mobile: e.target.value})
//     }
//
//     onSelectUsedMobile(mobile){
//         this.setState({mobile})
//     }
//
//     // 随机输入手机号
//     getRandomPhone() {
//         let numArray = ["139", "138", "137", "136", "135", "134", "159", "158", "157", "150", "151", "152", "188", "187", "182", "183", "184", "178", "130", "131", "132", "156", "155", "186", "185", "176", "133", "153", "189", "180", "181", "177"];
//         let i = parseInt(10 * Math.random());
//         let mobile = numArray[i];
//         for (let j = 0; j < 8; j++) {
//             mobile = mobile + Math.floor(Math.random() * 10);
//         }
//         this.setState({mobile})
//     }
//
//     render() {
//         const {cur_data:{image,create_time}, show_type: {title, code}} = this.props;
//         const {used_mobile, product, price, mobile, product_active, price_active,def_img} = this.state;
//         let [showNodes, okBtn] = [<div className="text-center"><img src={image ? image : def_img} className="img-thumbnail"/><h5>{create_time}</h5></div>, "",];
//
//         let productBtn = product.map((d, i) => {
//             let btn_style = product_active === d.id ? "btn-primary" : "btn-default";
//             return <div className="col-sm-4 margin-bottom15"><a key={i} href="javascript:void(0);" className={`btn btn-block ${btn_style}`}
//                                                                 onClick={this.onSelectProduct.bind(this, d.id)}>{d.name}</a></div>
//         });
//
//         let priceBtn = price[product_active].map((d, i) => {
//             let btn_style = price_active === d.id ? "btn-primary" : "btn-default";
//             return <div className="col-sm-3 margin-bottom15"><a key={i} href="javascript:void(0);" className={`btn btn-block ${btn_style}`}
//                         onClick={this.onSelectPrice.bind(this, d.id)}>{d.name}</a></div>
//         });
//
//         let inputNode = <input type="text" className="form-control" value={mobile} defaultValue={mobile}
//                         placeholder="输入充值的帐号" onChange={this.onMobileChange.bind(this)}/>;
//         if(product_active === 'fee_slow'){
//             let usedMobileBtn = used_mobile.map((d,i)=>{
//                 return <li key={i}><a href="javascript:void(0);" onClick={this.onSelectUsedMobile.bind(this,d.id)}>{d.name}</a></li>
//             });
//
//             inputNode = <div className="input-group">
//                 <div className="input-group-btn">
//                     <a type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                         <i className="fa fa-caret-down"/>
//                     </a>
//                     <ul className="dropdown-menu dropdown-menu-right">
//                         {usedMobileBtn}
//                     </ul>
//                 </div>
//                 <input type="text" className="form-control" value={mobile} defaultValue={mobile} placeholder="输入充值的帐号"
//                        onChange={this.onMobileChange.bind(this)}/>
//                 <div className="input-group-btn">
//                     <button className="btn btn-default" type="button" onClick={this.getRandomPhone.bind(this)}>随机</button>
//                 </div>
//             </div>;
//         }
//
//         if (code === "createNew") {
//             showNodes = <div className='form-group'>
//                 <label className="col-sm-4 col-md-2 control-label">产品</label>
//                 <div className="col-sm-8 col-md-10 row">
//                     {productBtn}
//                 </div>
//
//                 <label className="col-sm-4 col-md-2 control-label">充值帐号</label>
//                 <div className="col-sm-8 col-md-10 margin-bottom15">
//                     {inputNode}
//                 </div>
//
//                 <label className="col-sm-4 col-md-2 control-label">面值</label>
//                 <div className="col-sm-8 col-md-10 row">
//                     {priceBtn}
//                 </div>
//
//             </div>;
//             okBtn = <a className="btn btn-primary" onClick={this.sendPhonePrice.bind(this)}>生成</a>;
//         }
//
//         return <div className='modal fade' id='modal' tabIndex='-1' role='dialog' aria-labelledby='addModalLabel' data-backdrop="static">
//             <div className='modal-dialog'>
//                 <div className='modal-content'>
//                     <div className='modal-header'>
//                         <h4 className='modal-title'>{title}</h4>
//                     </div>
//
//                     <div className='modal-body form-horizontal'>
//                         {showNodes}
//                     </div>
//
//                     <div className='modal-footer'>
//                         {okBtn}
//                         <a className='btn btn-default' data-dismiss='modal' onClick={this.onCancel.bind(this)}>关闭</a>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     }
// }

_reactDom2.default.render(_react2.default.createElement(MainPanel, null), document.getElementById('main-content'));

},{"react":"react","react-dom":"react-dom"}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzeFxcaGJfcXJjb2RlXFxiYXRjaC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQ0E7Ozs7QUFDQTs7Ozs7Ozs7OzsrZUFGQTs7O0lBSU0sUzs7O0FBQ0YseUJBQWM7QUFBQTs7QUFBQTs7QUFFVixjQUFLLEtBQUwsR0FBWTtBQUNSLG1CQUFNLEtBREU7QUFFUixvQkFBTyxDQUNILEVBQUMsSUFBRyxHQUFKLEVBQVEsU0FBUSxFQUFoQixFQUFtQixPQUFNLEVBQXpCLEVBQTRCLFFBQU8sRUFBbkMsRUFBc0MsVUFBUyxRQUEvQyxFQURHLEVBRUgsRUFBQyxJQUFHLEdBQUosRUFBUSxTQUFRLEVBQWhCLEVBQW1CLE9BQU0sRUFBekIsRUFBNEIsUUFBTyxFQUFuQyxFQUFzQyxVQUFTLFFBQS9DLEVBRkcsRUFHSCxFQUFDLElBQUcsR0FBSixFQUFRLFNBQVEsRUFBaEIsRUFBbUIsT0FBTSxFQUF6QixFQUE0QixRQUFPLEVBQW5DLEVBQXNDLFVBQVMsUUFBL0MsRUFIRyxFQUlILEVBQUMsSUFBRyxHQUFKLEVBQVEsU0FBUSxFQUFoQixFQUFtQixPQUFNLEVBQXpCLEVBQTRCLFFBQU8sRUFBbkMsRUFBc0MsVUFBUyxRQUEvQyxFQUpHLEVBS0gsRUFBQyxJQUFHLEdBQUosRUFBUSxTQUFRLEVBQWhCLEVBQW1CLE9BQU0sRUFBekIsRUFBNEIsUUFBTyxFQUFuQyxFQUFzQyxVQUFTLFFBQS9DLEVBTEcsRUFNSCxFQUFDLElBQUcsR0FBSixFQUFRLFNBQVEsRUFBaEIsRUFBbUIsT0FBTSxFQUF6QixFQUE0QixRQUFPLEVBQW5DLEVBQXNDLFVBQVMsUUFBL0MsRUFORyxFQU9ILEVBQUMsSUFBRyxHQUFKLEVBQVEsU0FBUSxFQUFoQixFQUFtQixPQUFNLEVBQXpCLEVBQTRCLFFBQU8sRUFBbkMsRUFBc0MsVUFBUyxRQUEvQyxFQVBHLEVBUUgsRUFBQyxJQUFHLEdB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFTLE1BQVQsQ0FDSSw4QkFBQyxTQUFELE9BREosRUFFSSxTQUFTLGNBQVQsQ0FBd0IsY0FBeEIsQ0FGSiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiB3ZWFod3d3IGNyZWF0ZSAqL1xyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcclxuXHJcbmNsYXNzIE1haW5QYW5lbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9e1xyXG4gICAgICAgICAgICBzdGFydDpmYWxzZSxcclxuICAgICAgICAgICAgY29uZmlnOltcclxuICAgICAgICAgICAgICAgIHtpZDpcIjFcIixwcm9kdWN0OlwiXCIscHJpY2U6XCJcIixtb2JpbGU6XCJcIixpbnRlcnZhbDpcIjYwMDAwMFwifSxcclxuICAgICAgICAgICAgICAgIHtpZDpcIjJcIixwcm9kdWN0OlwiXCIscHJpY2U6XCJcIixtb2JpbGU6XCJcIixpbnRlcnZhbDpcIjYwMDAwMFwifSxcclxuICAgICAgICAgICAgICAgIHtpZDpcIjNcIixwcm9kdWN0OlwiXCIscHJpY2U6XCJcIixtb2JpbGU6XCJcIixpbnRlcnZhbDpcIjYwMDAwMFwifSxcclxuICAgICAgICAgICAgICAgIHtpZDpcIjRcIixwcm9kdWN0OlwiXCIscHJpY2U6XCJcIixtb2JpbGU6XCJcIixpbnRlcnZhbDpcIjYwMDAwMFwifSxcclxuICAgICAgICAgICAgICAgIHtpZDpcIjVcIixwcm9kdWN0OlwiXCIscHJpY2U6XCJcIixtb2JpbGU6XCJcIixpbnRlcnZhbDpcIjYwMDAwMFwifSxcclxuICAgICAgICAgICAgICAgIHtpZDpcIjZcIixwcm9kdWN0OlwiXCIscHJpY2U6XCJcIixtb2JpbGU6XCJcIixpbnRlcnZhbDpcIjYwMDAwMFwifSxcclxuICAgICAgICAgICAgICAgIHtpZDpcIjdcIixwcm9kdWN0OlwiXCIscHJpY2U6XCJcIixtb2JpbGU6XCJcIixpbnRlcnZhbDpcIjYwMDAwMFwifSxcclxuICAgICAgICAgICAgICAgIHtpZDpcIjhcIixwcm9kdWN0OlwiXCIscHJpY2U6XCJcIixtb2JpbGU6XCJcIixpbnRlcnZhbDpcIjYwMDAwMFwifSxcclxuICAgICAgICAgICAgICAgIHtpZDpcIjlcIixwcm9kdWN0OlwiXCIscHJpY2U6XCJcIixtb2JpbGU6XCJcIixpbnRlcnZhbDpcIjYwMDAwMFwifSxcclxuICAgICAgICAgICAgICAgIHtpZDpcIjEwXCIscHJvZHVjdDpcIlwiLHByaWNlOlwiXCIsbW9iaWxlOlwiXCIsaW50ZXJ2YWw6XCI2MDAwMDBcIn0sXHJcbiAgICAgICAgICAgICAgICB7aWQ6XCIxMVwiLHByb2R1Y3Q6XCJcIixwcmljZTpcIlwiLG1vYmlsZTpcIlwiLGludGVydmFsOlwiNjAwMDAwXCJ9LFxyXG4gICAgICAgICAgICAgICAge2lkOlwiMTJcIixwcm9kdWN0OlwiXCIscHJpY2U6XCJcIixtb2JpbGU6XCJcIixpbnRlcnZhbDpcIjYwMDAwMFwifSxcclxuICAgICAgICAgICAgICAgIHtpZDpcIjEzXCIscHJvZHVjdDpcIlwiLHByaWNlOlwiXCIsbW9iaWxlOlwiXCIsaW50ZXJ2YWw6XCI2MDAwMDBcIn0sXHJcbiAgICAgICAgICAgICAgICB7aWQ6XCIxNFwiLHByb2R1Y3Q6XCJcIixwcmljZTpcIlwiLG1vYmlsZTpcIlwiLGludGVydmFsOlwiNjAwMDAwXCJ9LFxyXG4gICAgICAgICAgICAgICAge2lkOlwiMTVcIixwcm9kdWN0OlwiXCIscHJpY2U6XCJcIixtb2JpbGU6XCJcIixpbnRlcnZhbDpcIjYwMDAwMFwifSxcclxuICAgICAgICAgICAgICAgIHtpZDpcIjE2XCIscHJvZHVjdDpcIlwiLHByaWNlOlwiXCIsbW9iaWxlOlwiXCIsaW50ZXJ2YWw6XCI2MDAwMDBcIn0sXHJcbiAgICAgICAgICAgICAgICB7aWQ6XCIxN1wiLHByb2R1Y3Q6XCJcIixwcmljZTpcIlwiLG1vYmlsZTpcIlwiLGludGVydmFsOlwiNjAwMDAwXCJ9LFxyXG4gICAgICAgICAgICAgICAge2lkOlwiMThcIixwcm9kdWN0OlwiXCIscHJpY2U6XCJcIixtb2JpbGU6XCJcIixpbnRlcnZhbDpcIjYwMDAwMFwifSxcclxuICAgICAgICAgICAgICAgIHtpZDpcIjE5XCIscHJvZHVjdDpcIlwiLHByaWNlOlwiXCIsbW9iaWxlOlwiXCIsaW50ZXJ2YWw6XCI2MDAwMDBcIn0sXHJcbiAgICAgICAgICAgICAgICB7aWQ6XCIyMFwiLHByb2R1Y3Q6XCJcIixwcmljZTpcIlwiLG1vYmlsZTpcIlwiLGludGVydmFsOlwiNjAwMDAwXCJ9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMubG9hZENvbmZpZyA9IHRoaXMubG9hZENvbmZpZy5iaW5kKHRoaXMpO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKXtcclxuICAgICAgICB0aGlzLmxvYWRDb25maWcoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkQ29uZmlnKCl7XHJcbiAgICAgICAgJC5wb3N0KCcvYXBpL3FyY29kZS9jb25maWcnKVxyXG4gICAgICAgICAgICAuZG9uZSgoZCk9PntcclxuICAgICAgICAgICAgICAgIGxldCB7c3RhdHVzLGRhdGF9ID0gSlNPTi5wYXJzZShkKTtcclxuICAgICAgICAgICAgICAgIGlmKHN0YXR1cyA9PT0gXCJva1wiKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtjb25maWc6ZGF0YX0pXHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgn5Yqg6L296YWN572u5aSx6LSlJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZhaWwoKCk9PntcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCfliqDovb3phY3nva7lvILluLgnKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgLy8g5Y+R6YCB5Y+356CB5ZKM5Lu35qC8XHJcbiAgICBzZW5kUGhvbmVQcmljZShwaG9uZSxwcmljZSxwcm9kdWN0KSB7XHJcbiAgICAgICAgbGV0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgIGxldCByID0ge1xyXG4gICAgICAgICAgICBwcm9kdWN0LFxyXG4gICAgICAgICAgICBudW06IDEsXHJcbiAgICAgICAgICAgIHBob25lLFxyXG4gICAgICAgICAgICBwcmljZSxcclxuICAgICAgICAgICAgdGltZXN0YW1wXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zb2xlLmxvZyhyKTtcclxuICAgICAgICAkLnBvc3QoXCIvYXBpL3FyY29kZS9zdWJtaXRcIiwgSlNPTi5zdHJpbmdpZnkocikpXHJcbiAgICAgICAgICAgIC5kb25lKChtKT0+e1xyXG4gICAgICAgICAgICAgICAgbGV0IHttc2d9ID0gSlNPTi5wYXJzZShtKTtcclxuICAgICAgICAgICAgICAgIGlmIChtc2cgPT09IFwib2tcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZENvZGVMaXN0KCk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5Y+R6YCB5aSx6LSlLOivt+eojeWAmeWGjeivlSEnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC5mYWlsKCgpPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+acjeWKoeWZqOiOt+WPluS/oeaBr+Wksei0pScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDorr7nva7lm57osIPnu5PmnpxcclxuICAgIG9uU2V0Q29kZVN0YXRlKGNyZWF0ZV90aW1lLCBzdCl7XHJcbiAgICAgICAgJC5wb3N0KCcvYXBpL3FyY29kZS9jYWxsYmFjaycsIEpTT04uc3RyaW5naWZ5KHtjcmVhdGVfdGltZSwgc3RhdHVzOnN0fSkpXHJcbiAgICAgICAgICAgIC5kb25lKChkKT0+e1xyXG4gICAgICAgICAgICAgICAgY29uc3Qge3N0YXR1c30gPSBKU09OLnBhcnNlKGQpO1xyXG4gICAgICAgICAgICAgICAgaWYoc3RhdHVzID09PSAnb2snKXtcclxuICAgICAgICAgICAgICAgICAgICBpZihzdCAhPT0gJ3VzZWQnKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoYOiuvue9ruaIkOWKn2ApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRDb2RlTGlzdCgpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc3QgIT09ICd1c2VkJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCforr7nva7lpLHotKUnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mYWlsKCgpID0+e1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ+iuvue9ruW8guW4uCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDlvIDlp4vov5DooYxcclxuICAgIG9uU3RhcnRUYXNrKCl7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c3RhcnQ6dHJ1ZX0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOWBnOatouWIt+aWsFxyXG4gICAgb25TdG9wVGFzaygpe1xyXG4gICAgICAgIGxldCB7dGFza30gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGFzayk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7dGFzazpudWxsLHJlZnJlc2g6ZmFsc2V9KVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOiuvue9ruW8ueeql1xyXG4gICAgb25TaG93Q29uZmlnKGN1cl90YWIpe1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2N1cl90YWJ9KTtcclxuICAgICAgICB0aGlzLmxvYWRDb2RlTGlzdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOWPlueggeW8ueeql1xyXG4gICAgb25TZXRDb25maWcoaSl7XHJcbiAgICAgICAgbGV0IHtjb2RlX2xpc3R9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICBsZXQgW3tpbWFnZSxjcmVhdGVfdGltZX0sIHNob3dfdHlwZV0gPSBbY29kZV9saXN0W2ldLHt0aXRsZTpcIuWPlueggVwiLGNvZGU6XCJnZXRDb2RlXCJ9XTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtjdXJfZGF0YTp7aW1hZ2UsY3JlYXRlX3RpbWV9LHNob3dfdHlwZX0pO1xyXG4gICAgICAgIHRoaXMub25TZXRDb2RlU3RhdGUoY29kZV9saXN0W2ldLmNyZWF0ZV90aW1lLCd1c2VkJyk7XHJcbiAgICAgICAgJCgnI21vZGFsJykubW9kYWwoXCJzaG93XCIpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICBjb25zdCB7Y29uZmlnLHN0YXJ0fSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgY29uc3Qgc19tYXAgPSB7cnVubmluZzpcIueUn+aIkOS4rVwiLHVzZWQ6IFwi5bey5Y+W56CBXCIsIHdhaXQ6IFwi5pyq5Y+W56CBXCIsIGZpbmlzaDogXCLlrozmiJBcIixmYWlsOlwi5aSx6LSlXCJ9O1xyXG4gICAgICAgIGNvbnN0IHN0eWxlX21hcCA9IHtydW5uaW5nOlwidGV4dC1wcmltYXJ5XCIsdXNlZDpcIlwiLHdhaXQ6XCJ0ZXh0LWRhbmdlclwiLGZpbmlzaDpcInRleHQtc3VjY2Vzc1wiLGZhaWw6XCJ0ZXh0LWRhbmdlclwifTtcclxuICAgICAgICBsZXQgc3RhcnROb2RlcyA9IHN0YXJ0ID8gXCJkaXNhYmxlZFwiIDogXCJcIjtcclxuICAgICAgICBsZXQgY29kZU5vZGVzID0gY29uZmlnLm1hcCgoZCxpKSA9PntcclxuICAgICAgICAgICAgcmV0dXJuIDxRUmNvZGVQYW5lbCBrZXk9e2l9IGRhdGE9e2R9IHN0YXJ0PXtzdGFydH0vPlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybjxzZWN0aW9uIGNsYXNzTmFtZT1cIndyYXBwZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwicGFuZWwgcm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicHVsbC1yaWdodCBtYXJnaW4tcmlnaHQxMFwiIHN0eWxlPXt7bWFyZ2luQm90dG9tOlwiLTVweFwifX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPXtgYnRuIGJ0bi1zdWNjZXNzIGJ0bi1zbSAke3N0YXJ0Tm9kZXN9YH0gaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKTtcIiBvbkNsaWNrPXt0aGlzLm9uU3RhcnRUYXNrLmJpbmQodGhpcyl9PjxpIGNsYXNzTmFtZT1cImZhIGZhLXBsYXlcIi8+IOW8gOWnizwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApO1wiIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBidG4tc21cIiBvbkNsaWNrPXt0aGlzLm9uU2hvd0NvbmZpZy5iaW5kKHRoaXMpfT48aSBjbGFzc05hbWU9XCJmYSBmYS1wbHVzIGZhLWxnXCIvPjwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJwYW5lbCByb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2NvZGVOb2Rlc31cclxuICAgICAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHsvKjxNb2RhbFBhbmVsIGNvbmZpZz17Y29uZmlnfSBvblNldENvbmZpZz17dGhpcy5vblNldENvbmZpZy5iaW5kKHRoaXMpfS8+Ki99XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBRUmNvZGVQYW5lbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKXtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZT17XHJcbiAgICAgICAgICAgIHFyY29kZTpcIi9pbWcvZmFpbC5wbmdcIixcclxuICAgICAgICAgICAgdGltZXN0YW1wOlwiXCIsXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm9uQ2hlY2tUYXNrUnVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29tcG9uZW50V2lsbE1vdW50KCl7XHJcbiAgICAvLyAgICAgdGhpcy5vbkNoZWNrVGFza1J1bigpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIOaYr+WQpui/kOihjOS7u+WKoVxyXG4gICAgb25DaGVja1Rhc2tSdW4oKXtcclxuICAgICAgICBpZih0aGlzLnByb3BzLnN0YXJ0KXtcclxuICAgICAgICAgICAgYWxlcnQoMTExKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5Yqg6L295LqM57u056CBXHJcbiAgICBsb2FkQ29kZSgpe1xyXG4gICAgICAgICQucG9zdCgnL2FwaS9xcmNvZGUvc3VtbWFyeScsSlNPTi5zdHJpbmdpZnkodGhpcy5wcm9wcy5kYXRhKSlcclxuICAgICAgICAgICAgLmRvbmUoKGQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHttc2csIGRhdGF9ID0gSlNPTi5wYXJzZShkKTtcclxuICAgICAgICAgICAgICAgIGlmKG1zZyA9PT0gJ29rJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHFyY29kZTpkYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+WKoOi9veS6jOe7tOeggemUmeivrycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgn5Yqg6L295LqM57u056CB5byC5bi4Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICBjb25zdCB7cXJjb2RlLHRpbWVzdGFtcH09dGhpcy5zdGF0ZTtcclxuICAgICAgICBpZih0aGlzLnByb3BzLnN0YXJ0KXtcclxuICAgICAgICAgICAgYWxlcnQoMTExKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTFcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keSBmb3JtLWhvcml6b250YWxcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXAgdGV4dC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e3FyY29kZX0gY2xhc3NOYW1lPVwiaW1nLXRodW1ibmFpbFwiLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbnRyb2wtbGFiZWxcIj57dGltZXN0YW1wfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAgaW5wdXQtZ3JvdXAtc21cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiB0eXBlPVwidGV4dFwiIGRpc2FibGVkPVwidHJ1ZVwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAtYnRuXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCI+5Yi35pawPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBjbGFzcyBNb2RhbFBhbmVsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50e1xyXG4vLyAgICAgY29uc3RydWN0b3IocHJvcHMpe1xyXG4vLyAgICAgICAgIHN1cGVyKHByb3BzKTtcclxuLy8gICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4vLyAgICAgICAgICAgICBwcm9kdWN0OltcclxuLy8gICAgICAgICAgICAgICAgIHtpZDpcImZlZV9zbG93XCIsbmFtZTpcIuWFqOWbveivnei0ueaFouWFhVwifSxcclxuLy8gICAgICAgICAgICAgICAgIHtpZDpcImp5a1wiLG5hbWU6XCLliqDmsrnljaFcIn0sXHJcbi8vICAgICAgICAgICAgICAgICB7aWQ6XCJzZXJ2aWNlX2p5a1wiLG5hbWU6XCLlrqLmnI3liqDmsrnljaFcIn0sXHJcbi8vICAgICAgICAgICAgIF0sXHJcbi8vICAgICAgICAgICAgIHByaWNlOntcclxuLy8gICAgICAgICAgICAgICAgIGZlZV9zbG93OltcclxuLy8gICAgICAgICAgICAgICAgICAgICB7aWQ6XCIxMDBcIixuYW1lOlwiMTAwXCJ9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtpZDpcIjIwMFwiLG5hbWU6XCIyMDBcIn0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge2lkOlwiMzAwXCIsbmFtZTpcIjMwMFwifSxcclxuLy8gICAgICAgICAgICAgICAgICAgICB7aWQ6XCI1MDBcIixuYW1lOlwiNTAwXCJ9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtpZDpcIjEwMDBcIixuYW1lOlwiMTAwMFwifSxcclxuLy8gICAgICAgICAgICAgICAgICAgICB7aWQ6XCIyMDAwXCIsbmFtZTpcIjIwMDBcIn0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge2lkOlwiMzAwMFwiLG5hbWU6XCIzMDAwXCJ9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtpZDpcIjQwMDBcIixuYW1lOlwiNDAwMFwifSxcclxuLy8gICAgICAgICAgICAgICAgICAgICB7aWQ6XCI1MDAwXCIsbmFtZTpcIjUwMDBcIn0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge2lkOlwiMTAwMDBcIixuYW1lOlwiMTAwMDBcIn1cclxuLy8gICAgICAgICAgICAgICAgIF0sXHJcbi8vICAgICAgICAgICAgICAgICBqeWs6W1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtpZDpcIjEwMDBcIixuYW1lOlwiMTAwMFwifSxcclxuLy8gICAgICAgICAgICAgICAgICAgICB7aWQ6XCIyMDAwXCIsbmFtZTpcIjIwMDBcIn0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge2lkOlwiMzAwMFwiLG5hbWU6XCIzMDAwXCJ9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtpZDpcIjQwMDBcIixuYW1lOlwiNDAwMFwifSxcclxuLy8gICAgICAgICAgICAgICAgICAgICB7aWQ6XCI1MDAwXCIsbmFtZTpcIjUwMDBcIn0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge2lkOlwiNjAwMFwiLG5hbWU6XCI2MDAwXCJ9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtpZDpcIjcwMDBcIixuYW1lOlwiNzAwMFwifSxcclxuLy8gICAgICAgICAgICAgICAgICAgICB7aWQ6XCI4MDAwXCIsbmFtZTpcIjgwMDBcIn0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge2lkOlwiOTAwMFwiLG5hbWU6XCI5MDAwXCJ9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtpZDpcIjEwMDAwXCIsbmFtZTpcIjEwMDAwXCJ9LFxyXG4vLyAgICAgICAgICAgICAgICAgXSxcclxuLy8gICAgICAgICAgICAgICAgIHNlcnZpY2VfanlrOltcclxuLy8gICAgICAgICAgICAgICAgICAgICB7aWQ6XCI1MDBcIixuYW1lOlwiNTAwXCJ9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtpZDpcIjEwMDBcIixuYW1lOlwiMTAwMFwifSxcclxuLy8gICAgICAgICAgICAgICAgICAgICB7aWQ6XCIzMDAwXCIsbmFtZTpcIjMwMDBcIn0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge2lkOlwiNTAwMFwiLG5hbWU6XCI1MDAwXCJ9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtpZDpcIjEwMDAwXCIsbmFtZTpcIjEwMDAwXCJ9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtpZDpcIjIwMDAwXCIsbmFtZTpcIjIwMDAwXCJ9LFxyXG4vLyAgICAgICAgICAgICAgICAgXVxyXG4vLyAgICAgICAgICAgICB9LFxyXG4vLyAgICAgICAgICAgICBjdXJfcHJvZHVjdDpcInNlcnZpY2VfanlrXCIsXHJcbi8vICAgICAgICAgICAgIGN1cl9wcmljZTpcIjUwMFwiLFxyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH1cclxuLy9cclxuLy8gICAgIC8vIOmAieaLqeS6p+WTgVxyXG4vLyAgICAgb25TZWxlY3RQcm9kdWN0KCl7XHJcbi8vICAgICAgICAgbGV0IGN1cl9wcmljZSA9IHByb2R1Y3RfYWN0aXZlPT09XCJmZWVfc2xvd1wiP1wiMTAwXCI6XCIxMDAwXCI7XHJcbi8vICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cHJvZHVjdF9hY3RpdmUscHJpY2VfYWN0aXZlLG1vYmlsZTpcIlwifSlcclxuLy8gICAgIH1cclxuLy9cclxuLy8gICAgIC8vIOmAieaLqeS7t+agvFxyXG4vLyAgICAgb25TZWxlY3RQcmljZShjdXJfcHJpY2Upe1xyXG4vLyAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2N1cl9wcmljZX0pXHJcbi8vICAgICB9XHJcbi8vXHJcbi8vICAgICAvLyDlj5HpgIHlj7fnoIHlkozku7fmoLznlJ/miJDkuoznu7TnoIFcclxuLy8gICAgIHNlbmRQaG9uZVByaWNlKCl7XHJcbi8vICAgICAgICAgY29uc3Qge21vYmlsZSwgcHJvZHVjdF9hY3RpdmUscHJpY2VfYWN0aXZlfSA9IHRoaXMuc3RhdGU7XHJcbi8vICAgICAgICAgbGV0IFtwaG9uZSwgcHJvZHVjdCwgcHJpY2VdID0gW21vYmlsZSwgcHJvZHVjdF9hY3RpdmUscHJpY2VfYWN0aXZlXTtcclxuLy8gICAgICAgICBjb25zb2xlLmxvZyhwaG9uZSxcIiwgXCIscHJpY2UsXCIsIFwiLHByb2R1Y3QpO1xyXG4vLyAgICAgICAgIGlmKHBob25lID09PSAnJyl7XHJcbi8vICAgICAgICAgICAgIGFsZXJ0KCflj7fnoIHmoLzlvI/plJnor68s6K+36YeN5paw6L6T5YWlIScpO1xyXG4vLyAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbi8vICAgICAgICAgfVxyXG4vL1xyXG4vLyAgICAgICAgIGlmKHdpbmRvdy5jb25maXJtKFwi56Gu6K6k55Sf5oiQ5LqM57u056CB5ZCXP1wiKSl7XHJcbi8vICAgICAgICAgICAgIHRoaXMucHJvcHMuc2VuZFBob25lUHJpY2UocGhvbmUscHJpY2UscHJvZHVjdCk7XHJcbi8vICAgICAgICAgICAgICQoXCIjbW9kYWxcIikubW9kYWwoJ2hpZGUnKTtcclxuLy8gICAgICAgICB9ZWxzZXtcclxuLy8gICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfVxyXG4vL1xyXG4vLyAgICAgLy8g5YWz6ZetXHJcbi8vICAgICBvbkNhbmNlbCgpe1xyXG4vLyAgICAgICAgIHRoaXMuc2V0U3RhdGUoe21vYmlsZTpudWxsLHByb2R1Y3RfYWN0aXZlOlwiZmVlX3Nsb3dcIiwgcHJpY2VfYWN0aXZlOlwiMTAwXCIsfSk7XHJcbi8vICAgICAgICAgJCgnI21vZGFsJykubW9kYWwoXCJoaWRlXCIpO1xyXG4vLyAgICAgfVxyXG4vL1xyXG4vLyAgICAgLy8g5omL5py65Y+356CB6L6T5YWlXHJcbi8vICAgICBvbk1vYmlsZUNoYW5nZShlKXtcclxuLy8gICAgICAgICBjb25zb2xlLmxvZyhlLnRhcmdldC52YWx1ZSk7XHJcbi8vICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bW9iaWxlOiBlLnRhcmdldC52YWx1ZX0pXHJcbi8vICAgICB9XHJcbi8vXHJcbi8vICAgICBvblNlbGVjdFVzZWRNb2JpbGUobW9iaWxlKXtcclxuLy8gICAgICAgICB0aGlzLnNldFN0YXRlKHttb2JpbGV9KVxyXG4vLyAgICAgfVxyXG4vL1xyXG4vLyAgICAgLy8g6ZqP5py66L6T5YWl5omL5py65Y+3XHJcbi8vICAgICBnZXRSYW5kb21QaG9uZSgpIHtcclxuLy8gICAgICAgICBsZXQgbnVtQXJyYXkgPSBbXCIxMzlcIiwgXCIxMzhcIiwgXCIxMzdcIiwgXCIxMzZcIiwgXCIxMzVcIiwgXCIxMzRcIiwgXCIxNTlcIiwgXCIxNThcIiwgXCIxNTdcIiwgXCIxNTBcIiwgXCIxNTFcIiwgXCIxNTJcIiwgXCIxODhcIiwgXCIxODdcIiwgXCIxODJcIiwgXCIxODNcIiwgXCIxODRcIiwgXCIxNzhcIiwgXCIxMzBcIiwgXCIxMzFcIiwgXCIxMzJcIiwgXCIxNTZcIiwgXCIxNTVcIiwgXCIxODZcIiwgXCIxODVcIiwgXCIxNzZcIiwgXCIxMzNcIiwgXCIxNTNcIiwgXCIxODlcIiwgXCIxODBcIiwgXCIxODFcIiwgXCIxNzdcIl07XHJcbi8vICAgICAgICAgbGV0IGkgPSBwYXJzZUludCgxMCAqIE1hdGgucmFuZG9tKCkpO1xyXG4vLyAgICAgICAgIGxldCBtb2JpbGUgPSBudW1BcnJheVtpXTtcclxuLy8gICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDg7IGorKykge1xyXG4vLyAgICAgICAgICAgICBtb2JpbGUgPSBtb2JpbGUgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIHRoaXMuc2V0U3RhdGUoe21vYmlsZX0pXHJcbi8vICAgICB9XHJcbi8vXHJcbi8vICAgICByZW5kZXIoKSB7XHJcbi8vICAgICAgICAgY29uc3Qge2N1cl9kYXRhOntpbWFnZSxjcmVhdGVfdGltZX0sIHNob3dfdHlwZToge3RpdGxlLCBjb2RlfX0gPSB0aGlzLnByb3BzO1xyXG4vLyAgICAgICAgIGNvbnN0IHt1c2VkX21vYmlsZSwgcHJvZHVjdCwgcHJpY2UsIG1vYmlsZSwgcHJvZHVjdF9hY3RpdmUsIHByaWNlX2FjdGl2ZSxkZWZfaW1nfSA9IHRoaXMuc3RhdGU7XHJcbi8vICAgICAgICAgbGV0IFtzaG93Tm9kZXMsIG9rQnRuXSA9IFs8ZGl2IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+PGltZyBzcmM9e2ltYWdlID8gaW1hZ2UgOiBkZWZfaW1nfSBjbGFzc05hbWU9XCJpbWctdGh1bWJuYWlsXCIvPjxoNT57Y3JlYXRlX3RpbWV9PC9oNT48L2Rpdj4sIFwiXCIsXTtcclxuLy9cclxuLy8gICAgICAgICBsZXQgcHJvZHVjdEJ0biA9IHByb2R1Y3QubWFwKChkLCBpKSA9PiB7XHJcbi8vICAgICAgICAgICAgIGxldCBidG5fc3R5bGUgPSBwcm9kdWN0X2FjdGl2ZSA9PT0gZC5pZCA/IFwiYnRuLXByaW1hcnlcIiA6IFwiYnRuLWRlZmF1bHRcIjtcclxuLy8gICAgICAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTQgbWFyZ2luLWJvdHRvbTE1XCI+PGEga2V5PXtpfSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApO1wiIGNsYXNzTmFtZT17YGJ0biBidG4tYmxvY2sgJHtidG5fc3R5bGV9YH1cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub25TZWxlY3RQcm9kdWN0LmJpbmQodGhpcywgZC5pZCl9PntkLm5hbWV9PC9hPjwvZGl2PlxyXG4vLyAgICAgICAgIH0pO1xyXG4vL1xyXG4vLyAgICAgICAgIGxldCBwcmljZUJ0biA9IHByaWNlW3Byb2R1Y3RfYWN0aXZlXS5tYXAoKGQsIGkpID0+IHtcclxuLy8gICAgICAgICAgICAgbGV0IGJ0bl9zdHlsZSA9IHByaWNlX2FjdGl2ZSA9PT0gZC5pZCA/IFwiYnRuLXByaW1hcnlcIiA6IFwiYnRuLWRlZmF1bHRcIjtcclxuLy8gICAgICAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTMgbWFyZ2luLWJvdHRvbTE1XCI+PGEga2V5PXtpfSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApO1wiIGNsYXNzTmFtZT17YGJ0biBidG4tYmxvY2sgJHtidG5fc3R5bGV9YH1cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5vblNlbGVjdFByaWNlLmJpbmQodGhpcywgZC5pZCl9PntkLm5hbWV9PC9hPjwvZGl2PlxyXG4vLyAgICAgICAgIH0pO1xyXG4vL1xyXG4vLyAgICAgICAgIGxldCBpbnB1dE5vZGUgPSA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiB2YWx1ZT17bW9iaWxlfSBkZWZhdWx0VmFsdWU9e21vYmlsZX1cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLovpPlhaXlhYXlgLznmoTluJDlj7dcIiBvbkNoYW5nZT17dGhpcy5vbk1vYmlsZUNoYW5nZS5iaW5kKHRoaXMpfS8+O1xyXG4vLyAgICAgICAgIGlmKHByb2R1Y3RfYWN0aXZlID09PSAnZmVlX3Nsb3cnKXtcclxuLy8gICAgICAgICAgICAgbGV0IHVzZWRNb2JpbGVCdG4gPSB1c2VkX21vYmlsZS5tYXAoKGQsaSk9PntcclxuLy8gICAgICAgICAgICAgICAgIHJldHVybiA8bGkga2V5PXtpfT48YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApO1wiIG9uQ2xpY2s9e3RoaXMub25TZWxlY3RVc2VkTW9iaWxlLmJpbmQodGhpcyxkLmlkKX0+e2QubmFtZX08L2E+PC9saT5cclxuLy8gICAgICAgICAgICAgfSk7XHJcbi8vXHJcbi8vICAgICAgICAgICAgIGlucHV0Tm9kZSA9IDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXBcIj5cclxuLy8gICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAtYnRuXCI+XHJcbi8vICAgICAgICAgICAgICAgICAgICAgPGEgdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtY2FyZXQtZG93blwiLz5cclxuLy8gICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbi8vICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImRyb3Bkb3duLW1lbnUgZHJvcGRvd24tbWVudS1yaWdodFwiPlxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB7dXNlZE1vYmlsZUJ0bn1cclxuLy8gICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4vLyAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbi8vICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiB2YWx1ZT17bW9iaWxlfSBkZWZhdWx0VmFsdWU9e21vYmlsZX0gcGxhY2Vob2xkZXI9XCLovpPlhaXlhYXlgLznmoTluJDlj7dcIlxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm9uTW9iaWxlQ2hhbmdlLmJpbmQodGhpcyl9Lz5cclxuLy8gICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAtYnRuXCI+XHJcbi8vICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5nZXRSYW5kb21QaG9uZS5iaW5kKHRoaXMpfT7pmo/mnLo8L2J1dHRvbj5cclxuLy8gICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4vLyAgICAgICAgICAgICA8L2Rpdj47XHJcbi8vICAgICAgICAgfVxyXG4vL1xyXG4vLyAgICAgICAgIGlmIChjb2RlID09PSBcImNyZWF0ZU5ld1wiKSB7XHJcbi8vICAgICAgICAgICAgIHNob3dOb2RlcyA9IDxkaXYgY2xhc3NOYW1lPSdmb3JtLWdyb3VwJz5cclxuLy8gICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wtc20tNCBjb2wtbWQtMiBjb250cm9sLWxhYmVsXCI+5Lqn5ZOBPC9sYWJlbD5cclxuLy8gICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTggY29sLW1kLTEwIHJvd1wiPlxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtwcm9kdWN0QnRufVxyXG4vLyAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbi8vXHJcbi8vICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTQgY29sLW1kLTIgY29udHJvbC1sYWJlbFwiPuWFheWAvOW4kOWPtzwvbGFiZWw+XHJcbi8vICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS04IGNvbC1tZC0xMCBtYXJnaW4tYm90dG9tMTVcIj5cclxuLy8gICAgICAgICAgICAgICAgICAgICB7aW5wdXROb2RlfVxyXG4vLyAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbi8vXHJcbi8vICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTQgY29sLW1kLTIgY29udHJvbC1sYWJlbFwiPumdouWAvDwvbGFiZWw+XHJcbi8vICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS04IGNvbC1tZC0xMCByb3dcIj5cclxuLy8gICAgICAgICAgICAgICAgICAgICB7cHJpY2VCdG59XHJcbi8vICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuLy9cclxuLy8gICAgICAgICAgICAgPC9kaXY+O1xyXG4vLyAgICAgICAgICAgICBva0J0biA9IDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIG9uQ2xpY2s9e3RoaXMuc2VuZFBob25lUHJpY2UuYmluZCh0aGlzKX0+55Sf5oiQPC9hPjtcclxuLy8gICAgICAgICB9XHJcbi8vXHJcbi8vICAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdtb2RhbCBmYWRlJyBpZD0nbW9kYWwnIHRhYkluZGV4PSctMScgcm9sZT0nZGlhbG9nJyBhcmlhLWxhYmVsbGVkYnk9J2FkZE1vZGFsTGFiZWwnIGRhdGEtYmFja2Ryb3A9XCJzdGF0aWNcIj5cclxuLy8gICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21vZGFsLWRpYWxvZyc+XHJcbi8vICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbW9kYWwtY29udGVudCc+XHJcbi8vICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21vZGFsLWhlYWRlcic+XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9J21vZGFsLXRpdGxlJz57dGl0bGV9PC9oND5cclxuLy8gICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbW9kYWwtYm9keSBmb3JtLWhvcml6b250YWwnPlxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB7c2hvd05vZGVzfVxyXG4vLyAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4vL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtb2RhbC1mb290ZXInPlxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB7b2tCdG59XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT0nYnRuIGJ0bi1kZWZhdWx0JyBkYXRhLWRpc21pc3M9J21vZGFsJyBvbkNsaWNrPXt0aGlzLm9uQ2FuY2VsLmJpbmQodGhpcyl9PuWFs+mXrTwvYT5cclxuLy8gICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuLy8gICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4vLyAgICAgICAgICAgICA8L2Rpdj5cclxuLy8gICAgICAgICA8L2Rpdj5cclxuLy8gICAgIH1cclxuLy8gfVxyXG5cclxuUmVhY3RET00ucmVuZGVyKFxyXG4gICAgPE1haW5QYW5lbCAvPiAsXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1jb250ZW50JylcclxuKTsiXX0=
