import { LightningElement ,api,track} from 'lwc';
import getAllReviews from '@salesforce/apex/DoctorsFetchClass.getAllReviews'
//import { NavigationMixin } from 'lightning/navigation';
export default class DoctorReviews extends LightningElement {
     // Private
     @track doctorId;
     error;
     @track doctorReviews;
     @track isLoading = false;
     
     // Getter and Setter to allow for logic to run on recordId change
     get recordId() {
         return this.doctorId;
     }
     @api
     set recordId(value) {
         //sets doctorId attribute
         this.setAttribute('doctorId', value);        
         //sets doctorId assignment
         this.doctorId = value;      
         //get reviews associated with doctorId
         this.getReviews();
     }
     
     // Getter to determine if there are reviews to display
     get reviewsToShow() {
         return this.doctorReviews !== undefined && this.doctorReviews != null && this.doctorReviews.length > 0;
     }
     
     // Public method to force a refresh of the reviews invoking getReviews
     @api
     refresh() {
         this.getReviews();
     }
     
     // Imperative Apex call to get reviews for given doctor
     // returns immediately if doctorId is empty or null
     // sets isLoading to true during the process and false when it’s completed
     // Gets all the Reviews from the result, checking for errors.
     getReviews() {
         
        this.isLoading = true;
             getAllReviews({doctorId:this.doctorId})
             .then((result) => {
                 this.doctorReviews = result;
                 this.error = undefined;
                // console.log("The doctor Id:"+doctorId);
                 //console.log("Result:"+JSON.stringify(result));
                 console.log("doctor reviews are: " + JSON.stringify(this.doctorReviews));
             }).catch((error) => {
                 this.error = error;
             })
             
            
     }
     
}