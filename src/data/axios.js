import axios from 'axios'
 
const NGROK = "http://97860e9fdc76.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

