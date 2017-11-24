/**
 * Created by weahwww on 2017/2/8.
 * 日期时间选择插件
 */

/**
 * 使用方法:
 * 在app中使用
     import DateRange from '../plug-in/DateRange.jsx';
 * 导入插件
 * 自定义参数:
 * 在constructor的this.state中添加start_date, end_date
 * start_date       #开始日期时间,可选,默认值为前一天
 * end_date         #结束日期时间,可选,默认为今天
 * format           #日期格式,可选,不填则为"YYYY/MM/DD HH:mm:ss"
 * 如果使用自定义参数,需要在app头部导入moment组件
    import moment from 'moment';
 * Html代码中使用
     <DateRange getDateRange={this.getDateRange.bind(this)} start_date={this.state.start_date} end_date={this.state.end_date} format/>
 * 引用子组件
 * 并且增加一个函数
     getDateRange(start,end){
        console.log(start,end);
     }
 * 调取选择的值
 */

import React,{Component} from 'react';
import moment from 'moment';
import DateRangePicker from 'bootstrap-daterangepicker';

class DateRange extends Component {
    constructor(props) {
        super(props);
        this.state={
            format:'YYYY/MM/DD HH:mm:ss',                                               //默认格式
            start_time: moment().subtract(1,'days').format('YYYY/MM/DD HH:mm:ss'),     //字符串格式必须是 'YYYY-MM-DD'
        	end_time: moment().format('YYYY/MM/DD HH:mm:ss'),                         //字符串格式必须是 'YYYY-MM-DD'
        };
    }

    getDateRange(start,end){
        this.props.getDateRange(start,end);
    }

    compile() {
        let {start_date, end_date, format} = this.props;
        let f = format || this.state.format;
        let startDate= start_date || this.state.start_time;
        let endDate = end_date || this.state.end_time;
        $('#DateRange').daterangepicker({
            ranges: {
                '今天': [moment().startOf('day'), moment().startOf('day').add(1, 'days')],
                '昨天': [moment().startOf('day').subtract(1, 'days'), moment().startOf('day')],
                '最近7天': [moment().startOf('day').subtract(6, 'days'), moment().startOf('day').add(1, 'days')],
                '最近30天': [moment().startOf('day').subtract(29, 'days'), moment().startOf('day').add(1, 'days')],
                '本月': [moment().startOf('month'), moment().startOf('month').add(1, 'month')],
                '上月': [moment().startOf('month').subtract(1, 'month'), moment().startOf('month')]
            },
            opens: 'left',
            separator: ' - ',
            startDate: startDate,
            endDate: endDate,
            minDate: '2014/01/01',
            maxDate: '2025/12/31',
            timePicker: true,
            timePickerIncrement: 10,
            timePicker24Hour: true,
            alwaysShowCalendars: true,
            locale: {
                format: f,
                applyLabel: '确认',
                cancelLabel: '取消',
                fromLabel: '从',
                toLabel: '至',
                customRangeLabel: '自定义',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                firstDay: 1
            },
            showWeekNumbers: false
        }, (start, end) => {
            let s = moment(start).format(f);
            let e = moment(end).format(f);
            $('#DateRangeStart').val(s);
            $('#DateRangeEnd').val(e);
            this.getDateRange(s,e);
        });
    }

    componentDidMount() {
        this.compile();
    }

    render() {
        return <div>
            <input id='DateRange' type='text' className='form-control' />
            <input id='DateRangeStart' type='hidden' defaultValue={this.state.start_time}/>
            <input id='DateRangeEnd' type='hidden' defaultValue={this.state.end_time}/>
        </div>
    }
}

export default DateRange;