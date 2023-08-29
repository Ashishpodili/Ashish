import { LightningElement ,track,wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import TotalAppointments from '@salesforce/apex/DoctorsFetchClass.listOfAppointments';


export default class DashboardComponent extends NavigationMixin(LightningElement) {
    @track confirmed=0;
    @track completed=0;
    @track active=0;

@wire(TotalAppointments)
appointments;

navigateListOfAppointmentsTab() {
    console.log('navigateListOfAppointmentsTab');
    this[NavigationMixin.Navigate]({
        type: 'standard__navItemPage',
        attributes: {
            apiName: 'ListOfAppointments'
        }
    });
}
navigateListOfPatientsTab() {
    console.log('navigateListOfPatientsTab');
    this[NavigationMixin.Navigate]({
        type: 'standard__navItemPage',
        attributes: {
            apiName: 'ListOfPatients'
        }
    });
}
navigateToHome() {
    // Use the built-in 'Navigate' method
    this[NavigationMixin.Navigate]({
        // Pass in pageReference
        type: 'standard__namedPage',
        attributes: {
            pageName: 'home'
        }
    });
}
navigateListOfDoctorsTab() {
    console.log('navigateListOfDoctorsTab');
    this[NavigationMixin.Navigate]({
        type: 'standard__navItemPage',
        attributes: {
            apiName: 'ListOfDoctors'
        }
    });
}
}