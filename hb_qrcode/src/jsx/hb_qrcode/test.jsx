import React,{Component} from 'react';
import ReactDOM from 'react-dom';

class MainPanel extends Component{
    constructor(){
        super();
        this.state={
            list: [
                {id:"1",product:"",price:"",phone:"",interval:"600000",img:"",timestamp:"",status:false},
                {id:"2",product:"",price:"",phone:"",interval:"600000",img:"",timestamp:"",status:false}
            ]
        }
    }

    handle(data) {
        $.post('/api/qrcode/submit',JSON.stringify(data))
            .done((d) => {
                const {msg} = JSON.parse(d);
                if(msg === 'ok'){
                    // list[i].img = img;
                    data.status = true;
                    data.product = "100yuan";
                    data.price = "100";
                    data.phone = "12332342";
                    data.timestamp = new Date().getTime();
                    data.img = "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1569462993,172008204&fm=5";
                    return data
                }else{
                    alert('加载二维码错误');
                }
            })
            .fail(() => {
                alert('加载二维码异常');
            });
    }

    start(i) {
        let data = this.state.list[i];
        let d = this.handle(data);
        this.setState({list:d})
    }

    render(){
        let qrNode = <div className="col-sm-1">
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
        </div>;

        return <div><a className="btn btn-primary" href="javascript:void(0);" onClick={this.start.bind(this,0)}>生成</a></div>
    }
}

ReactDOM.render(
    <MainPanel/>,
    document.getElementById('main-content')
);