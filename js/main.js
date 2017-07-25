(function () {
    'use strict';

    const people = [];
    const blockedUsers = [];

    class User {
        constructor(username, password, name, surname, email) {
            this.username = username;
            this.password = password;
            this.name = name;
            this.surname = surname;
            this.email = email;
        }

        /**
         * @description Gets and boolean if an username is blocked.
         * @returns {boolean} true if the user is blocked.
         */
        isBlockedUser() {
            let foundUser = false;
            blockedUsers.forEach((user) => {
                if(user.username.localeCompare(this.username) === 0) {
                    foundUser = true;
                }
            });
            return foundUser;
        }

        existUser() {
            let foundUser = false;
            people.forEach((user) => {
                if(user.username.localeCompare(this.username) === 0) {
                    foundUser = true;
                }
            });
            return foundUser;
        }

        /**
         * Results:
         * 0 - Not exist user and password.
         * 1 - The session is valided.
         * 2 - The password is incorrect.
         * 3 - The username is incorrect.
         * @returns result {number}
         */
        validSession() {
            let result = 0;
            let sameUsername = false;
            let samePassword = false;
            people.forEach((user) => {
                if(user.username.localeCompare(this.username) === 0) {
                    sameUsername = true;
                }
                if(user.password.localeCompare(this.password) === 0) {
                    samePassword = true;
                }
                if(sameUsername && samePassword) {
                    result = 1;
                }
                if(sameUsername && !samePassword) {
                    result = 2;
                }
                if(!sameUsername && samePassword) {
                    result = 3;
                }
            });
            return result;
        }

        createAccount() {
            if (!this.existUser()){
                people.push(this);
                toastr.success('Usuario se creó exitosamente.','Servidor');
                cleanFields();
            } else {
                toastr.warning('El usuario ya existe.','Servidor');
            }
        }
    }

    /**
     * @description Init the listeners for buttons
     */
    const initButtons = () => {
        document.getElementById('signin-button').addEventListener('click', () => {
            const username = document.getElementById('user').value;
            const password = document.getElementById('pw').value;
            const email = document.getElementById('email').value;
            const name = document.getElementById('name').value;
            const surname = document.getElementById('surname').value;
            const user = new User(username, password, name, surname, email);
            user.createAccount();
        });
        document.getElementById('login-button').addEventListener('click', () => {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const user = new User();
            user.username = username;
            user.password = password;
            if(user.isBlockedUser()) {
                toastr.error('El usuario está bloqueado.','Servidor');
            } else {
                if (!user.isBlockedUser()){
                    switch(user.validSession()){
                        case 1:
                            toastr.success('Inicio de sesión correcta', 'Servidor');
                            break;
                        case 2:
                            toastr.warning('La constraeña no coincide.','Servidor');
                            break;
                        case 3:
                            toastr.warning('El usuario es incorrecto.','Servidor');
                            break;
                        case 0:
                            toastr.warning('El usuario y contraseña son incorrectas.','Servidor');
                            break;
                    }
                } else {
                    toastr.warning('El usuario está bloqueado.','Servidor');
                }
            }
        });
    };

    /**
     * @description Reset all the fields
     */
    const cleanFields = () => {
        document.getElementById('user').value = '';
        document.getElementById('pw').value = '';
        document.getElementById('email').value = '';
        document.getElementById('name').value = '';
        document.getElementById('surname').value = '';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    };

    /**
     * @description Gets a random array of 50 elements from randomuser.me
     */
    const initBlockedPeople = () => {
        fetch('https://randomuser.me/api/?results=50')
            .then(request => {
                return request.json();
            })
            .then(data => {
                data.results.forEach(result => {
                    console.log(result.login.username);
                    blockedUsers.push(new User(result.login.username, result.login.password, result.name.first, result.name.last, result.email));
                });
            })
            .catch(error => {
                console.log(error);
                toastr.warning('No se pudo cargar los usuarios bloqueados','Servidor remoto');
            });
    };

    (function () {
        initButtons();
        initBlockedPeople();
    })();
})();
