/**
* PHP Email Form Validation - v3.11
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
// (function () {
//   "use strict";

//   let forms = document.querySelectorAll('.php-email-form');

//   forms.forEach( function(e) {
//     e.addEventListener('submit', function(event) {
//       event.preventDefault();

//       let thisForm = this;

//       let action = thisForm.getAttribute('action');
//       let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
//       if( ! action ) {
//         displayError(thisForm, 'The form action property is not set!');
//         return;
//       }
//       thisForm.querySelector('.loading').classList.add('d-block');
//       thisForm.querySelector('.error-message').classList.remove('d-block');
//       thisForm.querySelector('.sent-message').classList.remove('d-block');

//       let formData = new FormData( thisForm );

//       if ( recaptcha ) {
//         if(typeof grecaptcha !== "undefined" ) {
//           grecaptcha.ready(function() {
//             try {
//               grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
//               .then(token => {
//                 formData.set('recaptcha-response', token);
//                 php_email_form_submit(thisForm, action, formData);
//               })
//             } catch(error) {
//               displayError(thisForm, error);
//             }
//           });
//         } else {
//           displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
//         }
//       } else {
//         php_email_form_submit(thisForm, action, formData);
//       }
//     });
//   });

//   function php_email_form_submit(thisForm, action, formData) {
//     fetch(action, {
//       method: 'POST',
//       body: formData,
//       headers: {'X-Requested-With': 'XMLHttpRequest'}
//     })
//     .then(response => {
//       if( response.ok ) {
//         return response.text();
//       } else {
//         throw new Error(`${response.status} ${response.statusText} ${response.url}`); 
//       }
//     })
//     .then(data => {
//       thisForm.querySelector('.loading').classList.remove('d-block');
//       if (data.trim() == 'OK') {
//         thisForm.querySelector('.sent-message').classList.add('d-block');
//         thisForm.reset(); 
//       } else {
//         throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action); 
//       }
//     })
//     .catch((error) => {
//       displayError(thisForm, error);
//     });
//   }

//   function displayError(thisForm, error) {
//     thisForm.querySelector('.loading').classList.remove('d-block');
//     thisForm.querySelector('.error-message').innerHTML = error;
//     thisForm.querySelector('.error-message').classList.add('d-block');
//   }

// })();

(function () {
  "use strict";

  const forms = document.querySelectorAll('.php-email-form');

  forms.forEach((form) => {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const thisForm = this;

      // Required elements
      const loading = thisForm.querySelector('.loading');
      const errorMessage = thisForm.querySelector('.error-message');
      const sentMessage = thisForm.querySelector('.sent-message');

      // Show loading state
      loading.classList.add('d-block');
      errorMessage.classList.remove('d-block');
      sentMessage.classList.remove('d-block');

      // Prepare form data
      const formData = new FormData(thisForm);

      // Send POST request (no custom headers to avoid preflight)
      fetch(thisForm.action, {
        method: 'POST',
        body: formData,
        credentials: 'omit' // no cookies needed for cross-origin
      })
      .then(async response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        loading.classList.remove('d-block');
        if (data.status === 'success') {
          sentMessage.classList.add('d-block');
          thisForm.reset();
        } else {
          throw new Error(data.message || 'Unknown error occurred');
        }
      })
      .catch((error) => {
        loading.classList.remove('d-block');
        errorMessage.textContent = error.message;
        errorMessage.classList.add('d-block');
        console.error('Error:', error);
      });
    });
  });
})();
