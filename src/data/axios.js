import axios from 'axios'
 
const NGROK = "http://54594862c208.ngrok.io"
const instances = axios.create({
    baseURL:`${NGROK}/mainlinkupsadmin/us-central1`
})

export default instances

