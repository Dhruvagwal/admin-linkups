import axios from 'axios'
 
const NGROK = "http://7d8f5d3645f5.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

