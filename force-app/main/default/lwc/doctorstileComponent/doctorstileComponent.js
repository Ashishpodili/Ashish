import { LightningElement ,api} from 'lwc';

export default class DoctorstileComponent extends LightningElement {
   @api doctor;

   handleClick(event) {
console.log("Slected tile :"+ this.doctor.Id);

    // 1. Prevent default behavior of anchor tag click which is to navigate to the href url
    event.preventDefault();
   //passing the custom event inplace of url
    const selectEvent = new CustomEvent('select', {
        detail: this.doctor.Id
       
    });
    // 3. Fire the custom event
    this.dispatchEvent(selectEvent);
}
}