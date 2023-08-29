import { LightningElement ,track,api,wire} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import authenticateUser from '@salesforce/apex/DoctorsFetchClass.listOfDoctors'
export default class LoginForm extends NavigationMixin(LightningElement) {
  
    @api username = '';
    @track password = '';
    @track error = '';
    @track isloginpage = true;
    @track result = [];
    @track doctor;
    @track loggedDoctor;
   // @track isnavigateToPage = false;
    handleUsernameChange(event) {
        this.username = event.target.value;
        console.log(this.username);
    }

    handlePasswordChange(event) {
        this.password = event.target.value;
        console.log(this.password);
    }
    @wire(authenticateUser)
    users({data,error}){
        if(data){
            this.result = data;
            this.error = undefined;
            console.log("The result is:"+JSON.stringify(this.result));
        }
        else if(error){
            this.result = undefined;
            this.error = error
            console.log("The error is:"+JSON.stringify(this.error));
        }
    }
    handleLogin() {
      
        try {
           
            // console.log('the result is: ' + JSON.stringify(this.result));
            // if( this.username ==   this.result.Email__c && this.password == this.result.Password__c) {
                this.loggedDoctor = this.result.find((item) => item.Email__c ==  this.username && item.Password__c == this.password);
                console.log("The logged doctor is:"+JSON.stringify(this.loggedDoctor));
                 if(this.loggedDoctor){
                     this.doctor = this.loggedDoctor.Name;
                 }
                  console.log("Thedoctor is:"+this.doctor)
           
            this.isloginpage=false;
         
           
            
             
        } catch (error) {
            this.error = 'Invalid credentials';
            console.log("An error occurred");
        }
        
    }

            // Redirect to a different page on successful login
            //
            // this.navigateToPage=true;
            
            // connectedCallback(){
              
            //         authenticateUser()
            //           .then((result) => {
            //             this.result = result;
            //             console.log("The result is"+JSON.stringify(this.result));
            //             if (this.result == 'Success') {
           
            //                 this.isloginpage=false;
            //             }
            //           })
            //           .catch((error) => {
            //             this.error = error;
            //           });
            //       }
              
       
    
handleLogout() {
    window.location.reload()
 if(window.location.reload()){
    this.isloginpage=true;
 }
 
}
    // navigateToPage() {
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__navItemPage',
    //         attributes: {
    //             apiName: 'ListOfAppointments'
    //         }
    //     });
    // }
}

