import axios from 'axios'
 
const NGROK = "http://68b964f9afaf.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

