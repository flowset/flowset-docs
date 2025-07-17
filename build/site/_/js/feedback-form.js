(function () {
    const forms = document.querySelectorAll('.feedback-form');

    forms.forEach(formContainer => {
        formContainer.classList.add('feedback-form_visible');
        let elements;
        try {
            elements = findElements( formContainer, [
                { name: 'vote', selector: 'vote' },
                { name: 'yesBtn', selector: 'btn_yes' },
                { name: 'noBtn', selector: 'btn_no' },
                { name: 'success', selector: 'success' },
                { name: 'error', selector: 'error-message' },
                { name: 'form', selector: 'form' },
                { name: 'emailInput', selector: 'email-input' },
                { name: 'messageInput', selector: 'message-input' },
                { name: 'submitBtn', selector: 'submit' },
            ]);
        } catch (e) {
            logError(e);
            return;
        }
        const vote = elements.vote;
        const yesBtn = elements.yesBtn;
        const noBtn = elements.noBtn;
        const form = elements.form;
        const successMsg = elements.success;
        const errorMsg = elements.error;
        const hideAll = function() {
          hideForm();
          hideSuccessMsg();
          hideVote();
          hideErrorMsg();
        };
        const showVote = function() {
            hideAll();
            vote.classList.add('feedback-form__vote_visible');
        };
        const hideVote = function() {
            vote.classList.remove('feedback-form__vote_visible');
        };
        const showSuccessMsg = function() {
            hideAll();
            successMsg.classList.add('feedback-form__success_visible');
        };
        const hideSuccessMsg = function() {
            successMsg.classList.remove('feedback-form__success_visible');
        }
        const showErrorMsg = function() {
            hideAll();
            errorMsg.classList.add('feedback-form__error-message_visible');
        }
        const hideErrorMsg = function() {
            errorMsg.classList.remove('feedback-form__error-message_visible');
        }
        const showForm = function() {
            hideAll();
            form.classList.add('feedback-form__form_visible');
        };
        const hideForm = function() {
            form.classList.remove('feedback-form__form_visible');
        };
        const turnOnPreloader = function(btn) {
            btn.classList.add('feedback-form__btn_loading');
            btn.disable = true;
        }
        const turnOffPreloader = function (btn) {
            btn.classList.remove('feedback-form__btn_loading');
            btn.disable = false;
        }

        showVote();
        yesBtn.addEventListener('click', function() {
            const endpoint = yesBtn.dataset.link;
            const page = getCurrentPage();
            turnOnPreloader(yesBtn);
            fetch(`${endpoint}?page=${page}`)
                .then(function(response) {
                    turnOffPreloader(yesBtn);
                    if (response.ok) {
                        showSuccessMsg();
                    } else {
                        showErrorMsg();
                    }
                })
                .catch(function(error) {
                    turnOffPreloader(yesBtn);
                    showErrorMsg();
                    logError(error);
                });
        });
        noBtn.addEventListener('click', function() {
            showForm();
        });
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formEl = form.querySelector('form');
            const endpoint = formEl.action;
            const emailInput = elements.emailInput;
            const messageInput = elements.messageInput;
            const submitBtn = elements.submitBtn;
            const email = emailInput.value;
            const message = messageInput.value;
            const page = getCurrentPage();
            turnOnPreloader(submitBtn);
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    page: page,
                    email: email,
                    message: message
                })
            })
                .then(function(response) {
                    turnOffPreloader(submitBtn);
                    if (response.ok) {
                        showSuccessMsg();
                    } else {
                        showErrorMsg();
                    }
                })
                .catch(function(error) {
                    turnOffPreloader(submitBtn);
                    logError(error);
                    showErrorMsg();
                });
        });
    });

    function findElements(container, elements) {
        const result = {};
        elements.forEach(element => {
            const el = container.querySelector(`.feedback-form__${element.selector}`);
            if (!el) {
                throw new Error(`${element.name} not found`)
            }
            result[element.name] = el;
        });
        return result;
    }

    function logError(message) {
        console.error(`Feedback-form ${message}`);
    }

    function getCurrentPage() {
        return window.location.pathname;
    }
})()
