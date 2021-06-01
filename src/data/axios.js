import axios from 'axios'
 
const NGROK = "http://e84900bec9e2.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

