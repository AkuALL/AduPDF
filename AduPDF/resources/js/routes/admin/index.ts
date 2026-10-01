import users from './users'
import password from './password'
import verifications from './verifications'
import facilities from './facilities'
const admin = {
    users: Object.assign(users, users),
password: Object.assign(password, password),
verifications: Object.assign(verifications, verifications),
facilities: Object.assign(facilities, facilities),
}

export default admin