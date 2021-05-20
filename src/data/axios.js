import axios from 'axios'
 
const NGROK = "http://853dfc1aec6d.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

