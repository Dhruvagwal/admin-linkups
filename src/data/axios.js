import axios from 'axios'
 
const NGROK = "http://12e6de20b861.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

