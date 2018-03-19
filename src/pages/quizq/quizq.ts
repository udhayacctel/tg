import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController, ToastController,PopoverController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { GlobalVars } from '../../providers/global-provider';
import { Quizzr } from '../../models/quizzr';
import { Quizz } from '../quizz/quizz';
import { PopoverPage } from '../../pages/popover/popover';
import { QuizProv } from '../../providers/quiz';
import { FormBuilder, FormArray, FormGroup, Validators,FormControl } from '@angular/forms';



@Component({
    templateUrl: 'quizq.html',
    selector: 'quizq-page'
})
export class Quizq {

    parm_start_date:any;
    parm_end_date :any;
    parm_title :any;
    parm_quiz_type :any;
    parm_description:any;
    parm_duration_mins:number;
    parm_attempts_allowed :number;
    question_number:number;
    quiz: Quizzr[]
    quizz : Quizzr = new Quizzr();
    token:string;
    id:number;
    loader:any;
    question: any;
   // answer:any="";
    explanation:any;
   // newItem: string = "";
  //toggleNew: boolean = false;
  //  todos:string[]= this.getTodos();
    public form: FormGroup;

    constructor(public navCtrl: NavController, navParams: NavParams,  public alertCtrl: AlertController,
        public globalVars: GlobalVars,public toastController: ToastController, public popoverCtrl:PopoverController,
        public quizProvider: QuizProv,public loadingController: LoadingController,private FB : FormBuilder){


            this.token   = this.globalVars.getMyGlobalToken();
            this.id = this.globalVars.getMyGlobalUserId();
            this.quiz = new Array <Quizzr>()
 
            this.parm_start_date       = navParams.get('parm_start_date');
            this.parm_end_date         = navParams.get('parm_end_date');
            this.parm_title            = navParams.get('parm_title');
            this.parm_quiz_type        = navParams.get('parm_quiz_type');
            this.parm_description      = navParams.get('parm_description')
            this.parm_duration_mins    = navParams.get('parm_duration_mins');
            this.parm_attempts_allowed = navParams.get('parm_attempts_allowed')
              
            
        /*    this.form = this.FB.group({
                answers       	  : ['', Validators.required],
                options     : this.FB.array([
                   this.initAnswerFields()
                ])
             });*/

             this.form = new FormGroup({
                question: new FormControl('', Validators.required), 
                explanation: new FormControl('', Validators.required), 
             //   isRightAnswer: new FormControl('', Validators.required),                 
               /* answers: new FormArray([
                    this.initAns(),
                ]),  */                               
                options: new FormArray([
                  //new FormControl(''),

                   this.initAns(),
            
                ]),
                
              });
            
    

}

 initAns(){

   return new FormGroup({

   // answer: new FormControl(),
     options: new FormControl(''),
     isRightAnswer : new FormControl()
   })
 }

  get options(): FormArray { return this.form.get('options') as FormArray;}
  
  

  addOption() { 
      
   // this.options.push(new FormControl();
     this.options.push(this.initAns());

}

  remove(i : number) : void{

    const control = <FormArray>this.form.controls.options;
    control.removeAt(i);
 

}

/*get answers(): FormArray { return this.form.get('answers') as FormArray; }



addAnswer() { 
  
    const control = <FormArray>this.form.controls.answers;
        control.push(this.initAns());    
  //  this.answers.push(this.initAns());


}
//addAnswer() { this.answers.push(new FormControl());}


  removeAnswer(i : number) : void{

    const control = <FormArray>this.form.controls.answers;
    control.removeAt(i);
    
}*/

//get answers(): FormArray { return this.form.get('answers') as FormArray; }




/*initAnswerFields() : FormGroup
{
   return this.FB.group({
      answers 		: ['', Validators.required]
   });
}



addNewInputField() : void
{
   const control = <FormArray>this.form.controls.options;
   control.push(this.initAnswerFields());
}



 
removeInputField(i : number) : void
{
   const control = <FormArray>this.form.controls.options;
   control.removeAt(i);
}
*/
loading() {
    this.loader = this.loadingController.create({
        content: "Please wait"
    });
    this.loader.present();
}

    
  
successToastreturn() {
    
            let toast = this.toastController.create({
                message: "Record updated",
                duration: 1000,
                position: 'middle'
            });
            toast.present();
        }
    
        errorToast(msg) {
    
            let toast = this.toastController.create({
                message: msg,
                duration: 1000,
                position: 'middle'
            });
            toast.present();
    
        }

    onSubmit(){
        
           
         let quiz: Quizzr[] =new Array <  Quizzr >();

         
         let quizz: Quizzr = new Quizzr();

         quizz.title                = this.parm_title
         quizz.description          = this.parm_description
         quizz.quiz_type            = this.parm_quiz_type
         quizz.start_date           = this.parm_start_date
         quizz.end_date             = this.parm_end_date
         quizz.duration_mins        = this.parm_duration_mins
         quizz.attempts_allowed     = this.parm_attempts_allowed
         quizz.randomize            = true
         quizz.question_number      = 1
         quizz.question             = this.form.value.question
         quizz.sequence_number      = 1
         quizz.answer_type          = "Multi choice"
         quizz.correct_answer_count = 2
         quizz.explanation          = this.form.value.explanation      
         quizz.answer               = this.form.value.options
         quizz.is_right_answer      = this.form.value.isRightAnswer
         quizz.attempt_id           = 1
        
         quiz.push(quizz)       
    
        this.QuizAdd(quiz, this.parm_quiz_type,this.token, this.id)

        console.log(this.parm_title +this.parm_description + this.parm_quiz_type 
        + this.parm_start_date  + this.parm_end_date +  this.parm_duration_mins +  this.parm_attempts_allowed
     + this.form.value.question + this.form.value.explanation + this.form.value.options + this.form.value.isRightAnswer)
  //  }
}



        QuizAdd(Quiz: Quizzr[], quiz_type:string, token:string, id:number) {

            this.quizProvider
           .addQuiz(Quiz, quiz_type, token, id)
           .subscribe(res => {
          /* this.resetForm(),*/ this.loader.dismiss(), this.successToastreturn()
            },
           err => {
           this.loader.dismiss(), this.errorToast('Record not updated')
    });
}

  /*   resetForm(){

         this.question    = ""
         this.answer      = [""]
         this.explanation = ""
     }*/
    
        presentPopover(myEvent) {
            
                    let popover = this.popoverCtrl.create(PopoverPage, {
            
                    });
            
                    popover.present({
            
                        ev: myEvent
            
                    });
            
         }            
}


