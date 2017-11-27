/* weahwww create */
import React from 'react';
import ReactDOM from 'react-dom';
import PageIndex from '../plug-in/PageIndex.jsx';
import DateRange from '../plug-in/DateRange.jsx';
import moment from 'moment';

const tab = [
    {id:"all", name: "全部"},
    {id:"wait", name: "未取码"},
    {id:"used", name: "已取码"},
    {id:"finish", name: "已完成"},
];

class MainPanel extends React.Component{
    constructor() {
        super();
        this.state ={
            refresh:true,
            code_list:[],
            cur_tab:"all",
            cur_data:{image:"",create_time:""},
            show_type:{or_show:"false", title:"",code:""},
            page:1,
            max:0,
            task: null,
            format:'YYYY/MM/DD',
            start_date: moment().subtract(6,'days').format('YYYY/MM/DD'),
            // end_time:moment().format('YYYY/MM/DD'),
            r_start: moment().subtract(6,'days').format('YYYY/MM/DD'),
            r_end: moment().format('YYYY/MM/DD')
        };
    }

    componentDidMount(){
        this.loadCodeList();
        this.onStartTask()
    }

    // 加载二维码列表
    loadCodeList(page=1, status=this.state.cur_tab, start=this.state.r_start, end=this.state.r_end, size=40){
        let r = {page,status,size,start,end};
        console.log(r);
        $.post('/api/qrcode/summary',JSON.stringify(r))
            .done((d) => {
                const {msg, data,max} = JSON.parse(d);
                if(msg === 'ok'){
                    this.setState({
                        code_list:data,
                        page,
                        max,
                    });
                }else{
                    alert('加载二维码列表错误');
                }
            })
            .fail(() => {
                alert('加载二维码列表异常');
            });
    }

    // 发送号码和价格
    sendPhonePrice(phone,price,product) {
        let timestamp = new Date().getTime();
        let r = {
            product,
            phone,
            price,
            timestamp
        };
        console.log(r);
        $.post("/api/qrcode/submit", JSON.stringify(r))
            .done((m)=>{
                let {msg} = JSON.parse(m);
                if (msg === "ok") {
                    alert('发送成功,二维码加载会有延迟,大约1分钟左右,请耐心等待!');
                    this.loadCodeList();
                }else{
                    alert('发送失败,请稍候再试!');
                }
            })

            .fail(()=> {
                alert('服务器获取信息失败');
            });
    }

    // 设置回调结果
    onSetCodeState(create_time, st){
        $.post('/api/qrcode/callback', JSON.stringify({create_time, status:st}))
            .done((d)=>{
                const {status} = JSON.parse(d);
                if(status === 'ok'){
                    if(st !== 'used'){
                        alert(`设置成功`);
                    }
                    this.loadCodeList();
                }else{
                    if(st !== 'used'){
                        alert('设置失败');
                    }
                }
            })
            .fail(() =>{
                alert('设置异常');
            });
    }

    // 开始刷新
    onStartTask(){
        let task = setInterval(this.loadCodeList.bind(this),10000);
        this.setState({task, refresh:true});
    }

    // 停止刷新
    onStopTask(){
        let {task} = this.state;
        clearInterval(task);
        this.setState({task:null,refresh:false})
    }

    // tab切换
    onClickStatusBtn(cur_tab){
        this.setState({cur_tab});
        this.loadCodeList();
    }

    // 取码弹窗
    onGetQRCode(i){
        let {code_list} = this.state;
        let [{image,create_time}, show_type] = [code_list[i],{title:"取码",code:"getCode"}];
        this.setState({cur_data:{image,create_time},show_type});
        this.onSetCodeState(code_list[i].create_time,'used');
        $('#modal').modal("show");
    }

    // 新生成二维码弹窗
    onClickCreateNew() {
        let show_type = {title:"生成",code:"createNew"};
        this.setState({show_type});
        $('#modal').modal("show");
    }

    // 选择时间范围
    getDateRange(r_start,r_end){
        this.setState({r_start,r_end});
    }

    render(){
        function formatDate(now) {
            let Y=now.getFullYear();
            let M=now.getMonth()+1;
            let D=now.getDate();
            let h=now.getHours();
            let m=now.getMinutes();
            let s=now.getSeconds();
            return Y+"-"+M+"-"+D+" "+h+":"+m+":"+s;
        }

        const {code_list, page, max,cur_tab,show_type,cur_data,refresh,format,start_date} = this.state;
        const s_map = {running:"生成中",used: "已取码", wait: "未取码", finish: "完成",fail:"失败"};
        const style_map = {running:"text-primary",used:"",wait:"text-danger",finish:"text-success",fail:"text-danger"};
        let refreshNodes = !refresh ? <a className="btn btn-success btn-sm" href="javascript:void(0);" onClick={this.onStartTask.bind(this)}><i className="fa fa-play"/> 刷新</a> :
            <a className="btn btn-danger btn-sm" href="javascript:void(0);" onClick={this.onStopTask.bind(this)}><i className="fa fa-stop"/> 停止</a>;
        let tabNodes = tab.map((d, i) =>{
            let name = "";
            if (d.id === cur_tab) {
                name = "active";
            }
            return <li key={i} role="presentation" className={name}>
                <a href="javascript:void(0);" className="text-primary" data-toggle="tab" onClick={this.onClickStatusBtn.bind(this, d.id)}>
                    {d.name}
                </a>
            </li>
        });

        let dataNode = code_list.map((d,i) =>{
            let c_time = new Date(parseInt(d.create_time));
            let [get_code_btn, finish_btn,fail_btn,noteNode] = [
                <a href="javascript:void(0);" onClick={this.onGetQRCode.bind(this,i)}>取码</a>,
                <a href="javascript:void(0);" onClick={this.onSetCodeState.bind(this,d.create_time,"finish")}>置成功</a>,
                <a href="javascript:void(0);" onClick={this.onSetCodeState.bind(this,d.create_time,"fail")}>置失败</a>,
                d.note
            ];
            if(d.status === 'running'){
                [finish_btn,get_code_btn] = [null,null];
            }else if(d.status === 'finish' || d.status === 'fail'){
                [finish_btn,fail_btn] = [null,null]
            }
            return <tr key={i}>
                <td>{d.create_time}</td>
                <td>{d.name}</td>
                <td>{formatDate(c_time)}</td>
                <td>{d.price}</td>
                <td>{d.mobile}</td>
                <td>{d.orderid}</td>
                <td className={style_map[d.status]}>{s_map[d.status]}</td>
                <td>{get_code_btn}</td>
                <td>{finish_btn} {fail_btn}</td>
                <td>{noteNode}</td>
            </tr>
        });

        return<section className="wrapper">
            <div className="row">
                <div className="col-lg-12">
                    <section className="panel">
                        <div className="panel-body">
                            <form className='form-horizontal' method='get'>
                                <div className='form-group m-top15'>
                                    <div className='col-md-12 row m-bot15'>
                                        <label className='col-sm-4 col-md-1 control-label'>时间范围</label>
                                        <div className='col-sm-8 col-md-5'>
                                            <DateRange getDateRange={this.getDateRange.bind(this)} format={format} start_date={start_date}/>
                                        </div>

                                        <div className='col-md-offset-1 col-md-2'>
                                            <a href='javascript:void(0);' className='btn btn-primary m-right10' onClick={this.loadCodeList.bind(this)}>
                                                查询
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </section>
                    <section className="panel">
                        <header className="panel-heading row">
                            <div className="nav nav-pills col-sm-10">
                                {tabNodes}
                            </div>
                            <span className="pull-right margin-right10" style={{marginBottom:"-5px"}}>
                                {refreshNodes}
                                <a href="javascript:void(0);" className="btn btn-primary btn-sm" onClick={this.onClickCreateNew.bind(this)}><i className="fa fa-plus fa-lg"/></a>
                                <a href="/batch" className="btn btn-default btn-sm">批量生成</a>
                            </span>
                        </header>
                        <div className="panel-body table-responsive">
                            <table id="order_result" className="table table-striped table-hover">
                                <thead>
                                <tr>
                                    <th>编号</th>
                                    <th>产品名称</th>
                                    <th>提交时间</th>
                                    <th>面值</th>
                                    <th>号码</th>
                                    <th>订单编号</th>
                                    <th>二维码状态</th>
                                    <th>取码</th>
                                    <th>订单操作</th>
                                    <th>备注</th>
                                </tr>
                                </thead>
                                <tbody>
                                {dataNode}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <PageIndex className={"pull-right"} onPageIndex={this.loadCodeList.bind(this)} page={page} max={max} />
                    <ModalPanel cur_data={cur_data} show_type={show_type} sendPhonePrice={this.sendPhonePrice.bind(this)}/>
                </div>
            </div>
        </section>
    }
}

class ModalPanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            used_mobile:[
                {id:'18351889239',name:'18351889239'},
                {id:'18351889240',name:'18351889240'},
                {id:'17721566606',name:'17721566606'},
                {id:'17721566676',name:'17721566676'}
            ],
            product:[
                {id:"fee_slow",name:"全国话费慢充"},
                {id:"jyk",name:"加油卡"},
                {id:"web_jyk",name:"web加油卡"},
            ],
            price:{
                fee_slow:[
                    {id:"100",name:"100"},
                    {id:"200",name:"200"},
                    {id:"300",name:"300"},
                    {id:"500",name:"500"},
                    {id:"1000",name:"1000"},
                    {id:"2000",name:"2000"},
                    {id:"3000",name:"3000"},
                    {id:"4000",name:"4000"},
                    {id:"5000",name:"5000"},
                    {id:"10000",name:"10000"}
                ],
                jyk:[
                    {id:"1000",name:"1000"},
                    {id:"2000",name:"2000"},
                    {id:"3000",name:"3000"},
                    {id:"4000",name:"4000"},
                    {id:"5000",name:"5000"},
                    {id:"6000",name:"6000"},
                    {id:"7000",name:"7000"},
                    {id:"8000",name:"8000"},
                    {id:"9000",name:"9000"},
                    {id:"10000",name:"10000"},
                ],
                web_jyk:[
                    {id:"500",name:"500"},
                    {id:"1000",name:"1000"},
                    {id:"3000",name:"3000"},
                    {id:"5000",name:"5000"},
                    {id:"10000",name:"10000"},
                    {id:"20000",name:"20000"},
                ]
            },
            product_active:"web_jyk",
            price_active:"1000",
            def_img:"/img/fail.png",
            mobile:"",
        }
    }

    // 选择产品
    onSelectProduct(product_active){
        let price_active = product_active==="fee_slow"?"100":"1000";
        this.setState({product_active,price_active,mobile:""})
    }

    // 选择价格
    onSelectPrice(price_active){
        this.setState({price_active})
    }

    // 发送号码和价格生成二维码
    sendPhonePrice(){
        const {mobile, product_active,price_active} = this.state;
        let [phone, product, price] = [mobile, product_active,price_active];
        console.log(phone,", ",price,", ",product);
        if(phone === ''){
            alert('号码格式错误,请重新输入!');
            return false;
        }

        if(window.confirm("确认生成二维码吗?")){
            this.props.sendPhonePrice(phone,price,product);
            $("#modal").modal('hide');
        }else{
            return false
        }
    }

    // 关闭
    onCancel(){
        this.setState({mobile:null,product_active:"web_jyk", price_active:"1000",});
        $('#modal').modal("hide");
    }

    // 手机号码输入
    onMobileChange(e){
        console.log(e.target.value);
        this.setState({mobile: e.target.value})
    }

    onSelectUsedMobile(mobile){
        this.setState({mobile})
    }

    // 随机输入手机号
    getRandomPhone() {
        let numArray = ["139", "138", "137", "136", "135", "134", "159", "158", "157", "150", "151", "152", "188", "187", "182", "183", "184", "178", "130", "131", "132", "156", "155", "186", "185", "176", "133", "153", "189", "180", "181", "177"];
        let i = parseInt(10 * Math.random());
        let mobile = numArray[i];
        for (let j = 0; j < 8; j++) {
            mobile = mobile + Math.floor(Math.random() * 10);
        }
        this.setState({mobile})
    }

    render() {
        const {cur_data:{image,create_time}, show_type: {title, code}} = this.props;
        const {used_mobile, product, price, mobile, product_active, price_active,def_img} = this.state;
        let [showNodes, okBtn] = [<div className="text-center"><img src={image ? image : def_img} className="img-thumbnail"/><h5>{create_time}</h5></div>, "",];

        let productBtn = product.map((d, i) => {
            let btn_style = product_active === d.id ? "btn-primary" : "btn-default";
            return <div className="col-sm-4 margin-bottom15"><a key={i} href="javascript:void(0);" className={`btn btn-block ${btn_style}`}
                                                                onClick={this.onSelectProduct.bind(this, d.id)}>{d.name}</a></div>
        });

        let priceBtn = price[product_active].map((d, i) => {
            let btn_style = price_active === d.id ? "btn-primary" : "btn-default";
            return <div className="col-sm-3 margin-bottom15"><a key={i} href="javascript:void(0);" className={`btn btn-block ${btn_style}`}
                        onClick={this.onSelectPrice.bind(this, d.id)}>{d.name}</a></div>
        });

        let inputNode = <input type="text" className="form-control" value={mobile} defaultValue={mobile}
                        placeholder="输入充值的帐号" onChange={this.onMobileChange.bind(this)}/>;
        if(product_active === 'fee_slow'){
            let usedMobileBtn = used_mobile.map((d,i)=>{
                return <li key={i}><a href="javascript:void(0);" onClick={this.onSelectUsedMobile.bind(this,d.id)}>{d.name}</a></li>
            });

            inputNode = <div className="input-group">
                <div className="input-group-btn">
                    <a type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fa fa-caret-down"/>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-right">
                        {usedMobileBtn}
                    </ul>
                </div>
                <input type="text" className="form-control" value={mobile} defaultValue={mobile} placeholder="输入充值的帐号"
                       onChange={this.onMobileChange.bind(this)}/>
                <div className="input-group-btn">
                    <button className="btn btn-default" type="button" onClick={this.getRandomPhone.bind(this)}>随机</button>
                </div>
            </div>;
        }

        if (code === "createNew") {
            showNodes = <div className='form-group'>
                <label className="col-sm-4 col-md-2 control-label">产品</label>
                <div className="col-sm-8 col-md-10 row">
                    {productBtn}
                </div>

                <label className="col-sm-4 col-md-2 control-label">充值帐号</label>
                <div className="col-sm-8 col-md-10 margin-bottom15">
                    {inputNode}
                </div>

                <label className="col-sm-4 col-md-2 control-label">面值</label>
                <div className="col-sm-8 col-md-10 row">
                    {priceBtn}
                </div>

            </div>;
            okBtn = <a className="btn btn-primary" onClick={this.sendPhonePrice.bind(this)}>生成</a>;
        }

        return <div className='modal fade' id='modal' tabIndex='-1' role='dialog' aria-labelledby='addModalLabel' data-backdrop="static">
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h4 className='modal-title'>{title}</h4>
                    </div>

                    <div className='modal-body form-horizontal'>
                        {showNodes}
                    </div>

                    <div className='modal-footer'>
                        {okBtn}
                        <a className='btn btn-default' data-dismiss='modal' onClick={this.onCancel.bind(this)}>关闭</a>
                    </div>
                </div>
            </div>
        </div>
    }
}

ReactDOM.render(
    <MainPanel /> ,
    document.getElementById('main-content')
);