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
            task: [],
            list: [{ id: "1", product: "jyk", price: "100", phone: "", interval: "600000", img: "", timestamp: "", status: false }, { id: "2", product: "phone", price: "1000", phone: "", interval: "600000", img: "", timestamp: "", status: false }]
        };
        return _this;
    }

    // 发送生成二维码请求


    _createClass(MainPanel, [{
        key: 'handleCreateCode',
        value: function handleCreateCode(data) {
            $.post('/api/qrcode/submit', JSON.stringify(data)).done(function (d) {
                var _JSON$parse = JSON.parse(d),
                    msg = _JSON$parse.msg,
                    img = _JSON$parse.img;

                if (msg === 'ok') {
                    // list[i].img = img;
                    data.status = true;
                    data.img = img;
                    return data;
                } else {
                    alert('加载二维码错误');
                }
            }).fail(function () {
                alert('加载二维码异常');
            });
        }

        // 获取配置

    }, {
        key: 'loadConfig',
        value: function loadConfig() {
            var _this2 = this;

            $.post('/api/qrcode/config').done(function (d) {
                var _JSON$parse2 = JSON.parse(d),
                    status = _JSON$parse2.status,
                    data = _JSON$parse2.data;

                if (status === "ok") {
                    _this2.setState({ list: data });
                } else {
                    alert('加载配置失败');
                }
            }).fail(function () {
                alert('加载配置异常');
            });
        }

        // 生成事件

    }, {
        key: 'onCreateCode',
        value: function onCreateCode(i) {
            var list = this.state.list;

            list[i].timestamp = new Date().getTime();
            var d = this.handleCreateCode(list[i]);
            this.setState({ list: d });
        }

        // 定时任务

    }, {
        key: 'onIntervalTask',
        value: function onIntervalTask(i) {
            var task = this.state.task;

            this.onCreateCode(i);
            task[i] = setInterval(this.onCreateCode.bind(this, i), 60000);
            this.setState({ start: true, task: task });
        }

        // 批量生成任务

    }, {
        key: 'onBatchTask',
        value: function onBatchTask() {
            var list = this.state.list;

            for (var i in list) {
                list[i].status = false;
                setTimeout(this.onIntervalTask.bind(this, i), 1000);
            }
            this.setState({ list: list });
        }

        // 停止刷新

    }, {
        key: 'onStopTask',
        value: function onStopTask(i) {
            var task = this.state.task;

            clearInterval(task[i]);
            this.setState({ task: task, start: false });
        }

        // 设置弹窗

    }, {
        key: 'onShowConfig',
        value: function onShowConfig(cur_tab) {
            this.setState({ cur_tab: cur_tab });
            this.onCreateCodeList();
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _state = this.state,
                list = _state.list,
                start = _state.start;

            var btnNode = !start ? _react2.default.createElement(
                'a',
                { className: 'btn btn-success btn-sm', href: 'javascript:void(0);', onClick: this.onBatchTask.bind(this) },
                _react2.default.createElement('i', { className: 'fa fa-play' }),
                ' \u5F00\u59CB'
            ) : _react2.default.createElement(
                'a',
                { className: 'btn btn-danger btn-sm', href: 'javascript:void(0);', onClick: this.onStopTask.bind(this) },
                _react2.default.createElement('i', { className: 'fa fa-stop' }),
                ' \u7ED3\u675F'
            );

            // let startNodes = start ? "disabled":"";
            var codeNodes = list.map(function (d, i) {
                return _react2.default.createElement(QRcodePanel, { key: i, data: d, onCreateCode: _this3.onCreateCode.bind(_this3), index: i });
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
                                        { href: 'javascript:void(0);', className: 'btn btn-primary btn-sm', onClick: this.onShowConfig.bind(this) },
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
                    _react2.default.createElement(
                        'div',
                        { className: 'col-lg-12 row' },
                        codeNodes
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

        var _this4 = _possibleConstructorReturn(this, (QRcodePanel.__proto__ || Object.getPrototypeOf(QRcodePanel)).call(this, props));

        _this4.state = {
            qrcode: "/img/fail.png",
            data: _this4.props.data,
            index: _this4.props.index
        };
        return _this4;
    }

    _createClass(QRcodePanel, [{
        key: 'onCreateCode',
        value: function onCreateCode(i) {
            this.props.onCreateCode(i);
        }
    }, {
        key: 'render',
        value: function render() {
            var _state2 = this.state,
                qrcode = _state2.qrcode,
                index = _state2.index,
                _state2$data = _state2.data,
                product = _state2$data.product,
                price = _state2$data.price,
                img = _state2$data.img,
                timestamp = _state2$data.timestamp,
                status = _state2$data.status;

            var btnNode = status ? "" : "disabled";
            return _react2.default.createElement(
                'div',
                { className: 'col-xs-4 col-sm-2 col-lg-1 code-box' },
                _react2.default.createElement(
                    'div',
                    { className: 'panel row' },
                    _react2.default.createElement(
                        'header',
                        { className: 'panel-heading row' },
                        _react2.default.createElement(
                            'span',
                            { className: 'pull-left' },
                            product
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzeFxcaGJfcXJjb2RlXFxiYXRjaC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQ0E7Ozs7QUFDQTs7Ozs7Ozs7OzsrZUFGQTs7O0lBSU0sUzs7O0FBQ0YseUJBQWM7QUFBQTs7QUFBQTs7QUFFVixjQUFLLEtBQUwsR0FBWTtBQUNSLG1CQUFNLEtBREU7QUFFUixrQkFBSyxFQUZHO0FBR1Isa0JBQUssQ0FDRCxFQUFDLElBQUcsR0FBSixFQUFRLFNBQVEsS0FBaEIsRUFBc0IsT0FBTSxLQUE1QixFQUFrQyxPQUFNLEVBQXhDLEVBQTJDLFVBQVMsUUFBcEQsRUFBNkQsS0FBSSxFQUFqRSxFQUFvRSxXQUFVLEVBQTlFLEVBQWlGLFFBQU8sS0FBeEYsRUFEQyxFQUVELEVBQUMsSUFBRyxHQUFKLEVBQVEsU0FBUSxPQUFoQixFQUF3QixPQUFNLE1BQTlCLEVBQXFDLE9BQU0sRUFBM0MsRUFBOEMsVUFBUyxRQUF2RCxFQUFnRSxLQUFJLEVBQXBFLEVBQXVFLFdBQVUsRUFBakYsRUFBb0YsUUFBTyxLQUEzRixFQUZDO0FBSEcsU0FBWjtBQUZVO0FBNEJiOztBQUVEOzs7Ozt5Q0FDaUIsSSxFQUFLO0FBQ2xCLGNBQUUsSUFBRixDQUFPLG9CQUFQLEVBQTRCLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBNUIsRUFDSyxJQURMLENBQ1UsVUFBQyxDQUFELEVBQU87QUFBQSxrQ0FDVSxLQUFLLEtBQUwsQ0FBVyxDQUFYLENBRFY7QUFBQSxvQkFDRixHQURFLGVBQ0YsR0FERTtBQUFBLG9CQUNHLEdBREgsZUFDRyxHQURIOztBQUVULG9CQUFHLFFBQVEsSUFBWCxFQUFnQjtBQUNaO0FBQ0EseUJBQUssTUFBTCxHQUFjLElBQWQ7QUFDQSx5QkFBSyxHQUFMLEdBQVcsR0FBWDtBQUNBLDJCQUFPLElBQVA7QUFDSCxpQkFMRCxNQUtLO0FBQ0QsMEJBQU0sU0FBTjtBQUNIO0FBQ0osYUFYTCxFQVlLLElBWkwsQ0FZVSxZQUFNO0FBQ1Isc0JBQU0sU0FBTjtBQUNILGFBZEw7QUFlSDs7QUFFRDs7OztxQ0FDWTtBQUFBOztBQUNSLGNBQUUsSUFBRixDQUFPLG9CQUFQLEVBQ0ssSUFETCxDQUNVLFVBQUMsQ0FBRCxFQUFLO0FBQUEsbUNBQ2EsS0FBSyxLQUFMLENBQVcsQ0FBWCxDQURiO0FBQUEsb0JBQ0YsTUFERSxnQkFDRixNQURFO0FBQUEsb0JBQ0ssSUFETCxnQkFDSyxJQURMOztBQUVQLG9CQUFHLFdBQVcsSUFBZCxFQUFtQjtBQUNmLDJCQUFLLFFBQUwsQ0FBYyxFQUFDLE1BQUssSUFBTixFQUFkO0FBQ0gsaUJBRkQsTUFFSztBQUNELDBCQUFNLFFBQU47QUFDSDtBQUNKLGFBUkwsRUFTSyxJQVRMLENBU1UsWUFBSTtBQUNOLHNCQUFNLFFBQU47QUFDSCxhQVhMO0FBWUg7O0FBRUQ7Ozs7cUNBQ2EsQyxFQUFFO0FBQUEsZ0JBQ04sSUFETSxHQUNFLEtBQUssS0FEUCxDQUNOLElBRE07O0FBRVgsaUJBQUssQ0FBTCxFQUFRLFNBQVIsR0FBb0IsSUFBSSxJQUFKLEdBQVcsT0FBWCxFQUFwQjtBQUNBLGdCQUFJLElBQUksS0FBSyxnQkFBTCxDQUFzQixLQUFLLENBQUwsQ0FBdEIsQ0FBUjtBQUNBLGlCQUFLLFFBQUwsQ0FBYyxFQUFDLE1BQUssQ0FBTixFQUFkO0FBQ0g7O0FBRUQ7Ozs7dUNBQ2UsQyxFQUFFO0FBQUEsZ0JBQ1IsSUFEUSxHQUNBLEtBQUssS0FETCxDQUNSLElBRFE7O0FBRWIsaUJBQUssWUFBTCxDQUFrQixDQUFsQjtBQUNBLGlCQUFLLENBQUwsSUFBVSxZQUFZLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixFQUE0QixDQUE1QixDQUFaLEVBQTJDLEtBQTNDLENBQVY7QUFDQSxpQkFBSyxRQUFMLENBQWMsRUFBQyxPQUFNLElBQVAsRUFBWSxVQUFaLEVBQWQ7QUFDSDs7QUFFRDs7OztzQ0FDYTtBQUFBLGdCQUNKLElBREksR0FDSSxLQUFLLEtBRFQsQ0FDSixJQURJOztBQUVULGlCQUFJLElBQUksQ0FBUixJQUFhLElBQWIsRUFBa0I7QUFDZCxxQkFBSyxDQUFMLEVBQVEsTUFBUixHQUFpQixLQUFqQjtBQUNBLDJCQUFXLEtBQUssY0FBTCxDQUFvQixJQUFwQixDQUF5QixJQUF6QixFQUE4QixDQUE5QixDQUFYLEVBQTRDLElBQTVDO0FBQ0g7QUFDRCxpQkFBSyxRQUFMLENBQWMsRUFBQyxVQUFELEVBQWQ7QUFDSDs7QUFFRDs7OzttQ0FDVyxDLEVBQUU7QUFBQSxnQkFDSixJQURJLEdBQ0ksS0FBSyxLQURULENBQ0osSUFESTs7QUFFVCwwQkFBYyxLQUFLLENBQUwsQ0FBZDtBQUNBLGlCQUFLLFFBQUwsQ0FBYyxFQUFDLFVBQUQsRUFBTSxPQUFNLEtBQVosRUFBZDtBQUNIOztBQUVEOzs7O3FDQUNhLE8sRUFBUTtBQUNqQixpQkFBSyxRQUFMLENBQWMsRUFBQyxnQkFBRCxFQUFkO0FBQ0EsaUJBQUssZ0JBQUw7QUFDSDs7O2lDQUVPO0FBQUE7O0FBQUEseUJBQ2lCLEtBQUssS0FEdEI7QUFBQSxnQkFDRyxJQURILFVBQ0csSUFESDtBQUFBLGdCQUNRLEtBRFIsVUFDUSxLQURSOztBQUVKLGdCQUFJLFVBQVUsQ0FBQyxLQUFELEdBQVM7QUFBQTtBQUFBLGtCQUFHLFdBQVUsd0JBQWIsRUFBc0MsTUFBSyxxQkFBM0MsRUFBaUUsU0FBUyxLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBMUU7QUFDbkIscURBQUcsV0FBVSxZQUFiLEdBRG1CO0FBQUE7QUFBQSxhQUFULEdBRVA7QUFBQTtBQUFBLGtCQUFHLFdBQVUsdUJBQWIsRUFBcUMsTUFBSyxxQkFBMUMsRUFBZ0UsU0FBUyxLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBekU7QUFDSCxxREFBRyxXQUFVLFlBQWIsR0FERztBQUFBO0FBQUEsYUFGUDs7QUFNQTtBQUNBLGdCQUFJLFlBQVksS0FBSyxHQUFMLENBQVMsVUFBQyxDQUFELEVBQUcsQ0FBSCxFQUFRO0FBQzdCLHVCQUFPLDhCQUFDLFdBQUQsSUFBYSxLQUFLLENBQWxCLEVBQXFCLE1BQU0sQ0FBM0IsRUFBOEIsY0FBYyxPQUFLLFlBQUwsQ0FBa0IsSUFBbEIsUUFBNUMsRUFBMEUsT0FBTyxDQUFqRixHQUFQO0FBQ0gsYUFGZSxDQUFoQjtBQUdBLG1CQUFPO0FBQUE7QUFBQSxrQkFBUyxXQUFVLFNBQW5CO0FBQ0g7QUFBQTtBQUFBLHNCQUFLLFdBQVUsS0FBZjtBQUNJO0FBQUE7QUFBQSwwQkFBSyxXQUFVLFdBQWY7QUFDSTtBQUFBO0FBQUEsOEJBQVMsV0FBVSxXQUFuQjtBQUNJO0FBQUE7QUFBQSxrQ0FBSyxXQUFVLFlBQWY7QUFDSTtBQUFBO0FBQUEsc0NBQU0sV0FBVSwyQkFBaEIsRUFBNEMsT0FBTyxFQUFDLGNBQWEsTUFBZCxFQUFuRDtBQUNLLDJDQURMO0FBR0k7QUFBQTtBQUFBLDBDQUFHLE1BQUsscUJBQVIsRUFBOEIsV0FBVSx3QkFBeEMsRUFBaUUsU0FBUyxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBMUU7QUFBd0csNkVBQUcsV0FBVSxpQkFBYjtBQUF4RztBQUhKO0FBREo7QUFESjtBQURKO0FBREosaUJBREc7QUFjSDtBQUFBO0FBQUEsc0JBQUssV0FBVSxLQUFmO0FBQ0k7QUFBQTtBQUFBLDBCQUFLLFdBQVUsZUFBZjtBQUNDO0FBREQ7QUFESjtBQWRHLGFBQVA7QUFxQkg7Ozs7RUExSW1CLGdCQUFNLFM7O0lBNkl4QixXOzs7QUFDRix5QkFBWSxLQUFaLEVBQWtCO0FBQUE7O0FBQUEsK0hBQ1IsS0FEUTs7QUFFZCxlQUFLLEtBQUwsR0FBVztBQUNQLG9CQUFPLGVBREE7QUFFUCxrQkFBTSxPQUFLLEtBQUwsQ0FBVyxJQUZWO0FBR1AsbUJBQU0sT0FBSyxLQUFMLENBQVc7QUFIVixTQUFYO0FBRmM7QUFPakI7Ozs7cUNBRVksQyxFQUFFO0FBQ1gsaUJBQUssS0FBTCxDQUFXLFlBQVgsQ0FBd0IsQ0FBeEI7QUFDSDs7O2lDQUVPO0FBQUEsMEJBQytELEtBQUssS0FEcEU7QUFBQSxnQkFDRyxNQURILFdBQ0csTUFESDtBQUFBLGdCQUNVLEtBRFYsV0FDVSxLQURWO0FBQUEsdUNBQ2dCLElBRGhCO0FBQUEsZ0JBQ3NCLE9BRHRCLGdCQUNzQixPQUR0QjtBQUFBLGdCQUMrQixLQUQvQixnQkFDK0IsS0FEL0I7QUFBQSxnQkFDc0MsR0FEdEMsZ0JBQ3NDLEdBRHRDO0FBQUEsZ0JBQzJDLFNBRDNDLGdCQUMyQyxTQUQzQztBQUFBLGdCQUNzRCxNQUR0RCxnQkFDc0QsTUFEdEQ7O0FBRUosZ0JBQUksVUFBVSxTQUFTLEVBQVQsR0FBYyxVQUE1QjtBQUNBLG1CQUFPO0FBQUE7QUFBQSxrQkFBSyxXQUFVLHFDQUFmO0FBQ0g7QUFBQTtBQUFBLHNCQUFLLFdBQVUsV0FBZjtBQUNJO0FBQUE7QUFBQSwwQkFBUSxXQUFVLG1CQUFsQjtBQUNJO0FBQUE7QUFBQSw4QkFBTSxXQUFVLFdBQWhCO0FBQTZCO0FBQTdCLHlCQURKO0FBRUk7QUFBQTtBQUFBLDhCQUFNLFdBQVUsd0JBQWhCO0FBQXlDO0FBQUE7QUFBQTtBQUFTO0FBQVQ7QUFBekM7QUFGSixxQkFESjtBQUtJO0FBQUE7QUFBQSwwQkFBSyxXQUFVLDRCQUFmO0FBQ0k7QUFBQTtBQUFBLDhCQUFLLFdBQVUsd0JBQWY7QUFDSSxtRUFBSyxLQUFLLE1BQU0sR0FBTixHQUFZLE1BQXRCLEVBQThCLFdBQVUsZUFBeEM7QUFESix5QkFESjtBQUlJO0FBQUE7QUFBQSw4QkFBSyxXQUFVLFlBQWY7QUFDSTtBQUFBO0FBQUEsa0NBQU8sV0FBVSxlQUFqQjtBQUFrQztBQUFsQyw2QkFESjtBQUVJO0FBQUE7QUFBQSxrQ0FBSyxXQUFVLDRCQUFmO0FBQ0kseUVBQU8sV0FBVSxjQUFqQixFQUFnQyxNQUFLLE1BQXJDLEVBQTRDLFVBQVMsTUFBckQsR0FESjtBQUVJO0FBQUE7QUFBQSxzQ0FBSyxXQUFVLGlCQUFmO0FBQ0k7QUFBQTtBQUFBLDBDQUFHLGdDQUE4QixPQUFqQyxFQUE0QyxTQUFTLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixFQUE0QixLQUE1QixDQUFyRDtBQUFBO0FBQUE7QUFESjtBQUZKO0FBRko7QUFKSjtBQUxKO0FBREcsYUFBUDtBQXNCSDs7OztFQXZDcUIsZ0JBQU0sUzs7QUEwQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBUyxNQUFULENBQ0ksOEJBQUMsU0FBRCxPQURKLEVBRUksU0FBUyxjQUFULENBQXdCLGNBQXhCLENBRkoiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogd2VhaHd3dyBjcmVhdGUgKi9cclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XHJcblxyXG5jbGFzcyBNYWluUGFuZWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnR7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPXtcclxuICAgICAgICAgICAgc3RhcnQ6ZmFsc2UsXHJcbiAgICAgICAgICAgIHRhc2s6W10sXHJcbiAgICAgICAgICAgIGxpc3Q6W1xyXG4gICAgICAgICAgICAgICAge2lkOlwiMVwiLHByb2R1Y3Q6XCJqeWtcIixwcmljZTpcIjEwMFwiLHBob25lOlwiXCIsaW50ZXJ2YWw6XCI2MDAwMDBcIixpbWc6XCJcIix0aW1lc3RhbXA6XCJcIixzdGF0dXM6ZmFsc2V9LFxyXG4gICAgICAgICAgICAgICAge2lkOlwiMlwiLHByb2R1Y3Q6XCJwaG9uZVwiLHByaWNlOlwiMTAwMFwiLHBob25lOlwiXCIsaW50ZXJ2YWw6XCI2MDAwMDBcIixpbWc6XCJcIix0aW1lc3RhbXA6XCJcIixzdGF0dXM6ZmFsc2V9LFxyXG4gICAgICAgICAgICAgICAgLy8ge2lkOlwiM1wiLHByb2R1Y3Q6XCJcIixwcmljZTpcIlwiLHBob25lOlwiXCIsaW50ZXJ2YWw6XCI2MDAwMDBcIixpbWc6XCJcIix0aW1lc3RhbXA6XCJcIixzdGF0dXM6ZmFsc2V9LFxyXG4gICAgICAgICAgICAgICAgLy8ge2lkOlwiNFwiLHByb2R1Y3Q6XCJcIixwcmljZTpcIlwiLHBob25lOlwiXCIsaW50ZXJ2YWw6XCI2MDAwMDBcIixpbWc6XCJcIix0aW1lc3RhbXA6XCJcIixzdGF0dXM6ZmFsc2V9LFxyXG4gICAgICAgICAgICAgICAgLy8ge2lkOlwiNVwiLHByb2R1Y3Q6XCJcIixwcmljZTpcIlwiLHBob25lOlwiXCIsaW50ZXJ2YWw6XCI2MDAwMDBcIixpbWc6XCJcIix0aW1lc3RhbXA6XCJcIixzdGF0dXM6ZmFsc2V9LFxyXG4gICAgICAgICAgICAgICAgLy8ge2lkOlwiNlwiLHByb2R1Y3Q6XCJcIixwcmljZTpcIlwiLHBob25lOlwiXCIsaW50ZXJ2YWw6XCI2MDAwMDBcIixpbWc6XCJcIix0aW1lc3RhbXA6XCJcIixzdGF0dXM6ZmFsc2V9LFxyXG4gICAgICAgICAgICAgICAgLy8ge2lkOlwiN1wiLHByb2R1Y3Q6XCJcIixwcmljZTpcIlwiLHBob25lOlwiXCIsaW50ZXJ2YWw6XCI2MDAwMDBcIixpbWc6XCJcIix0aW1lc3RhbXA6XCJcIixzdGF0dXM6ZmFsc2V9LFxyXG4gICAgICAgICAgICAgICAgLy8ge2lkOlwiOFwiLHByb2R1Y3Q6XCJcIixwcmljZTpcIlwiLHBob25lOlwiXCIsaW50ZXJ2YWw6XCI2MDAwMDBcIixpbWc6XCJcIix0aW1lc3RhbXA6XCJcIixzdGF0dXM6ZmFsc2V9LFxyXG4gICAgICAgICAgICAgICAgLy8ge2lkOlwiOVwiLHByb2R1Y3Q6XCJcIixwcmljZTpcIlwiLHBob25lOlwiXCIsaW50ZXJ2YWw6XCI2MDAwMDBcIixpbWc6XCJcIix0aW1lc3RhbXA6XCJcIixzdGF0dXM6ZmFsc2V9LFxyXG4gICAgICAgICAgICAgICAgLy8ge2lkOlwiMTBcIixwcm9kdWN0OlwiXCIscHJpY2U6XCJcIixwaG9uZTpcIlwiLGludGVydmFsOlwiNjAwMDAwXCIsaW1nOlwiXCIsdGltZXN0YW1wOlwiXCIsc3RhdHVzOmZhbHNlfSxcclxuICAgICAgICAgICAgICAgIC8vIHtpZDpcIjExXCIscHJvZHVjdDpcIlwiLHByaWNlOlwiXCIscGhvbmU6XCJcIixpbnRlcnZhbDpcIjYwMDAwMFwiLGltZzpcIlwiLHRpbWVzdGFtcDpcIlwiLHN0YXR1czpmYWxzZX0sXHJcbiAgICAgICAgICAgICAgICAvLyB7aWQ6XCIxMlwiLHByb2R1Y3Q6XCJcIixwcmljZTpcIlwiLHBob25lOlwiXCIsaW50ZXJ2YWw6XCI2MDAwMDBcIixpbWc6XCJcIix0aW1lc3RhbXA6XCJcIixzdGF0dXM6ZmFsc2V9LFxyXG4gICAgICAgICAgICAgICAgLy8ge2lkOlwiMTNcIixwcm9kdWN0OlwiXCIscHJpY2U6XCJcIixwaG9uZTpcIlwiLGludGVydmFsOlwiNjAwMDAwXCIsaW1nOlwiXCIsdGltZXN0YW1wOlwiXCIsc3RhdHVzOmZhbHNlfSxcclxuICAgICAgICAgICAgICAgIC8vIHtpZDpcIjE0XCIscHJvZHVjdDpcIlwiLHByaWNlOlwiXCIscGhvbmU6XCJcIixpbnRlcnZhbDpcIjYwMDAwMFwiLGltZzpcIlwiLHRpbWVzdGFtcDpcIlwiLHN0YXR1czpmYWxzZX0sXHJcbiAgICAgICAgICAgICAgICAvLyB7aWQ6XCIxNVwiLHByb2R1Y3Q6XCJcIixwcmljZTpcIlwiLHBob25lOlwiXCIsaW50ZXJ2YWw6XCI2MDAwMDBcIixpbWc6XCJcIix0aW1lc3RhbXA6XCJcIixzdGF0dXM6ZmFsc2V9LFxyXG4gICAgICAgICAgICAgICAgLy8ge2lkOlwiMTZcIixwcm9kdWN0OlwiXCIscHJpY2U6XCJcIixwaG9uZTpcIlwiLGludGVydmFsOlwiNjAwMDAwXCIsaW1nOlwiXCIsdGltZXN0YW1wOlwiXCIsc3RhdHVzOmZhbHNlfSxcclxuICAgICAgICAgICAgICAgIC8vIHtpZDpcIjE3XCIscHJvZHVjdDpcIlwiLHByaWNlOlwiXCIscGhvbmU6XCJcIixpbnRlcnZhbDpcIjYwMDAwMFwiLGltZzpcIlwiLHRpbWVzdGFtcDpcIlwiLHN0YXR1czpmYWxzZX0sXHJcbiAgICAgICAgICAgICAgICAvLyB7aWQ6XCIxOFwiLHByb2R1Y3Q6XCJcIixwcmljZTpcIlwiLHBob25lOlwiXCIsaW50ZXJ2YWw6XCI2MDAwMDBcIixpbWc6XCJcIix0aW1lc3RhbXA6XCJcIixzdGF0dXM6ZmFsc2V9LFxyXG4gICAgICAgICAgICAgICAgLy8ge2lkOlwiMTlcIixwcm9kdWN0OlwiXCIscHJpY2U6XCJcIixwaG9uZTpcIlwiLGludGVydmFsOlwiNjAwMDAwXCIsaW1nOlwiXCIsdGltZXN0YW1wOlwiXCIsc3RhdHVzOmZhbHNlfSxcclxuICAgICAgICAgICAgICAgIC8vIHtpZDpcIjIwXCIscHJvZHVjdDpcIlwiLHByaWNlOlwiXCIscGhvbmU6XCJcIixpbnRlcnZhbDpcIjYwMDAwMFwiLGltZzpcIlwiLHRpbWVzdGFtcDpcIlwiLHN0YXR1czpmYWxzZX0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5Y+R6YCB55Sf5oiQ5LqM57u056CB6K+35rGCXHJcbiAgICBoYW5kbGVDcmVhdGVDb2RlKGRhdGEpe1xyXG4gICAgICAgICQucG9zdCgnL2FwaS9xcmNvZGUvc3VibWl0JyxKU09OLnN0cmluZ2lmeShkYXRhKSlcclxuICAgICAgICAgICAgLmRvbmUoKGQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHttc2csIGltZ30gPSBKU09OLnBhcnNlKGQpO1xyXG4gICAgICAgICAgICAgICAgaWYobXNnID09PSAnb2snKXtcclxuICAgICAgICAgICAgICAgICAgICAvLyBsaXN0W2ldLmltZyA9IGltZztcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnN0YXR1cyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5pbWcgPSBpbWc7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCfliqDovb3kuoznu7TnoIHplJnor68nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZhaWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ+WKoOi9veS6jOe7tOeggeW8guW4uCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDojrflj5bphY3nva5cclxuICAgIGxvYWRDb25maWcoKXtcclxuICAgICAgICAkLnBvc3QoJy9hcGkvcXJjb2RlL2NvbmZpZycpXHJcbiAgICAgICAgICAgIC5kb25lKChkKT0+e1xyXG4gICAgICAgICAgICAgICAgbGV0IHtzdGF0dXMsZGF0YX0gPSBKU09OLnBhcnNlKGQpO1xyXG4gICAgICAgICAgICAgICAgaWYoc3RhdHVzID09PSBcIm9rXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2xpc3Q6ZGF0YX0pXHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgn5Yqg6L296YWN572u5aSx6LSlJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZhaWwoKCk9PntcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCfliqDovb3phY3nva7lvILluLgnKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOeUn+aIkOS6i+S7tlxyXG4gICAgb25DcmVhdGVDb2RlKGkpe1xyXG4gICAgICAgIGxldCB7bGlzdH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGxpc3RbaV0udGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgbGV0IGQgPSB0aGlzLmhhbmRsZUNyZWF0ZUNvZGUobGlzdFtpXSk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bGlzdDpkfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5a6a5pe25Lu75YqhXHJcbiAgICBvbkludGVydmFsVGFzayhpKXtcclxuICAgICAgICBsZXQge3Rhc2t9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICB0aGlzLm9uQ3JlYXRlQ29kZShpKTtcclxuICAgICAgICB0YXNrW2ldID0gc2V0SW50ZXJ2YWwodGhpcy5vbkNyZWF0ZUNvZGUuYmluZCh0aGlzLGkpLDYwMDAwKTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtzdGFydDp0cnVlLHRhc2t9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDmibnph4/nlJ/miJDku7vliqFcclxuICAgIG9uQmF0Y2hUYXNrKCl7XHJcbiAgICAgICAgbGV0IHtsaXN0fSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgZm9yKGxldCBpIGluIGxpc3Qpe1xyXG4gICAgICAgICAgICBsaXN0W2ldLnN0YXR1cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMub25JbnRlcnZhbFRhc2suYmluZCh0aGlzLGkpLDEwMDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtsaXN0fSlcclxuICAgIH1cclxuXHJcbiAgICAvLyDlgZzmraLliLfmlrBcclxuICAgIG9uU3RvcFRhc2soaSl7XHJcbiAgICAgICAgbGV0IHt0YXNrfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0YXNrW2ldKTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHt0YXNrLHN0YXJ0OmZhbHNlfSlcclxuICAgIH1cclxuXHJcbiAgICAvLyDorr7nva7lvLnnqpdcclxuICAgIG9uU2hvd0NvbmZpZyhjdXJfdGFiKXtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtjdXJfdGFifSk7XHJcbiAgICAgICAgdGhpcy5vbkNyZWF0ZUNvZGVMaXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCl7XHJcbiAgICAgICAgY29uc3Qge2xpc3Qsc3RhcnR9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICBsZXQgYnRuTm9kZSA9ICFzdGFydCA/IDxhIGNsYXNzTmFtZT1cImJ0biBidG4tc3VjY2VzcyBidG4tc21cIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApO1wiIG9uQ2xpY2s9e3RoaXMub25CYXRjaFRhc2suYmluZCh0aGlzKX0+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLXBsYXlcIi8+IOW8gOWni1xyXG4gICAgICAgIDwvYT4gOiA8YSBjbGFzc05hbWU9XCJidG4gYnRuLWRhbmdlciBidG4tc21cIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApO1wiIG9uQ2xpY2s9e3RoaXMub25TdG9wVGFzay5iaW5kKHRoaXMpfT5cclxuICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtc3RvcFwiLz4g57uT5p2fXHJcbiAgICAgICAgPC9hPjtcclxuXHJcbiAgICAgICAgLy8gbGV0IHN0YXJ0Tm9kZXMgPSBzdGFydCA/IFwiZGlzYWJsZWRcIjpcIlwiO1xyXG4gICAgICAgIGxldCBjb2RlTm9kZXMgPSBsaXN0Lm1hcCgoZCxpKSA9PntcclxuICAgICAgICAgICAgcmV0dXJuIDxRUmNvZGVQYW5lbCBrZXk9e2l9IGRhdGE9e2R9IG9uQ3JlYXRlQ29kZT17dGhpcy5vbkNyZWF0ZUNvZGUuYmluZCh0aGlzKX0gaW5kZXg9e2l9Lz5cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gPHNlY3Rpb24gY2xhc3NOYW1lPVwid3JhcHBlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctMTJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJwYW5lbCByb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0IG1hcmdpbi1yaWdodDEwXCIgc3R5bGU9e3ttYXJnaW5Cb3R0b206XCItNXB4XCJ9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7YnRuTm9kZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Lyo8YSBjbGFzc05hbWU9e2BidG4gYnRuLXN1Y2Nlc3MgYnRuLXNtICR7c3RhcnROb2Rlc31gfSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApO1wiIG9uQ2xpY2s9e3RoaXMub25TdGFydFRhc2suYmluZCh0aGlzKX0+PGkgY2xhc3NOYW1lPVwiZmEgZmEtcGxheVwiLz4g5byA5aeLPC9hPiovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMCk7XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbVwiIG9uQ2xpY2s9e3RoaXMub25TaG93Q29uZmlnLmJpbmQodGhpcyl9PjxpIGNsYXNzTmFtZT1cImZhIGZhLWNvZyBmYS1sZ1wiLz48L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTEyIHJvd1wiPlxyXG4gICAgICAgICAgICAgICAge2NvZGVOb2Rlc31cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgey8qPE1vZGFsUGFuZWwgbGlzdD17bGlzdH0gb25TZXRDb25maWc9e3RoaXMub25TZXRDb25maWcuYmluZCh0aGlzKX0vPiovfVxyXG4gICAgICAgIDwvc2VjdGlvbj5cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUVJjb2RlUGFuZWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnR7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcyl7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGU9e1xyXG4gICAgICAgICAgICBxcmNvZGU6XCIvaW1nL2ZhaWwucG5nXCIsXHJcbiAgICAgICAgICAgIGRhdGE6IHRoaXMucHJvcHMuZGF0YSxcclxuICAgICAgICAgICAgaW5kZXg6dGhpcy5wcm9wcy5pbmRleCxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIG9uQ3JlYXRlQ29kZShpKXtcclxuICAgICAgICB0aGlzLnByb3BzLm9uQ3JlYXRlQ29kZShpKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICBjb25zdCB7cXJjb2RlLGluZGV4LGRhdGE6e3Byb2R1Y3QsIHByaWNlLCBpbWcsIHRpbWVzdGFtcCwgc3RhdHVzfX09dGhpcy5zdGF0ZTtcclxuICAgICAgICBsZXQgYnRuTm9kZSA9IHN0YXR1cyA/IFwiXCIgOiBcImRpc2FibGVkXCI7XHJcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTQgY29sLXNtLTIgY29sLWxnLTEgY29kZS1ib3hcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbCByb3dcIj5cclxuICAgICAgICAgICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwicGFuZWwtaGVhZGluZyByb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwdWxsLWxlZnRcIj57cHJvZHVjdH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicHVsbC1yaWdodCB0ZXh0LWRhbmdlclwiPjxzdHJvbmc+e3ByaWNlfTwvc3Ryb25nPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvaGVhZGVyPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1ib2R5IGZvcm0taG9yaXpvbnRhbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cCB0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17aW1nID8gaW1nIDogcXJjb2RlfSBjbGFzc05hbWU9XCJpbWctdGh1bWJuYWlsXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29udHJvbC1sYWJlbFwiPnt0aW1lc3RhbXB9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1ncm91cCBpbnB1dC1ncm91cC1zbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJ0ZXh0XCIgZGlzYWJsZWQ9XCJ0cnVlXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1ncm91cC1idG5cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9e2BidG4gYnRuLXByaW1hcnkgJHtidG5Ob2RlfWB9IG9uQ2xpY2s9e3RoaXMub25DcmVhdGVDb2RlLmJpbmQodGhpcyxpbmRleCl9PueUn+aIkDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIH1cclxufVxyXG5cclxuLy8gY2xhc3MgTW9kYWxQYW5lbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudHtcclxuLy8gICAgIGNvbnN0cnVjdG9yKHByb3BzKXtcclxuLy8gICAgICAgICBzdXBlcihwcm9wcyk7XHJcbi8vICAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuLy8gICAgICAgICAgICAgcHJvZHVjdDpbXHJcbi8vICAgICAgICAgICAgICAgICB7aWQ6XCJmZWVfc2xvd1wiLG5hbWU6XCLlhajlm73or53otLnmhaLlhYVcIn0sXHJcbi8vICAgICAgICAgICAgICAgICB7aWQ6XCJqeWtcIixuYW1lOlwi5Yqg5rK55Y2hXCJ9LFxyXG4vLyAgICAgICAgICAgICAgICAge2lkOlwic2VydmljZV9qeWtcIixuYW1lOlwi5a6i5pyN5Yqg5rK55Y2hXCJ9LFxyXG4vLyAgICAgICAgICAgICBdLFxyXG4vLyAgICAgICAgICAgICBwcmljZTp7XHJcbi8vICAgICAgICAgICAgICAgICBmZWVfc2xvdzpbXHJcbi8vICAgICAgICAgICAgICAgICAgICAge2lkOlwiMTAwXCIsbmFtZTpcIjEwMFwifSxcclxuLy8gICAgICAgICAgICAgICAgICAgICB7aWQ6XCIyMDBcIixuYW1lOlwiMjAwXCJ9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtpZDpcIjMwMFwiLG5hbWU6XCIzMDBcIn0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge2lkOlwiNTAwXCIsbmFtZTpcIjUwMFwifSxcclxuLy8gICAgICAgICAgICAgICAgICAgICB7aWQ6XCIxMDAwXCIsbmFtZTpcIjEwMDBcIn0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge2lkOlwiMjAwMFwiLG5hbWU6XCIyMDAwXCJ9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtpZDpcIjMwMDBcIixuYW1lOlwiMzAwMFwifSxcclxuLy8gICAgICAgICAgICAgICAgICAgICB7aWQ6XCI0MDAwXCIsbmFtZTpcIjQwMDBcIn0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge2lkOlwiNTAwMFwiLG5hbWU6XCI1MDAwXCJ9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtpZDpcIjEwMDAwXCIsbmFtZTpcIjEwMDAwXCJ9XHJcbi8vICAgICAgICAgICAgICAgICBdLFxyXG4vLyAgICAgICAgICAgICAgICAganlrOltcclxuLy8gICAgICAgICAgICAgICAgICAgICB7aWQ6XCIxMDAwXCIsbmFtZTpcIjEwMDBcIn0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge2lkOlwiMjAwMFwiLG5hbWU6XCIyMDAwXCJ9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtpZDpcIjMwMDBcIixuYW1lOlwiMzAwMFwifSxcclxuLy8gICAgICAgICAgICAgICAgICAgICB7aWQ6XCI0MDAwXCIsbmFtZTpcIjQwMDBcIn0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge2lkOlwiNTAwMFwiLG5hbWU6XCI1MDAwXCJ9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtpZDpcIjYwMDBcIixuYW1lOlwiNjAwMFwifSxcclxuLy8gICAgICAgICAgICAgICAgICAgICB7aWQ6XCI3MDAwXCIsbmFtZTpcIjcwMDBcIn0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge2lkOlwiODAwMFwiLG5hbWU6XCI4MDAwXCJ9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtpZDpcIjkwMDBcIixuYW1lOlwiOTAwMFwifSxcclxuLy8gICAgICAgICAgICAgICAgICAgICB7aWQ6XCIxMDAwMFwiLG5hbWU6XCIxMDAwMFwifSxcclxuLy8gICAgICAgICAgICAgICAgIF0sXHJcbi8vICAgICAgICAgICAgICAgICBzZXJ2aWNlX2p5azpbXHJcbi8vICAgICAgICAgICAgICAgICAgICAge2lkOlwiNTAwXCIsbmFtZTpcIjUwMFwifSxcclxuLy8gICAgICAgICAgICAgICAgICAgICB7aWQ6XCIxMDAwXCIsbmFtZTpcIjEwMDBcIn0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge2lkOlwiMzAwMFwiLG5hbWU6XCIzMDAwXCJ9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtpZDpcIjUwMDBcIixuYW1lOlwiNTAwMFwifSxcclxuLy8gICAgICAgICAgICAgICAgICAgICB7aWQ6XCIxMDAwMFwiLG5hbWU6XCIxMDAwMFwifSxcclxuLy8gICAgICAgICAgICAgICAgICAgICB7aWQ6XCIyMDAwMFwiLG5hbWU6XCIyMDAwMFwifSxcclxuLy8gICAgICAgICAgICAgICAgIF1cclxuLy8gICAgICAgICAgICAgfSxcclxuLy8gICAgICAgICAgICAgY3VyX3Byb2R1Y3Q6XCJzZXJ2aWNlX2p5a1wiLFxyXG4vLyAgICAgICAgICAgICBjdXJfcHJpY2U6XCI1MDBcIixcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcbi8vXHJcbi8vICAgICAvLyDpgInmi6nkuqflk4FcclxuLy8gICAgIG9uU2VsZWN0UHJvZHVjdCgpe1xyXG4vLyAgICAgICAgIGxldCBjdXJfcHJpY2UgPSBwcm9kdWN0X2FjdGl2ZT09PVwiZmVlX3Nsb3dcIj9cIjEwMFwiOlwiMTAwMFwiO1xyXG4vLyAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Byb2R1Y3RfYWN0aXZlLHByaWNlX2FjdGl2ZSxtb2JpbGU6XCJcIn0pXHJcbi8vICAgICB9XHJcbi8vXHJcbi8vICAgICAvLyDpgInmi6nku7fmoLxcclxuLy8gICAgIG9uU2VsZWN0UHJpY2UoY3VyX3ByaWNlKXtcclxuLy8gICAgICAgICB0aGlzLnNldFN0YXRlKHtjdXJfcHJpY2V9KVxyXG4vLyAgICAgfVxyXG4vL1xyXG4vLyAgICAgLy8g5Y+R6YCB5Y+356CB5ZKM5Lu35qC855Sf5oiQ5LqM57u056CBXHJcbi8vICAgICBzZW5kUGhvbmVQcmljZSgpe1xyXG4vLyAgICAgICAgIGNvbnN0IHttb2JpbGUsIHByb2R1Y3RfYWN0aXZlLHByaWNlX2FjdGl2ZX0gPSB0aGlzLnN0YXRlO1xyXG4vLyAgICAgICAgIGxldCBbcGhvbmUsIHByb2R1Y3QsIHByaWNlXSA9IFttb2JpbGUsIHByb2R1Y3RfYWN0aXZlLHByaWNlX2FjdGl2ZV07XHJcbi8vICAgICAgICAgY29uc29sZS5sb2cocGhvbmUsXCIsIFwiLHByaWNlLFwiLCBcIixwcm9kdWN0KTtcclxuLy8gICAgICAgICBpZihwaG9uZSA9PT0gJycpe1xyXG4vLyAgICAgICAgICAgICBhbGVydCgn5Y+356CB5qC85byP6ZSZ6K+vLOivt+mHjeaWsOi+k+WFpSEnKTtcclxuLy8gICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4vLyAgICAgICAgIH1cclxuLy9cclxuLy8gICAgICAgICBpZih3aW5kb3cuY29uZmlybShcIuehruiupOeUn+aIkOS6jOe7tOeggeWQlz9cIikpe1xyXG4vLyAgICAgICAgICAgICB0aGlzLnByb3BzLnNlbmRQaG9uZVByaWNlKHBob25lLHByaWNlLHByb2R1Y3QpO1xyXG4vLyAgICAgICAgICAgICAkKFwiI21vZGFsXCIpLm1vZGFsKCdoaWRlJyk7XHJcbi8vICAgICAgICAgfWVsc2V7XHJcbi8vICAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH1cclxuLy9cclxuLy8gICAgIC8vIOWFs+mXrVxyXG4vLyAgICAgb25DYW5jZWwoKXtcclxuLy8gICAgICAgICB0aGlzLnNldFN0YXRlKHttb2JpbGU6bnVsbCxwcm9kdWN0X2FjdGl2ZTpcImZlZV9zbG93XCIsIHByaWNlX2FjdGl2ZTpcIjEwMFwiLH0pO1xyXG4vLyAgICAgICAgICQoJyNtb2RhbCcpLm1vZGFsKFwiaGlkZVwiKTtcclxuLy8gICAgIH1cclxuLy9cclxuLy8gICAgIC8vIOaJi+acuuWPt+eggei+k+WFpVxyXG4vLyAgICAgb25Nb2JpbGVDaGFuZ2UoZSl7XHJcbi8vICAgICAgICAgY29uc29sZS5sb2coZS50YXJnZXQudmFsdWUpO1xyXG4vLyAgICAgICAgIHRoaXMuc2V0U3RhdGUoe21vYmlsZTogZS50YXJnZXQudmFsdWV9KVxyXG4vLyAgICAgfVxyXG4vL1xyXG4vLyAgICAgb25TZWxlY3RVc2VkTW9iaWxlKG1vYmlsZSl7XHJcbi8vICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bW9iaWxlfSlcclxuLy8gICAgIH1cclxuLy9cclxuLy8gICAgIC8vIOmaj+acuui+k+WFpeaJi+acuuWPt1xyXG4vLyAgICAgZ2V0UmFuZG9tUGhvbmUoKSB7XHJcbi8vICAgICAgICAgbGV0IG51bUFycmF5ID0gW1wiMTM5XCIsIFwiMTM4XCIsIFwiMTM3XCIsIFwiMTM2XCIsIFwiMTM1XCIsIFwiMTM0XCIsIFwiMTU5XCIsIFwiMTU4XCIsIFwiMTU3XCIsIFwiMTUwXCIsIFwiMTUxXCIsIFwiMTUyXCIsIFwiMTg4XCIsIFwiMTg3XCIsIFwiMTgyXCIsIFwiMTgzXCIsIFwiMTg0XCIsIFwiMTc4XCIsIFwiMTMwXCIsIFwiMTMxXCIsIFwiMTMyXCIsIFwiMTU2XCIsIFwiMTU1XCIsIFwiMTg2XCIsIFwiMTg1XCIsIFwiMTc2XCIsIFwiMTMzXCIsIFwiMTUzXCIsIFwiMTg5XCIsIFwiMTgwXCIsIFwiMTgxXCIsIFwiMTc3XCJdO1xyXG4vLyAgICAgICAgIGxldCBpID0gcGFyc2VJbnQoMTAgKiBNYXRoLnJhbmRvbSgpKTtcclxuLy8gICAgICAgICBsZXQgbW9iaWxlID0gbnVtQXJyYXlbaV07XHJcbi8vICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA4OyBqKyspIHtcclxuLy8gICAgICAgICAgICAgbW9iaWxlID0gbW9iaWxlICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICB0aGlzLnNldFN0YXRlKHttb2JpbGV9KVxyXG4vLyAgICAgfVxyXG4vL1xyXG4vLyAgICAgcmVuZGVyKCkge1xyXG4vLyAgICAgICAgIGNvbnN0IHtjdXJfZGF0YTp7aW1hZ2UsY3JlYXRlX3RpbWV9LCBzaG93X3R5cGU6IHt0aXRsZSwgY29kZX19ID0gdGhpcy5wcm9wcztcclxuLy8gICAgICAgICBjb25zdCB7dXNlZF9tb2JpbGUsIHByb2R1Y3QsIHByaWNlLCBtb2JpbGUsIHByb2R1Y3RfYWN0aXZlLCBwcmljZV9hY3RpdmUsZGVmX2ltZ30gPSB0aGlzLnN0YXRlO1xyXG4vLyAgICAgICAgIGxldCBbc2hvd05vZGVzLCBva0J0bl0gPSBbPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPjxpbWcgc3JjPXtpbWFnZSA/IGltYWdlIDogZGVmX2ltZ30gY2xhc3NOYW1lPVwiaW1nLXRodW1ibmFpbFwiLz48aDU+e2NyZWF0ZV90aW1lfTwvaDU+PC9kaXY+LCBcIlwiLF07XHJcbi8vXHJcbi8vICAgICAgICAgbGV0IHByb2R1Y3RCdG4gPSBwcm9kdWN0Lm1hcCgoZCwgaSkgPT4ge1xyXG4vLyAgICAgICAgICAgICBsZXQgYnRuX3N0eWxlID0gcHJvZHVjdF9hY3RpdmUgPT09IGQuaWQgPyBcImJ0bi1wcmltYXJ5XCIgOiBcImJ0bi1kZWZhdWx0XCI7XHJcbi8vICAgICAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS00IG1hcmdpbi1ib3R0b20xNVwiPjxhIGtleT17aX0gaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKTtcIiBjbGFzc05hbWU9e2BidG4gYnRuLWJsb2NrICR7YnRuX3N0eWxlfWB9XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLm9uU2VsZWN0UHJvZHVjdC5iaW5kKHRoaXMsIGQuaWQpfT57ZC5uYW1lfTwvYT48L2Rpdj5cclxuLy8gICAgICAgICB9KTtcclxuLy9cclxuLy8gICAgICAgICBsZXQgcHJpY2VCdG4gPSBwcmljZVtwcm9kdWN0X2FjdGl2ZV0ubWFwKChkLCBpKSA9PiB7XHJcbi8vICAgICAgICAgICAgIGxldCBidG5fc3R5bGUgPSBwcmljZV9hY3RpdmUgPT09IGQuaWQgPyBcImJ0bi1wcmltYXJ5XCIgOiBcImJ0bi1kZWZhdWx0XCI7XHJcbi8vICAgICAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS0zIG1hcmdpbi1ib3R0b20xNVwiPjxhIGtleT17aX0gaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKTtcIiBjbGFzc05hbWU9e2BidG4gYnRuLWJsb2NrICR7YnRuX3N0eWxlfWB9XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub25TZWxlY3RQcmljZS5iaW5kKHRoaXMsIGQuaWQpfT57ZC5uYW1lfTwvYT48L2Rpdj5cclxuLy8gICAgICAgICB9KTtcclxuLy9cclxuLy8gICAgICAgICBsZXQgaW5wdXROb2RlID0gPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgdmFsdWU9e21vYmlsZX0gZGVmYXVsdFZhbHVlPXttb2JpbGV9XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwi6L6T5YWl5YWF5YC855qE5biQ5Y+3XCIgb25DaGFuZ2U9e3RoaXMub25Nb2JpbGVDaGFuZ2UuYmluZCh0aGlzKX0vPjtcclxuLy8gICAgICAgICBpZihwcm9kdWN0X2FjdGl2ZSA9PT0gJ2ZlZV9zbG93Jyl7XHJcbi8vICAgICAgICAgICAgIGxldCB1c2VkTW9iaWxlQnRuID0gdXNlZF9tb2JpbGUubWFwKChkLGkpPT57XHJcbi8vICAgICAgICAgICAgICAgICByZXR1cm4gPGxpIGtleT17aX0+PGEgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKTtcIiBvbkNsaWNrPXt0aGlzLm9uU2VsZWN0VXNlZE1vYmlsZS5iaW5kKHRoaXMsZC5pZCl9PntkLm5hbWV9PC9hPjwvbGk+XHJcbi8vICAgICAgICAgICAgIH0pO1xyXG4vL1xyXG4vLyAgICAgICAgICAgICBpbnB1dE5vZGUgPSA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwXCI+XHJcbi8vICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwLWJ0blwiPlxyXG4vLyAgICAgICAgICAgICAgICAgICAgIDxhIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWNhcmV0LWRvd25cIi8+XHJcbi8vICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4vLyAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJkcm9wZG93bi1tZW51IGRyb3Bkb3duLW1lbnUtcmlnaHRcIj5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAge3VzZWRNb2JpbGVCdG59XHJcbi8vICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuLy8gICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4vLyAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgdmFsdWU9e21vYmlsZX0gZGVmYXVsdFZhbHVlPXttb2JpbGV9IHBsYWNlaG9sZGVyPVwi6L6T5YWl5YWF5YC855qE5biQ5Y+3XCJcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vbk1vYmlsZUNoYW5nZS5iaW5kKHRoaXMpfS8+XHJcbi8vICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwLWJ0blwiPlxyXG4vLyAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMuZ2V0UmFuZG9tUGhvbmUuYmluZCh0aGlzKX0+6ZqP5py6PC9idXR0b24+XHJcbi8vICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuLy8gICAgICAgICAgICAgPC9kaXY+O1xyXG4vLyAgICAgICAgIH1cclxuLy9cclxuLy8gICAgICAgICBpZiAoY29kZSA9PT0gXCJjcmVhdGVOZXdcIikge1xyXG4vLyAgICAgICAgICAgICBzaG93Tm9kZXMgPSA8ZGl2IGNsYXNzTmFtZT0nZm9ybS1ncm91cCc+XHJcbi8vICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTQgY29sLW1kLTIgY29udHJvbC1sYWJlbFwiPuS6p+WTgTwvbGFiZWw+XHJcbi8vICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS04IGNvbC1tZC0xMCByb3dcIj5cclxuLy8gICAgICAgICAgICAgICAgICAgICB7cHJvZHVjdEJ0bn1cclxuLy8gICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4vL1xyXG4vLyAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC1zbS00IGNvbC1tZC0yIGNvbnRyb2wtbGFiZWxcIj7lhYXlgLzluJDlj7c8L2xhYmVsPlxyXG4vLyAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOCBjb2wtbWQtMTAgbWFyZ2luLWJvdHRvbTE1XCI+XHJcbi8vICAgICAgICAgICAgICAgICAgICAge2lucHV0Tm9kZX1cclxuLy8gICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4vL1xyXG4vLyAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC1zbS00IGNvbC1tZC0yIGNvbnRyb2wtbGFiZWxcIj7pnaLlgLw8L2xhYmVsPlxyXG4vLyAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOCBjb2wtbWQtMTAgcm93XCI+XHJcbi8vICAgICAgICAgICAgICAgICAgICAge3ByaWNlQnRufVxyXG4vLyAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbi8vXHJcbi8vICAgICAgICAgICAgIDwvZGl2PjtcclxuLy8gICAgICAgICAgICAgb2tCdG4gPSA8YSBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBvbkNsaWNrPXt0aGlzLnNlbmRQaG9uZVByaWNlLmJpbmQodGhpcyl9PueUn+aIkDwvYT47XHJcbi8vICAgICAgICAgfVxyXG4vL1xyXG4vLyAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nbW9kYWwgZmFkZScgaWQ9J21vZGFsJyB0YWJJbmRleD0nLTEnIHJvbGU9J2RpYWxvZycgYXJpYS1sYWJlbGxlZGJ5PSdhZGRNb2RhbExhYmVsJyBkYXRhLWJhY2tkcm9wPVwic3RhdGljXCI+XHJcbi8vICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtb2RhbC1kaWFsb2cnPlxyXG4vLyAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21vZGFsLWNvbnRlbnQnPlxyXG4vLyAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtb2RhbC1oZWFkZXInPlxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPSdtb2RhbC10aXRsZSc+e3RpdGxlfTwvaDQ+XHJcbi8vICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbi8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21vZGFsLWJvZHkgZm9ybS1ob3Jpem9udGFsJz5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAge3Nob3dOb2Rlc31cclxuLy8gICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbW9kYWwtZm9vdGVyJz5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAge29rQnRufVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9J2J0biBidG4tZGVmYXVsdCcgZGF0YS1kaXNtaXNzPSdtb2RhbCcgb25DbGljaz17dGhpcy5vbkNhbmNlbC5iaW5kKHRoaXMpfT7lhbPpl608L2E+XHJcbi8vICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbi8vICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuLy8gICAgICAgICAgICAgPC9kaXY+XHJcbi8vICAgICAgICAgPC9kaXY+XHJcbi8vICAgICB9XHJcbi8vIH1cclxuXHJcblJlYWN0RE9NLnJlbmRlcihcclxuICAgIDxNYWluUGFuZWwgLz4gLFxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tY29udGVudCcpXHJcbik7Il19
