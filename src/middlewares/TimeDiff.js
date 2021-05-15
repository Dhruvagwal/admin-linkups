import moment from 'moment'
export default function(a, b){
  return moment().startOf('hour').fromNow();
}