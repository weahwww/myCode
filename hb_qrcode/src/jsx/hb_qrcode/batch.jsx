/* weahwww create */
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
const [Product, Price, pd_map] = [[
    {id:"fee_slow",name:"全国话费慢充"},
    {id:"jyk",name:"加油卡"},
    {id:"service_jyk",name:"客服加油卡"},
], {
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
    service_jyk:[
        {id:"500",name:"500"},
        {id:"1000",name:"1000"},
        {id:"3000",name:"3000"},
        {id:"5000",name:"5000"},
        {id:"10000",name:"10000"},
        {id:"20000",name:"20000"},
    ]},{
    fee_slow:"全国话费慢充",
    jyk:"加油卡",
    service_jyk:"客服加油卡"
}];


class MainPanel extends Component{
    constructor() {
        super();
        this.state ={
            start:false,
            list:[],
        };
        this.handleConfig("all");
    }

    // 发送生成二维码请求
    handleSubmitData(i){
        let {list} = this.state;
        list[i].timestamp = new Date().getTime();
        $.post('/api/qrcode/submit',JSON.stringify(list[i]))
            .done((d) => {
                console.log(d);
                let {status, order_id} = JSON.parse(d);
                if(status === 'ok'){
                    // list[i].img = img;
                    list[i].order_id = order_id;
                    list[i].status = true;
                    clearTimeout(list[i].img_task);
                    list[i].img_task = null;
                    this.loadCodeImage(i,order_id);
                    this.setState({list})
                }else{
                    alert('创建订单失败');
                }
            })
            .fail(() => {
                alert('创建订单异常');
            });
    }

    // 加载 / 修改配置
    handleConfig(type,data=this.state.list){
        $.post('/api/qrcode/config',JSON.stringify({type,data}))
            .done((d)=>{
                let {status,data} = JSON.parse(d);
                if(status === "ok"){
                    this.setState({list:data});
                }else{
                    alert('加载配置失败');
                    return false
                }
            })
            .fail(()=>{
                alert('加载配置异常');
                return false
            })
    }

    // 获取图片
    loadCodeImage(i,order_id){
        let {list} = this.state;
        let img_task = null;
        $.post('/api/qrcode/qrcode_get',JSON.stringify({order_id}))
            .done((d)=>{
                let {status,image} = JSON.parse(d);
                if(status === "ok"){
                    list[i].image = image;
                    list[i].status = false;
                    this.setState({list});
                    return false
                }else{
                    img_task = setTimeout(this.loadCodeImage.bind(this,i,order_id), 30000);
                    list[i].img_task = img_task;
                    this.setState({list});
                }
            })
            .fail(()=>{
                alert('获取图片异常');
                return false
            })
    }

    // 停止任务
    onClearInterval(i){
        let {list} =this.state;
        clearInterval(list[i].task);
        clearTimeout(list[i].img_task);
        list[i].task = null;
        list[i].img_task = null;
        list[i].status = false;
        console.log("CleanInterval: ",list);
        this.setState({list})
    }

    // 开始任务
    onIntervalTask(i){
        let {list} = this.state;
        this.handleSubmitData(i);
        list[i].task = setInterval(this.handleSubmitData.bind(this,i),100000);
        console.log("Interval: ", list);
        this.setState({start:true,list});
    }

    // 开始批量任务
    onStartBatchTask(){
        let {list} = this.state;
        for(let i in list){
            list[i].status = true;
            setTimeout(this.onIntervalTask.bind(this,i),5000);
        }
        console.log("StartBatch: ", list);
        this.setState({list})
    }

    // 停止批量任务
    onStopBatchTask(){
        let {list} = this.state;
        for(let i in list){
            clearInterval(list[i].task);
            clearTimeout(list[i].img_task);
            list[i].status = false;
            list[i].task = null;
            list[i].img_task = null;
        }
        console.log("StopBatch: ",list);
        this.setState({start:false,list})
    }

    render(){
        // 设置弹窗
        let onShowConfig = ()=>{
            $("#modal").modal("show");
        };

        const {list,start} = this.state;
        let btnNode = !start ? <a className="btn btn-success btn-sm" href="javascript:void(0);" onClick={this.onStartBatchTask.bind(this)}>
            <i className="fa fa-play"/> 开始
        </a> : <a className="btn btn-danger btn-sm" href="javascript:void(0);" onClick={this.onStopBatchTask.bind(this)}>
            <i className="fa fa-stop"/> 结束
        </a>;

        // let startNodes = start ? "disabled":"";
        let codeNodes = list.map((d,i) =>{
            return <QRcodePanel key={i} data={d} onIntervalTask={this.onIntervalTask.bind(this)} index={i}/>
        });
        return <section className="wrapper">
            <div className="row">
                <div className="col-lg-12">
                    <section className="panel row">
                        <div className="panel-body">
                            <span className="pull-right margin-right10" style={{marginBottom:"-5px"}}>
                                {btnNode}
                                <a href="javascript:void(0);" className="btn btn-primary btn-sm" onClick={onShowConfig.bind(this)}><i className="fa fa-cog fa-lg"/></a>
                            </span>
                        </div>
                    </section>
                </div>
            </div>
            <div className="row">
                {codeNodes}
            </div>
            <ModalPanel list={list} onClearInterval={this.onClearInterval.bind(this)} onIntervalTask={this.onIntervalTask.bind(this)}
                        onStartBatchTask={this.onStartBatchTask.bind(this)} onStopBatchTask={this.onStopBatchTask.bind(this)} handleConfig={this.handleConfig.bind(this)}/>
        </section>
    }
}

class QRcodePanel extends Component{
    constructor(props){
        super(props);
        this.state={
            qrcode:"/img/fail.png",
            data: this.props.data,
            index:this.props.index,
        };
    }

    onIntervalTask(i){
        this.props.onIntervalTask(i);
    }

    render(){
        function formatDate(date) {
            let Y=date.getFullYear() + '-';
            let M=(date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            let D=(date.getDate()< 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
            let h=(date.getHours()< 10 ? '0' + date.getHours() : date.getHours()) + ':';
            let m=(date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            let s=(date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
            return Y+M+D+h+m+s;
        }

        const {qrcode,index,data:{product, price, image, timestamp, status}}=this.state;
        let ts = new Date(parseInt(timestamp));
        let btnNode = !status ? "" : "disabled";
        return <div className="col-xs-4 col-sm-2 col-lg-1 code-box">
            <section className="panel row">
                <header className="panel-heading row">
                    <span className="pull-left">{pd_map[product]}</span>
                    <span className="pull-right text-danger"><strong>{price}</strong></span>
                </header>
                <div className="panel-body form-horizontal">
                    <div className="form-group text-center">
                        <img src={image ? image : qrcode} className="img-thumbnail"/>
                    </div>
                    <div className="form-group">
                        <h6><small>{timestamp ? formatDate(ts) : "未开始"}</small></h6>
                        <div className="input-group input-group-sm">
                            <input className="form-control" type="text" disabled="true"/>
                            <div className="input-group-btn">
                                <a className={`btn btn-primary ${btnNode}`} onClick={this.onIntervalTask.bind(this,index)}>生成</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    }
}

class ModalPanel extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:[]
        }
    }

    // 全部保存
    onSaveAllConfig() {
        let {data} = this.state;
        if(data !== [] || data.length !== 0){
            this.props.handleConfig("update",data);
            this.props.onStopBatchTask();
            this.props.onStartBatchTask()
        }
    }

    // state更新
    handleState(type,i,val) {
        let data = this.props.list;
        data[i][type] = val;
        this.setState({data});
    }

    // 关闭
    onCancel(){
        this.props.handleConfig("all");
        $('#modal').modal("hide");
    }

    render() {
        const {list} = this.props;
        let inputNode = list.map((d,i)=>{
            return <ConfigInput key={i} index={i} data={d} handleConfig={this.props.handleConfig.bind(this)}
                                onClearInterval={this.props.onClearInterval.bind(this)} onIntervalTask={this.props.onIntervalTask.bind(this)}
                                handleState={this.handleState.bind(this)}/>
        });
        return <div className='modal fade' id='modal' tabIndex='-1' role='dialog' aria-labelledby='addModalLabel' data-backdrop="static">
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h4 className='pull-left'>设置</h4>
                        <span className="pull-right">
                            <a href="javascript:void(0);" className="btn btn-primary btn-sm" onClick={this.onSaveAllConfig.bind(this)}>全部保存</a>
                        </span>
                    </div>

                    <div className='modal-body row'>
                        {inputNode}
                    </div>

                    <div className='modal-footer'>
                        <a className='btn btn-default' data-dismiss='modal' onClick={this.onCancel.bind(this)}>关闭</a>
                    </div>
                </div>
            </div>
        </div>
    }
}

class ConfigInput extends Component{
    constructor(props){
        super(props);
        this.state={
            data: this.props.data,
            index:this.props.index
        }
    }

    componentWillReceiveProps(nextProps) {
         this.setState({
             data: nextProps.data,
             index: nextProps.index
         });
    }

    // 修改值
    onChangeValue(type,id){
        const {index} = this.state;
        this.setState({[type]:id});
        this.props.handleState(type,index,id)
    }

    // 修改帐号
    onChangeAccount(e){
        const {index} = this.state;
        let account = e.target.value;
        this.props.handleState("account",index,account)
    }

    // 保存修改
    onSaveConfig(){
        const {index,data} = this.state;
        let d = [];
        d[0] = data;
        this.props.handleConfig("update", d);
        this.props.onClearInterval(index);
        this.props.onIntervalTask(index);
    }

    render(){
        const {id,product,price,account} = this.state.data;
        let productNode = Product.map((d,i)=>{
            return <li key={i}><a href="javascript:void(0);" onClick={this.onChangeValue.bind(this,"product",d.id)}>{d.name}</a></li>
        });
        let priceNode = Price[product].map((d,i)=>{
            return <li key={i}><a href="javascript:void(0);" onClick={this.onChangeValue.bind(this,"price",d.id)}>{d.name}</a></li>
        });
        return <div className="col-sm-12 row margin-bottom5">
            <div className="col-sm-1"><h5>{id}</h5></div>
            <div className="col-sm-11 input-group input-group-sm">
                <div className="input-group-btn">
                    <button type="button" className="btn btn-default dropdown-toggle col-sm-12" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {pd_map[product]}
                    </button>
                    <ul className="dropdown-menu">
                        {productNode}
                    </ul>
                </div>
                <div className="input-group-btn">
                    <button type="button" className="btn btn-default dropdown-toggle col-sm-12" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {price}
                    </button>
                    <ul className="dropdown-menu">
                        {priceNode}
                    </ul>
                </div>
                <input type="text" className="form-control input-sm" defaultValue={account} onChange={this.onChangeAccount.bind(this)}/>
                <div className="input-group-btn">
                    <button type="button" className="btn btn-default" onClick={this.onSaveConfig.bind(this)}>保存</button>
                </div>
            </div>
        </div>
    }
}

ReactDOM.render(
    <MainPanel /> ,
    document.getElementById('main-content')
);