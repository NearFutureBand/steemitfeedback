var bootstrapMin, golosJs, sweetAlert, gAuth, gFeedbackApi, gPollsStyle, gFeedbackWidth, gFeedbackLink, gFeedbackContainer;

bootstrapMin = document.createElement('link');
bootstrapMin.rel = 'stylesheet';
bootstrapMin.type = 'text/css';
bootstrapMin.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css';
(document.head || document.documentElement).appendChild(bootstrapMin);

golosJs = document.createElement('script');
golosJs.src = 'https://cdn.jsdelivr.net/npm/golos-js@0.6.1/dist/golos.min.js';
(document.head || document.documentElement).appendChild(golosJs);

sweetAlert = document.createElement('script');
sweetAlert.src = 'https://unpkg.com/sweetalert2@7.15.0/dist/sweetalert2.all.js';
(document.head || document.documentElement).appendChild(sweetAlert);

gAuth = document.createElement('script');
gAuth.src = 'https://golosimages.com/auth.js';
(document.head || document.documentElement).appendChild(gAuth);

gLang = document.createElement('script');
gLang.src = 'https://golosimages.com/lang.js';
(document.head || document.documentElement).appendChild(gLang);

gApi = document.createElement('script');
gApi.src = 'https://golosfeedback.com/js/api.js';
(document.head || document.documentElement).appendChild(gApi);

gFeedbackContainer = document.createElement('div');
gFeedbackContainer.className = 'card border-primary mb-3';
gFeedbackContainer.innerHTML = `<div class="card-header"><img src="https://golosfeedback.com/graphics/logo.svg" width="25" height="25" class="d-inline-block align-top" alt=""><a href="https://golosfeedback.com/" target="_blank">GolosFeedback.com</a></div><div class="card-header-right"><p></p></div><div class="card-body text-dark"></div></div>`;
//document.querySelector('.gFeedback').style.width = gFeedbackWidth;
document.querySelector('.gFeedback').appendChild(gFeedbackContainer);// div inject