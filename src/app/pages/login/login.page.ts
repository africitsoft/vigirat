import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = "";
  password: string = "";
  toast: any;
  const: any;
  loginForm: FormGroup;

  error_messages = {
    'email': [
      { type: 'required', message: 'Email obligatoire' },
      { type: 'pattern', message: 'Donnez une adresse email valide' }
    ],
    'password': [
      { type: 'required', message: 'Mot de passe obligatoire' },
    ]
  }

  constructor(public afAuth: AngularFireAuth,
    private loadingController: LoadingController,
    private nav: NavController,
    private toastController: ToastController,
    private alertController: AlertController,
    public formBuilder: FormBuilder) {

    this.loginForm = this.formBuilder.group({
      password: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });



  }

  ngOnInit() {
  }

  async login() {
    const { email, password } = this;

    const loading = await this.loadingController.create({
      message: 'Connexion...'
    });
    await loading.present();

    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((returnedUser) => {
        loading.dismiss();
        this.nav.navigateBack('home');
      })
      .catch((err) => {
        loading.dismiss();
        this.showToast();
      })
  }


  showToast() {
    this.toast = this.toastController.create({
      message: 'Compte inexistant, veuillez créer un compte !',
      duration: 2000
    }).then((toastData) => {
      console.log(toastData);
      toastData.present();
    });
  }
  HideToast() {
    this.toast = this.toastController.dismiss();
  }


  async  showAlertResetPassword() {
    const alert = await this.alertController.create({
      header: 'Mot de passe oublié',
      message: 'La procedure de réinitialisation de mot de passe vient d\'être envoyé sur votre adresse e-mail',
      buttons: ['OK']
    });

    await alert.present();
  }


  async  showAlertCreateAcompte() {
    const alert = await this.alertController.create({
      header: 'Nouveau compte',
      message: 'Cliquez sur ce lien pour créer votre compte \n \n <a href="https://backoffice.vigirat.com">https://backoffice.vigirat.com</a>',
      buttons: ['OK']
    });

    await alert.present();
  }


}