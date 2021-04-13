import moment from 'moment'
//传递第二个参数自定义时间格式
export default function formateDate(time, option) {
    if (!time) {
        return ''
    } else if (option) {
        time = Number(time)
        return moment(time).format(option);
    }
    time = Number(time)
    return moment(time).format("YYYY-MM-DD h:mm:ss")

}