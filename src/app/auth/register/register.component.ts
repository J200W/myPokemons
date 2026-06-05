import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
    standalone: true,
    selector: 'register',
    templateUrl: './register.component.html',
    imports: [FormsModule, RouterLink],
})
export class RegisterComponent {

    email = '';
    password = '';
    confirmPassword = '';
    username = '';
    errorMessage = '';

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit() {
        this.errorMessage = '';

        if (this.password !== this.confirmPassword) {
            this.errorMessage = 'Les mots de passe ne correspondent pas.';
            return;
        }

        this.authService.register(this.email, this.password, this.username).subscribe((message) => {
            if (message) {
                this.errorMessage = message;
                return;
            }
            this.router.navigate(['/pokemon/all']);
        });
    }
}
