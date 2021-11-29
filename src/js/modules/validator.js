export default class Validator {
    constructor(formSelector) {
        this.form = $(formSelector);
        this.select = $(".js-select");
        this.selectError = $(".js-select-error");
        this.password = $("#password");
        this.passwordConfirm = $("#passwordconfirm");
        this.email = $("#email");
        this.checkbox = $("#checkbox");
        this.checkboxError = $("#checkbox-error");
        this.errors = $(".input__error");
        this.passwordTest = /^(?=\D*\d)(?=.*?[a-zA-Z]).*[\W_].*$/;
        this.emailTest = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    }

    init() {
        this.form.on("submit", (e) => {
            e.preventDefault();

            this.validationName();
            this.validationRequire();
            this.validationPassword();
            this.validationEmail();
            this.validationCheckbox();
            if (!this.errors.hasClass("visible")) {
                //submit form
                alert("Form sent successfully!");
            } else {
                setTimeout(() => {
                    this.errors.removeClass("visible");
                    this.checkboxError.removeClass("error");
                }, 4000)
            }
        })
    }

    validationName() {
        $(".validation-name").each((index, elem) => {
            let input = $(elem);
            let error = input.closest(".input").find(".input__error");

            if (input.val().length < 2) {
                error.addClass("visible");
            } else {
                error.removeClass("visible");
            };
        });
    }

    validationRequire() {
        if (!this.select.hasClass("selected")) {
            this.selectError.addClass("visible");
        } else {
            this.selectError.removeClass("visible");
        };
        $(".validation-require").each((index, elem) => {
            let input = $(elem);
            let error = input.closest(".input").find(".input__error");

            if (input.val().length === 0) {
                error.addClass("visible");
            } else {
                error.removeClass("visible");
            };
        });
    }

    validationPassword() {
        let passwordVal = this.password.val();
        let passwordConfirmVal = this.passwordConfirm.val();
        let passwordError = $(".password-error");
        let passwordConfirmError = $(".passwordconfirm-error");

        if (!this.passwordTest.test(passwordVal)) {
            passwordError.addClass("visible");
        } else {
            passwordError.removeClass("visible");
        };

        if (passwordConfirmVal !== passwordVal || passwordConfirmVal === "") {
            passwordConfirmError.addClass("visible");
        } else {
            passwordConfirmError.removeClass("visible");
        };
    }

    validationEmail() {
        let emailError = $(".email-error");
        if (!this.emailTest.test(this.email.val())) {
            emailError.addClass("visible");
        } else {
            emailError.removeClass("visible");
        }
    }

    validationCheckbox() {
        if (!this.checkbox.prop("checked")) {
            this.checkboxError.addClass("error");
        } else {
            this.checkboxError.removeClass("error");
        }
    }
}