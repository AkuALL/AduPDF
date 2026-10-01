import Auth from './Auth'
import Settings from './Settings'
import Admin from './Admin'
import FacilityController from './FacilityController'
import ReservationController from './ReservationController'
import PetugasReservationController from './PetugasReservationController'
import ReportController from './ReportController'
import ReportAttachmentController from './ReportAttachmentController'
import PetugasReportController from './PetugasReportController'
import PetugasDashboardController from './PetugasDashboardController'
const Controllers = {
    Auth: Object.assign(Auth, Auth),
Settings: Object.assign(Settings, Settings),
Admin: Object.assign(Admin, Admin),
FacilityController: Object.assign(FacilityController, FacilityController),
ReservationController: Object.assign(ReservationController, ReservationController),
PetugasReservationController: Object.assign(PetugasReservationController, PetugasReservationController),
ReportController: Object.assign(ReportController, ReportController),
ReportAttachmentController: Object.assign(ReportAttachmentController, ReportAttachmentController),
PetugasReportController: Object.assign(PetugasReportController, PetugasReportController),
PetugasDashboardController: Object.assign(PetugasDashboardController, PetugasDashboardController),
}

export default Controllers