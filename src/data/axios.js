import axios from 'axios'
 
const NGROK = "http://e9a64cb6da60.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

