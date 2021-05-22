import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthService, NbRegisterComponent } from '@nebular/auth';
import { UserInfo } from '@challenge90days/api-interfaces';
import { AngularFireAuth } from '@angular/fire/auth';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'challenge90days-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends NbRegisterComponent implements OnInit {
  userCollection: AngularFirestoreCollection<UserInfo>;
  registerForm: FormGroup;
  showSpinner = false
  duration = 4000;
  nameLimit = {
    min: 1,
    max: 30
  }
  passwordLimit = {
    min: 6,
    max: 30
  }

  constructor(
    private authService: NbAuthService,
    private roter: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private toastrService: NbToastrService,
  ) {
    super(authService, {}, changeDetectorRef, roter)
    this.userCollection = firestore.collection<any>('user');
  }
  ngOnInit(): void {
    this.initForm()
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(this.nameLimit.min), Validators.maxLength(this.nameLimit.max)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(this.passwordLimit.min), Validators.maxLength(this.passwordLimit.max)]],
    })
  }

  getControl(formControlName: string): AbstractControl {
    return this.registerForm.get(formControlName)
  }

  register(): void {
    this.showSpinner = true;
    this.submitted = true;
    this.authService.register('password', this.registerForm.value).subscribe(e => {
      console.log(e)
      const userId = e.getResponse().user.uid
      this.addUserInfo(userId)
      this.auth.user.subscribe(e => e.sendEmailVerification())
    })

  }

  addUserInfo(userId: string): void {
    const data: UserInfo = {
      userId: userId,
      name: this.registerForm.get('name').value,
      email: this.registerForm.get('email').value
    }
    this.userCollection.add(data).then((e) => {

      this.toastrService.success(`Hi ${data.name} 😀,請至你的信箱驗證驗證帳號`, '註冊成功!', { duration: this.duration })
      setTimeout(() => {
        this.router.navigate(['/'])
      }, this.duration);

    });
  }
}
