import axios from 'axios'
 
const NGROK = "http://5990fc35d4db.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

