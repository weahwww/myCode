/**
 * Created by weahwww on 2017/2/8.
 * 分页插件
 */

/**
 * 使用方法:
 * 在app中使用
    import PageIndex from '../plug-in/PageIndex.jsx';
 * 导入插件
 * 在constructor的this.state中添加page,max,per_page
 * page     #当前页
 * max      #最大页数
 * per_page #可选,显示的页数,默认为4
 *
 * Html代码中使用
     <PageIndex onPageIndex={查询接口函数.bind(this)} page={this.state.page} max={this.state.max} per_page={this.state.per_page} />
 * 引用子组件
 * 查询接口函数必须在第一个参数使用page
 */

import React,{Component} from 'react';

class PageIndex extends Component{
    constructor(props) {
        super(props);
    }

    onClickPage(page_index) {
        this.props.onPageIndex(page_index);
    }

    render()  {
        let {page,max,per_page,className} = this.props;
        if(!per_page){
            per_page = 4;
        }
        if (page === null || max === null) {
            return null;
        }

        let page_start = page - per_page > 0 ? page - per_page : 1;
        let page_end = page + per_page > max ? max : page + per_page;

        let page_index_list = [];
        for (let i = page_start; i <= page_end; ++i) {
            page_index_list.push(i);
        }

        let pageIndexBtnBodes = page_index_list.map((i, index) => {
            let type = (i === page) ? 'btn btn-primary' : 'btn btn-default';
            return <a key={`pageIndexBtnBodes_${index}`} className={type} onClick={this.onClickPage.bind(this,i)}>{i}</a>
        });

        let backwardDisabled = (page <= 1) ? 'btn btn-default disabled' : 'btn btn-default';
        let forwardDisabled = (page >= max) ? 'btn btn-default disabled' : 'btn btn-default';

        return <div className={`${className} row`}>
            <div className='col-sm-12'>
                <div className='btn-row dataTables_filter'>
                    <div id='page_group' className='btn-group'>
                        <a className={backwardDisabled} onClick={this.onClickPage.bind(this,1)}>
                            <i className='fa fa-fast-backward'/>
                        </a>
                        <a className={backwardDisabled} onClick={this.onClickPage.bind(this,page-1)}>
                            <i className='fa fa-backward'/>
                        </a>
                        {pageIndexBtnBodes}
                        <a className={forwardDisabled} onClick={this.onClickPage.bind(this,page+1)}>
                            <i className='fa fa-forward'/>
                        </a>
                        <a className={forwardDisabled} onClick={this.onClickPage.bind(this,max)}>
                            <i className='fa fa-fast-forward'/>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default PageIndex;