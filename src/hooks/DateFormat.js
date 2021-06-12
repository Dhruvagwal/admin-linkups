import Month from 'data/Month'
import moment from 'moment'
export default (date)=>{
    var date = moment(date).format('MM-DD-YYYY')
    return `${parseInt(date.slice(0,2))}-${Month[parseInt(date.slice(3,5))-1]}-${date.slice(6,10)}`
}