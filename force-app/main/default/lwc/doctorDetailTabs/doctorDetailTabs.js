import { LightningElement ,wire,api,track} from 'lwc';
import NAME_FIELD from '@salesforce/schema/Doctor__c.Name'
import PICTURE_URL_FIELD from '@salesforce/schema/Doctor__c.ProfilePicLink__c'
import EMAIL from '@salesforce/schema/Doctor__c.Email__c'
import PHONE from '@salesforce/schema/Doctor__c.Phone__c'
import SPECIALITY from '@salesforce/schema/Doctor__c.Speciality__c'
import AVAILABILITY from '@salesforce/schema/Doctor__c.Availability__c'
import STATUS from '@salesforce/schema/Doctor__c.Status__c'
// getFieldValue function is used to extract field values
import {getFieldValue} from 'lightning/uiRecordApi'

   //import BOATMC from the message channel
import DOCTORDETAILS from '@salesforce/messageChannel/DoctorMessageChannel__c';
 //Import message service features required for subscribing and the message channel
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
   
   
export default class DoctorDetailTabs extends LightningElement {
    //exposing fields to make them available in the template
   
    phone = PHONE; 
    email = EMAIL;
    status = STATUS;
    //speciality = SPECIALITY;
    Availability = AVAILABILITY;
   // @track StatusAvailable
   //  fields displayed with specific format
    @api doctorName
    PictureUrl
    speciality
    
    //Availability
    @api recordId;

    //Initialize messageContext for Message Service
    @wire(MessageContext)
    messageContext;
    
    handleRecordLoaded(event){
        const {records} = event.detail
        const recordData = records[this.recordId]
        this.doctorName = getFieldValue(recordData,NAME_FIELD)
        console.log(this.doctorName);
        this.PictureUrl = getFieldValue(recordData, PICTURE_URL_FIELD)
        this.speciality = getFieldValue(recordData, SPECIALITY)
        //this.status = getFieldValue(recordData, STATUS)
        //this.Availability = getFieldValue(recordData, AVAILABILITY)
    }
//     
    // Private
    subscription = null;
    
   // Encapsulate logic for Lightning message service subscribe and unsubsubscribe
   subscribeToMessageChannel() {
    if (!this.subscription) {
        this.subscription = subscribe(
            this.messageContext,
            DOCTORDETAILS,
            (message) => this.handleMessage(message),
            { scope: APPLICATION_SCOPE }
        );
    }
}

unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
}

// Handler for message received by component
handleMessage(message) {
    if(message){
        this.recordId = message.recordId;
        console.log("THe message received:",this.recordId);
    }
    
}

// Standard lifecycle hooks used to subscribe and unsubsubscribe to the message channel
connectedCallback() {
    this.subscribeToMessageChannel();
}

disconnectedCallback() {
    this.unsubscribeToMessageChannel();
}
    
   
    
    
    // Navigates back to the review list, and refreshes reviews component
    //handleReviewCreated() {
        //this.template.querySelector('lightning-tabset').activeTabValue = 'reviews';
        //this.template.querySelector('c-doctor-reviews').refresh();
   // }
}