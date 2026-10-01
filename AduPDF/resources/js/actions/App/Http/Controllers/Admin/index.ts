import AccountManagementController from './AccountManagementController'
import PasswordController from './PasswordController'
import FacilityManagementController from './FacilityManagementController'
const Admin = {
    AccountManagementController: Object.assign(AccountManagementController, AccountManagementController),
PasswordController: Object.assign(PasswordController, PasswordController),
FacilityManagementController: Object.assign(FacilityManagementController, FacilityManagementController),
}

export default Admin