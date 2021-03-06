/* weahwww create */
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
const [Product, Price, pd_map] = [[
    {id:"fee_slow",name:"话费慢充"},
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
    fee_slow:"话费慢充",
    jyk:"加油卡",
    service_jyk:"客服加油卡"
}];

class MainPanel extends Component{
    constructor() {
        super();
        this.state ={
            s_view:false,
            start:false,
            list:[],
            o_list:[],
            // list:[{"account":"1000113100001791937","price":"3000","product":"jyk","id":"1","timestamp":1512005925815,"task":null,"order_id":"qr15120059141755a1f611aab5d5922c027dbcf","status":false,"img_task":null}]
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
                    console.log(list);
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
                    this.setState({list:data,o_list:data});
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
                    img_task = setTimeout(this.loadCodeImage.bind(this,i,order_id), 60000);
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
        // console.log("CleanInterval: ",list);
        this.setState({list})
    }

    // 开始任务
    onIntervalTask(i){
        let {list} = this.state;
        this.handleSubmitData(i);
        list[i].task = setInterval(this.handleSubmitData.bind(this,i),180000);
        // console.log("Interval: ", list);
        this.setState({list});
    }

    // 开始批量任务
    onStartBatchTask(){
        let {list} = this.state;
        for(let i in list){
            clearInterval(list[i].task);
            clearTimeout(list[i].img_task);
            list[i].task = null;
            list[i].img_task = null;
            list[i].status = true;
            setTimeout(this.onIntervalTask.bind(this,i),5000);
        }
        // console.log("StartBatch: ", list);
        this.setState({start:true, list})
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
        // console.log("StopBatch: ",list);
        this.setState({start:false,list})
    }

    // 全部保存
    onSaveAllConfig() {
        let {list} = this.state;
        if(list !== [] || list.length !== 0){
            this.handleConfig("update",list);
            this.onStopBatchTask();
            this.onStartBatchTask()
        }
    }

    // state更新
    handleState(type,i,val) {
        let {list} = this.state;
        console.log("i: ",i,"; con: ",list);
        list[i][type] = val;
        this.setState({list});
    }


    render(){
        // 设置弹窗
        // let onShowConfig =()=>{
        //     $("#modal").modal("show");
        // };

        const {list,o_list,start,s_view} = this.state;
        let viewNode = s_view ? "col-lg-11" : "col-lg-9";



        // let startNodes = start ? "disabled":"";
        let codeNodes = list.map((d,i) =>{
            return <QRcodePanel key={i} con_data={d} onIntervalTask={this.onIntervalTask.bind(this)} index={i}/>
        });

        return <section className="wrapper">
            <ConfigPanel s_view={s_view}/>

            <div className={viewNode}>
                <section className="panel row">
                    <div className="panel-heading">
                        <div className='panel-title'>二维码</div>
                    </div>
                    <div className="panel-wrapper">
                        {codeNodes}
                    </div>
                </section>
            </div>
        </section>
    }
}

class QRcodePanel extends Component{
    constructor(props){
        super(props);
        this.state={
            qrcode:"/img/fail.png",
            con_data: this.props.con_data,
            index:this.props.index,
        };
    }

    onIntervalTask(i){
        this.props.onIntervalTask(i);
    }

    render(){
        function formatDate(d) {
            let Y=d.getFullYear() + '-';
            let M=(d.getMonth()+1 < 10 ? '0'+(d.getMonth()+1) : d.getMonth()+1) + '-';
            let D=(d.getDate()< 10 ? '0' + (d.getDate()) : d.getDate()) + ' ';
            let h=(d.getHours()< 10 ? '0' + d.getHours() : d.getHours()) + ':';
            let m=(d.getMinutes() <10 ? '0' + d.getMinutes() : d.getMinutes()) + ':';
            let s=(d.getSeconds() <10 ? '0' + d.getSeconds() : d.getSeconds());
            return Y+M+D+h+m+s;
        }

        const {qrcode,index,con_data:{id, product, price, image, timestamp, status}}=this.state;
        let ts = new Date(parseInt(timestamp));
        let btnNode = status ? "disabled" : "";
        return <div className="col-xs-4 col-sm-2 col-lg-1 code-box">
            <section className="panel row">
                <div className="panel-heading row">
                    <span className="pull-left"><strong>{id}</strong> {pd_map[product]}</span>
                    <span className="pull-right text-danger"><strong>{price}</strong></span>
                </div>
                <div className="panel-body form-horizontal">
                    <div className="form-group text-center">
                        <img src={image ? image : qrcode} className="img-thumbnail"/>
                    </div>
                    <div className="form-group">
                        <h6><small>{timestamp ? formatDate(ts) : "未开始"}</small></h6>
                        {status ? <CountDown time={120}/> : ""}
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

class ConfigPanel extends Component{
    constructor(props){
        super(props);
    }


    render() {
        const {list,start,s_view} = this.props;
        let inputNode = list.map((d,i)=>{
            // console.log(d);
            return <ConfigInput key={i} index={i} con_data={d} handleState={this.handleState.bind(this)}/>
        });

        let btnNode = !start ? <a className="btn btn-success btn-sm" href="javascript:void(0);" onClick={this.onStartBatchTask.bind(this)}>
            <i className="fa fa-play"/> 全部开始
        </a> : <a className="btn btn-danger btn-sm" href="javascript:void(0);" onClick={this.onStopBatchTask.bind(this)}>
            <i className="fa fa-stop"/> 全部结束
        </a>;

        let panelNode = <div className="col-lg-3">
            <section className="panel">
                <div className='panel-heading'>
                    <div className="panel-title">
                        设置
                    <span className='pull-right'>
                        {btnNode}
                        {/*<a className="btn btn-primary btn-sm" onClick={this.onSaveAllConfig.bind(this)}>全部开始</a>*/}
                    </span>
                    </div>
                </div>
                <div className='panel-body row'>
                    {inputNode}
                </div>
            </section>
        </div>;
        if(s_view){
            panelNode = <div className="col-lg-1">
                <section className="panel">
                    <div className='panel-heading'>
                        <div className="panel-title">
                            {btnNode}
                            {/*<a className="btn btn-primary btn-sm" onClick={this.onSaveAllConfig.bind(this)}>全部开始</a>*/}
                        </div>
                    </div>
                    <div className='panel-body row'>
                        {inputNode}
                    </div>
                </section>
            </div>;
        }
        return <div>{panelNode}</div>
    }
}

class ConfigInput extends Component{
    constructor(props){
        super(props);
        this.state={
            index:this.props.index
        }
    }

    // 修改值
    onChangeValue(type,id){
        const {index} = this.state;
        this.setState({[type]:id});
        this.props.handleState(type,index,id)
    }

    // 修改帐号
    onChangeAccount(id){
        const {index} = this.state;
        let account = $(`account_${id}`).val();
        console.log(account);
        if(account != ""){
            this.props.handleState("account",index,account)
        }else{
            alert("输入的数据有误")
        }
    }

    render(){
        const {con_data:{id,product,price,account}} = this.props;
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
                <input id={`account_${id}`} type="text" className="form-control input-sm" defaultValue={account}/>
                <div className="input-group-btn">
                    <a className="btn btn-success btn-sm" onClick={this.onChangeAccount.bind(this,id)}><i className="fa fa-play"/> 开始</a>
                </div>
            </div>
        </div>
    }
}

class CountDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {time: this.props.time};
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            time: this.state.time - 1
        });
        if(this.state.time <=0){
            clearInterval(this.timerID);
        }
    }

    render() {
        return <h6><small>{this.state.time}</small></h6>
    }
}

ReactDOM.render(
    <MainPanel /> ,
    document.getElementById('main-content')
);