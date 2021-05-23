import axios from 'axios'
 
const NGROK = "http://d62d8142d44e.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

