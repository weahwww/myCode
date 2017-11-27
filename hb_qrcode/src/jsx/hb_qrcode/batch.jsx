/* weahwww create */
import React from 'react';
import ReactDOM from 'react-dom';

class MainPanel extends React.Component{
    constructor() {
        super();
        this.state ={
            start:false,
            task:[],
            list:[
                {id:"1",product:"jyk",price:"100",phone:"",interval:"600000",img:"",timestamp:"",status:false},
                {id:"2",product:"phone",price:"1000",phone:"",interval:"600000",img:"",timestamp:"",status:false},
                // {id:"3",product:"",price:"",phone:"",interval:"600000",img:"",timestamp:"",status:false},
                // {id:"4",product:"",price:"",phone:"",interval:"600000",img:"",timestamp:"",status:false},
                // {id:"5",product:"",price:"",phone:"",interval:"600000",img:"",timestamp:"",status:false},
                // {id:"6",product:"",price:"",phone:"",interval:"600000",img:"",timestamp:"",status:false},
                // {id:"7",product:"",price:"",phone:"",interval:"600000",img:"",timestamp:"",status:false},
                // {id:"8",product:"",price:"",phone:"",interval:"600000",img:"",timestamp:"",status:false},
                // {id:"9",product:"",price:"",phone:"",interval:"600000",img:"",timestamp:"",status:false},
                // {id:"10",product:"",price:"",phone:"",interval:"600000",img:"",timestamp:"",status:false},
                // {id:"11",product:"",price:"",phone:"",interval:"600000",img:"",timestamp:"",status:false},
                // {id:"12",product:"",price:"",phone:"",interval:"600000",img:"",timestamp:"",status:false},
                // {id:"13",product:"",price:"",phone:"",interval:"600000",img:"",timestamp:"",status:false},
                // {id:"14",product:"",price:"",phone:"",interval:"600000",img:"",timestamp:"",status:false},
                // {id:"15",product:"",price:"",phone:"",interval:"600000",img:"",timestamp:"",status:false},
                // {id:"16",product:"",price:"",phone:"",interval:"600000",img:"",timestamp:"",status:false},
                // {id:"17",product:"",price:"",phone:"",interval:"600000",img:"",timestamp:"",status:false},
                // {id:"18",product:"",price:"",phone:"",interval:"600000",img:"",timestamp:"",status:false},
                // {id:"19",product:"",price:"",phone:"",interval:"600000",img:"",timestamp:"",status:false},
                // {id:"20",product:"",price:"",phone:"",interval:"600000",img:"",timestamp:"",status:false},
                ],
        };
    }

    // 发送生成二维码请求
    handleCreateCode(data){
        $.post('/api/qrcode/submit',JSON.stringify(data))
            .done((d) => {
                const {msg, img} = JSON.parse(d);
                if(msg === 'ok'){
                    // list[i].img = img;
                    data.status = true;
                    data.img = img;
                    return data
                }else{
                    alert('加载二维码错误');
                }
            })
            .fail(() => {
                alert('加载二维码异常');
            });
    }

    // 获取配置
    loadConfig(){
        $.post('/api/qrcode/config')
            .done((d)=>{
                let {status,data} = JSON.parse(d);
                if(status === "ok"){
                    this.setState({list:data})
                }else{
                    alert('加载配置失败')
                }
            })
            .fail(()=>{
                alert('加载配置异常')
            })
    }

    // 生成事件
    onCreateCode(i){
        let {list} = this.state;
        list[i].timestamp = new Date().getTime();
        let d = this.handleCreateCode(list[i]);
        this.setState({list:d});
    }

    // 定时任务
    onIntervalTask(i){
        let {task} = this.state;
        this.onCreateCode(i);
        task[i] = setInterval(this.onCreateCode.bind(this,i),60000);
        this.setState({start:true,task});
    }

    // 批量生成任务
    onBatchTask(){
        let {list} = this.state;
        for(let i in list){
            list[i].status = false;
            setTimeout(this.onIntervalTask.bind(this,i),1000);
        }
        this.setState({list})
    }

    // 停止刷新
    onStopTask(i){
        let {task} = this.state;
        clearInterval(task[i]);
        this.setState({task,start:false})
    }

    // 设置弹窗
    onShowConfig(cur_tab){
        this.setState({cur_tab});
        this.onCreateCodeList();
    }

    render(){
        const {list,start} = this.state;
        let btnNode = !start ? <a className="btn btn-success btn-sm" href="javascript:void(0);" onClick={this.onBatchTask.bind(this)}>
            <i className="fa fa-play"/> 开始
        </a> : <a className="btn btn-danger btn-sm" href="javascript:void(0);" onClick={this.onStopTask.bind(this)}>
            <i className="fa fa-stop"/> 结束
        </a>;

        // let startNodes = start ? "disabled":"";
        let codeNodes = list.map((d,i) =>{
            return <QRcodePanel key={i} data={d} onCreateCode={this.onCreateCode.bind(this)} index={i}/>
        });
        return <section className="wrapper">
            <div className="row">
                <div className="col-lg-12">
                    <section className="panel row">
                        <div className="panel-body">
                            <span className="pull-right margin-right10" style={{marginBottom:"-5px"}}>
                                {btnNode}
                                {/*<a className={`btn btn-success btn-sm ${startNodes}`} href="javascript:void(0);" onClick={this.onStartTask.bind(this)}><i className="fa fa-play"/> 开始</a>*/}
                                <a href="javascript:void(0);" className="btn btn-primary btn-sm" onClick={this.onShowConfig.bind(this)}><i className="fa fa-cog fa-lg"/></a>
                            </span>
                        </div>
                    </section>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12 row">
                {codeNodes}
                </div>
            </div>
            {/*<ModalPanel list={list} onSetConfig={this.onSetConfig.bind(this)}/>*/}
        </section>
    }
}

class QRcodePanel extends React.Component{
    constructor(props){
        super(props);
        this.state={
            qrcode:"/img/fail.png",
            data: this.props.data,
            index:this.props.index,
        };
    }

    onCreateCode(i){
        this.props.onCreateCode(i);
    }

    render(){
        const {qrcode,index,data:{product, price, img, timestamp, status}}=this.state;
        let btnNode = status ? "" : "disabled";
        return <div className="col-xs-4 col-sm-2 col-lg-1 code-box">
            <div className="panel row">
                <header className="panel-heading row">
                    <span className="pull-left">{product}</span>
                    <span className="pull-right text-danger"><strong>{price}</strong></span>
                </header>
                <div className="panel-body form-horizontal">
                    <div className="form-group text-center">
                        <img src={img ? img : qrcode} className="img-thumbnail"/>
                    </div>
                    <div className="form-group">
                        <label className="control-label">{timestamp}</label>
                        <div className="input-group input-group-sm">
                            <input className="form-control" type="text" disabled="true"/>
                            <div className="input-group-btn">
                                <a className={`btn btn-primary ${btnNode}`} onClick={this.onCreateCode.bind(this,index)}>生成</a>
                            </div>
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