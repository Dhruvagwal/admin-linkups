import countryCodeData from './countryCode.json'
import useLocation from 'hooks/useLocation'

const countryCode = async () => {
    const countryName = await useLocation()
    const {dial_code} = countryCodeData.filter(item=>item.name===countryName)[0]
    return dial_code
}

export default countryCode
