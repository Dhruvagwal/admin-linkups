import moment from 'moment'
export default function(posted){
  const startDate = new Date(posted)
  const endDate = new Date()
  var minutes = (endDate.getTime() - startDate.getTime()) / 60000;
  if (minutes < 60){
    return {diff:`${Math.floor(minutes)} minutes ago`, minutes}
  }
  else if (minutes>=60 && minutes<60*24){
    return {diff:`${Math.floor(minutes/60)} hours ago`, minutes}
  }
  else if (minutes>=60*24){
    return {diff:`${Math.floor(minutes/(24*60))} day ago`, minutes}
  }
}