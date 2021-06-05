import axios from 'axios'
 
const NGROK = "https://us-central1-mainlinkupsadmin.cloudfunctions.net"
const instances = axios.create({
    baseURL:`${NGROK}`
})

export default instances

