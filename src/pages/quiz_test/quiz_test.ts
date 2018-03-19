import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular'; 
import { Quiz } from '../../models/quiz';
import { QuizProvider} from '../../providers/quiz-provider';
import { Quiz_Result } from '../../pages/quiz_result/quiz_result';
import { ToastController } from 'ionic-angular';
import { Home } from '../../pages/home/home';
import { LoadingController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { PopoverPage} from '../../pages/popover/popover';
import { GlobalVars } from '../../providers/global-provider';
import { Observable } from 'rxjs/Rx';
import { FormatTimePipe } from '../formatTime.pipe';
import {Subscription} from "rxjs";
import {TimerObservable} from "rxjs/observable/TimerObservable";

@Component({
    templateUrl: 'quiz_test.html',
    selector: ' quiz-test',
    providers: [QuizProvider]

})

export class Quiz_Test {

    selected_class_id: number
    selected_standard: string
    selected_section: string
    selected_subject: string
    selected_subject_id: any
    question_no: number = 0;
    quiz_studnt_quiz: Quiz[];
    quiz1_studnt_quiz: Quiz[];
    studnt_quiz: Quiz;
    loader: any;
    parm_class_id: any;
    token: string;
    id:number;
    countDown;
    counter = 1800 //30*60;
    tick = 1000;
    //  private tick: string;

    private subscription: Subscription;
    
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public globalVars: GlobalVars,
        public quizProvider: QuizProvider, public toastController: ToastController,
        public alertCtrl: AlertController, public loadingController: LoadingController,
        public popoverCtrl: PopoverController) {

        this.quiz_studnt_quiz = new Array < Quiz > ();
        this.selected_class_id = navParams.get('parm_class_id');
        this.selected_standard = navParams.get('parm_standard');
        this.selected_section = navParams.get('parm_section');
        this.selected_subject = navParams.get('parm_subject');
        this.selected_subject_id = navParams.get('parm_subject_id');

        this.loading();
        this.token   = this.globalVars.getMyGlobalToken();       
        this.id = this.globalVars.getMyGlobalUserId();

        this.countDown = Observable.timer(0, this.tick)
        
            .take(this.counter )
            .map(() => --this.counter)

       let timer = TimerObservable.create(0, this.tick);
       this.subscription = timer.subscribe(t => {  this.counter;
                                                                  
             if(this.counter == 1){
                 this.freeze()
              }  
                   
           });

        this.fetchquestions(this.selected_class_id, this.selected_subject_id, this.token, this.id);
       
     }
   
    fetchquestions(selected_class_id: number, selected_subject_id: string, token:string, id:number) {

        this.quizProvider
            .getQuestions(selected_class_id, this.selected_subject_id, token, id)
            .subscribe(res => {
                    this.quiz1_studnt_quiz = < Quiz[] > res, this.loader.dismiss(), this.successToastreturn()
                },
                err => {
                    this.errorToast(), this.loader.dismiss()
                });

    }

    freeze(){
      if(this.counter !== 1){
          let alert = this.alertCtrl.create({
                message: 'Time Out',
                
                buttons: [{
                    text: 'Save',
                    handler: () => {
                        this.navCtrl.push(Quiz_Result, {
                        parm_quiz_data: this.quiz_studnt_quiz  });
                    }
                }]
               
            });
            alert.present();
      }
        else if(this.counter ==1){
             
        let alert = this.alertCtrl.create({
                message: 'Time Out',
                buttons: [{
                    text: 'Ok',
                    }]
               
            });
            alert.present();
             this.navCtrl.push(Quiz_Result, {
            parm_quiz_data: this.quiz_studnt_quiz
        });
        }
        
        
    }


    loading() {
        this.loader = this.loadingController.create({
            content: "Please wait"
        });
        this.loader.present();
    }

    successToastreturn() {
              
        for (let num of this.quiz1_studnt_quiz) {
          
            this.studnt_quiz = new Quiz();

            this.question_no = this.question_no + 1
            this.studnt_quiz.answer = num.answer
            this.studnt_quiz.questions = num.questions
            this.studnt_quiz.option1 = num.option1
            this.studnt_quiz.option2 = num.option2
            this.studnt_quiz.option3 = num.option3
            this.studnt_quiz.option4 = num.option4
            this.studnt_quiz.q_no = this.question_no;
            this.studnt_quiz.subject = num.subject
            this.studnt_quiz.checked = num.checked
            this.studnt_quiz.class_id = num.class_id
            this.quiz_studnt_quiz.push(this.studnt_quiz);
           
             
        }
        console.log("q.no" + this.question_no)
       
        let toast = this.toastController.create({
            message: "Questions loaded",
            duration: 1000,
            position: 'bottom'
        });
        toast.present();
    }

    errorToast() {
        let toast = this.toastController.create({
            message: "Record not loaded",
            duration: 1000,
            position: 'middle'
        });
        toast.present();
    }

    submit() {
     
        this.navCtrl.push(Quiz_Result, {
            parm_quiz_data: this.quiz_studnt_quiz
        });
    }
    
    home() {
        this.navCtrl.push(Home);
        this.navCtrl.setRoot(Home);
    }

    presentPopover(myEvent) {

        let popover = this.popoverCtrl.create(PopoverPage, {

        });

        popover.present({
            ev: myEvent
        });

    }

}