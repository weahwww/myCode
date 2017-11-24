/* weahwww create */
import React from 'react';
import ReactDOM from 'react-dom';

class MainPanel extends React.Component{
    constructor() {
        super();
        this.state ={
            start:false,
            config:[
                {id:"1",product:"",price:"",mobile:"",interval:"600000"},
                {id:"2",product:"",price:"",mobile:"",interval:"600000"},
                {id:"3",product:"",price:"",mobile:"",interval:"600000"},
                {id:"4",product:"",price:"",mobile:"",interval:"600000"},
                {id:"5",product:"",price:"",mobile:"",interval:"600000"},
                {id:"6",product:"",price:"",mobile:"",interval:"600000"},
                {id:"7",product:"",price:"",mobile:"",interval:"600000"},
                {id:"8",product:"",price:"",mobile:"",interval:"600000"},
                {id:"9",product:"",price:"",mobile:"",interval:"600000"},
                {id:"10",product:"",price:"",mobile:"",interval:"600000"},
                {id:"11",product:"",price:"",mobile:"",interval:"600000"},
                {id:"12",product:"",price:"",mobile:"",interval:"600000"},
                {id:"13",product:"",price:"",mobile:"",interval:"600000"},
                {id:"14",product:"",price:"",mobile:"",interval:"600000"},
                {id:"15",product:"",price:"",mobile:"",interval:"600000"},
                {id:"16",product:"",price:"",mobile:"",interval:"600000"},
                {id:"17",product:"",price:"",mobile:"",interval:"600000"},
                {id:"18",product:"",price:"",mobile:"",interval:"600000"},
                {id:"19",product:"",price:"",mobile:"",interval:"600000"},
                {id:"20",product:"",price:"",mobile:"",interval:"600000"},
                ],
        };
        this.loadConfig = this.loadConfig.bind(this);


    }

    componentDidMount(){
        this.loadConfig();
    }

    loadConfig(){
        $.post('/api/qrcode/config')
            .done((d)=>{
                let {status,data} = JSON.parse(d);
                if(status === "ok"){
                    this.setState({config:data})
                }else{
                    alert('加载配置失败')
                }
            })
            .fail(()=>{
                alert('加载配置异常')
            })
    }



    // 发送号码和价格
    sendPhonePrice(phone,price,product) {
        let timestamp = new Date().getTime();
        let r = {
            product,
            num: 1,
            phone,
            price,
            timestamp
        };
        console.log(r);
        $.post("/api/qrcode/submit", JSON.stringify(r))
            .done((m)=>{
                let {msg} = JSON.parse(m);
                if (msg === "ok") {
                    this.loadCodeList();
                }else{
                    console.log('发送失败,请稍候再试!');
                }
            })

            .fail(()=> {
                console.log('服务器获取信息失败');
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

    // 开始运行
    onStartTask(){
        this.setState({start:true});
    }

    // 停止刷新
    onStopTask(){
        let {task} = this.state;
        clearInterval(task);
        this.setState({task:null,refresh:false})
    }

    // 设置弹窗
    onShowConfig(cur_tab){
        this.setState({cur_tab});
        this.loadCodeList();
    }

    // 取码弹窗
    onSetConfig(i){
        let {code_list} = this.state;
        let [{image,create_time}, show_type] = [code_list[i],{title:"取码",code:"getCode"}];
        this.setState({cur_data:{image,create_time},show_type});
        this.onSetCodeState(code_list[i].create_time,'used');
        $('#modal').modal("show");
    }


    render(){
        const {config,start} = this.state;
        const s_map = {running:"生成中",used: "已取码", wait: "未取码", finish: "完成",fail:"失败"};
        const style_map = {running:"text-primary",used:"",wait:"text-danger",finish:"text-success",fail:"text-danger"};
        let startNodes = start ? "disabled" : "";
        let codeNodes = config.map((d,i) =>{
            return <QRcodePanel key={i} data={d} start={start}/>
        });
        return<section className="wrapper">
            <div className="row">
                <div className="col-lg-12">
                    <section className="panel row">
                        <div className="panel-body">
                            <span className="pull-right margin-right10" style={{marginBottom:"-5px"}}>
                                <a className={`btn btn-success btn-sm ${startNodes}`} href="javascript:void(0);" onClick={this.onStartTask.bind(this)}><i className="fa fa-play"/> 开始</a>
                                <a href="javascript:void(0);" className="btn btn-primary btn-sm" onClick={this.onShowConfig.bind(this)}><i className="fa fa-plus fa-lg"/></a>
                            </span>
                        </div>
                    </section>

                    <section className="panel row">
                        {codeNodes}
                    </section>

                    {/*<ModalPanel config={config} onSetConfig={this.onSetConfig.bind(this)}/>*/}
                </div>
            </div>
        </section>
    }
}

class QRcodePanel extends React.Component{
    constructor(props){
        super(props);
        this.state={
            qrcode:"/img/fail.png",
            timestamp:"",
        };
        this.onCheckTaskRun();
    }

    // componentWillMount(){
    //     this.onCheckTaskRun();
    // }

    // 是否运行任务
    onCheckTaskRun(){
        if(this.props.start){
            alert(111);
        }
    }

    // 加载二维码
    loadCode(){
        $.post('/api/qrcode/summary',JSON.stringify(this.props.data))
            .done((d) => {
                const {msg, data} = JSON.parse(d);
                if(msg === 'ok'){
                    this.setState({
                        qrcode:data,
                    });
                }else{
                    alert('加载二维码错误');
                }
            })
            .fail(() => {
                alert('加载二维码异常');
            });
    }


    render(){
        const {qrcode,timestamp}=this.state;
        if(this.props.start){
            alert(111);
        }
        return <div className="col-sm-1">
                <div className="panel-body form-horizontal">
                    <div className="form-group text-center">
                        <img src={qrcode} className="img-thumbnail"/>
                    </div>
                    <div className="form-group">
                        <label className="control-label">{timestamp}</label>
                        <div className="input-group input-group-sm">
                            <input className="form-control" type="text" disabled="true"/>
                            <div className="input-group-btn">
                                <a className="btn btn-primary">刷新</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    }
}

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

ReactDOM.render(
    <MainPanel /> ,
    document.getElementById('main-content')
);