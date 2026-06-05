import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
    standalone: true,
    selector: 'login',
    templateUrl: './login.component.html',
    imports: [FormsModule, RouterLink],
})
export class LoginComponent {

    email = '';
    password = '';
    errorMessage = '';

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit() {
        this.errorMessage = '';

        this.authService.login(this.email, this.password).subscribe((error) => {
            if (error) {
                this.errorMessage = error;
                return;
            }
            this.router.navigate(['/pokemon/all']);
        });
    }
}
