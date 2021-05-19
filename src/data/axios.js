import axios from 'axios'
 
const NGROK = "http://5be22cd54e35.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

