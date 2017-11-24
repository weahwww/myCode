/**
 * Created by weahwww on 2017/2/7.
 * 省份选择插件
 */

/**
 * 使用方法:
 * 在app中使用
    import AreaSelect from '../plug-in/AreaSelect.jsx';
 * 导入插件
 *
 * Html代码中使用
     <AreaSelect onAreaSelect={this.getAreaCode.bind(this)} area_name={'当前使用的模块名称'}/>
 * 引用子组件
 * 并且增加一个函数
     getAreaCode(area){
        console.log(area);
     }
 * 调取选择的值
 */

import React from 'react';
import $ from 'jquery';

class AreaSelect extends React.Component {
    constructor(props) {
        super(props);
        let {area_name} = this.props;
        let name = area_name || '';
        this.state={
            name,
            hot_cn:[
                {code:'HA',name:'河南'},
                {code:'GD',name:'广东'},
                {code:'HE',name:'河北'},
                {code:'JS',name:'江苏'},
                {code:'SC',name:'四川'},
                {code:'HN',name:'湖南'}
            ],
            main_cn:[
                {title: '', data: [
                    {code:'',name:'全部'},
                    {code:'CN',name:'全国'}]},
                {title: '华北', data:[
                    {code:'BJ',name:'北京'},
                    {code:'TJ',name:'天津'},
                    {code:'HE',name:'河北'},
                    {code:'SX',name:'山西'},
                    {code:'NM',name:'内蒙'}]},
                {title:'华东',data:[
                    {code:'SH',name:'上海'},
                    {code:'JS',name:'江苏'},
                    {code:'ZJ',name:'浙江'},
                    {code:'AH',name:'安徽'},
                    {code:'FJ',name:'福建'},
                    {code:'SD',name:'山东'}]},
                {title:'华南', data:[
                    {code:'GD',name:'广东'},
                    {code:'GX',name:'广西'},
                    {code:'HI',name:'海南'},
                    {code:'HK',name:'香港'},
                    {code:'TW',name:'台湾'}]},
                {title:'华中',data:[
                    {code:'JX',name:'江西'},
                    {code:'HA',name:'河南'},
                    {code:'HB',name:'湖北'},
                    {code:'HN',name:'湖南'}]},
                {title:'西南',data:[
                    {code:'CQ',name:'重庆'},
                    {code:'SC',name:'四川'},
                    {code:'GZ',name:'贵州'},
                    {code:'YN',name:'云南'},
                    {code:'XZ',name:'西藏'}]},
                {title:'西北',data:[
                    {code:'SN',name:'陕西'},
                    {code:'GS',name:'甘肃'},
                    {code:'QH',name:'青海'},
                    {code:'NX',name:'宁夏'},
                    {code:'XJ',name:'新疆'}]},
                {title:'东北',data:[
                    {code:'LN',name:'辽宁'},
                    {code:'JL',name:'吉林'},
                    {code:'HL',name:'黑龙江'}]}
            ]
        }
    }

    onShowAreaList(e) {
        $(`#province_${this.state.name}`).show();
        $(document).one('click', () => {
            $(`#province_${this.state.name}`).hide();
        });
        e.stopPropagation();
    }

    getAreaCode(code,name){
        this.props.onAreaSelect(code);
        $(`#area_${this.state.name}`).val(name);
        $(`#province_${this.state.name}`).hide();
    }

    render() {
        let hot_cn_Nodes=this.state.hot_cn.map(({code,name}, i)=>{
            return <dd key={i}><a href='javascript:void(0);' onClick={this.getAreaCode.bind(this,code,name)}>{name}</a></dd>
        });
        let main_cn_Nodes=this.state.main_cn.map(({title,data},index)=>{
            let dt_Nodes = (title=='') ? null: (<dt>{title}: </dt>);

            let dd_Nodes=data.map(({code,name},i)=>{
                return <dd key={i}><a href='javascript:void(0);' onClick={this.getAreaCode.bind(this,code,name)}>{name}</a></dd>
            });
            return <dl key={index} className='clearfix'>
                {dt_Nodes}
                {dd_Nodes}
            </dl>
        });
        return <div>
            <input id={`area_${this.state.name}`} type='text' className='form-control' readOnly defaultValue='' onClick={this.onShowAreaList.bind(this)}/>
            <div id={`province_${this.state.name}`} className='province_list'>
                <dl className='hot_province'>
                    <dt>常用:</dt>
                    {hot_cn_Nodes}
                </dl>
                <div className='province_detail clearfix'>
                    {main_cn_Nodes}
                </div>
            </div>
        </div>
    }
}
export default AreaSelect;