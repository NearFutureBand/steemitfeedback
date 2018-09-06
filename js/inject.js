var ckeditor, moment, bootstrapMin, styleInject, golosJs, sweetAlert, gAuth, gFeedbackApi, gFeedbackWidth, gFeedbackContainer , bootstrapNativeGithub, bootstrapNativeCloudflare, i18next, i18nextBackend, i18nextBrowserLD;


ckeditor = document.createElement('script');
ckeditor.src = 'https://cdn.ckeditor.com/ckeditor5/10.0.0/classic/ckeditor.js';
(document.head || document.documentElement).appendChild(ckeditor);

moment = document.createElement('script');
moment.src = 'https://cdn.jsdelivr.net/npm/moment@2.21.0/min/moment.min.js';
(document.head || document.documentElement).appendChild(moment);

bootstrapMin = document.createElement('link');
bootstrapMin.rel = 'stylesheet';
bootstrapMin.type = 'text/css';
bootstrapMin.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css';
(document.head || document.documentElement).appendChild(bootstrapMin);

bootstrapNativeGithub = document.createElement('script');
bootstrapNativeGithub.src = 'https://thednp.github.io/bootstrap.native/dist/bootstrap-native-v4.min.js';
(document.head || document.documentElement).appendChild(bootstrapNativeGithub);

bootstrapNativeCloudflare = document.createElement('script');
bootstrapNativeCloudflare.src = 'https://cdn.jsdelivr.net/npm/bootstrap.native@2.0.22/dist/bootstrap-native-v4.min.js';
(document.head || document.documentElement).appendChild(bootstrapNativeCloudflare);

bootstrapMin = document.createElement('link');
bootstrapMin.rel = 'stylesheet';
bootstrapMin.type = 'text/css';
bootstrapMin.href = 'https://golosfeedback.com/css/style.css';
(document.head || document.documentElement).appendChild(bootstrapMin);

styleInject = document.createElement('link');
styleInject.rel = 'stylesheet';
styleInject.type = 'text/css';
styleInject.href = 'https://golosfeedback.com/css/styleInject.css';
(document.head || document.documentElement).appendChild(styleInject);

i18next = document.createElement('script');
i18next.src = 'https://cdn.jsdelivr.net/npm/i18next@11.2.3/i18next.min.js';
(document.head || document.documentElement).appendChild(i18next);

i18nextBackend = document.createElement('script');
i18nextBackend.src = 'https://cdn.jsdelivr.net/npm/i18next-xhr-backend@1.5.1/i18nextXHRBackend.min.js';
(document.head || document.documentElement).appendChild(i18nextBackend);

i18nextBrowserLD = document.createElement('script');
i18nextBrowserLD.src = 'https://cdn.jsdelivr.net/npm/i18next-browser-languagedetector@2.2.0/i18nextBrowserLanguageDetector.min.js';
(document.head || document.documentElement).appendChild(i18nextBrowserLD);

golosJs = document.createElement('script');
golosJs.src = 'https://cdn.rawgit.com/epexa/cd0cb942eabe09f1cb4c9143c4c04418/raw/golos.min.js';
(document.head || document.documentElement).appendChild(golosJs);

sweetAlert = document.createElement('script');
sweetAlert.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@7.19.1/dist/sweetalert2.all.min.js';
(document.head || document.documentElement).appendChild(sweetAlert);

gAuth = document.createElement('script');
gAuth.src = 'https://golospolls.com/auth.js';
(document.head || document.documentElement).appendChild(gAuth);

gLang = document.createElement('script');
gLang.src = 'https://golosimages.com/lang.js';
(document.head || document.documentElement).appendChild(gLang);

gApi = document.createElement('script');
gApi.src = 'https://golosfeedback.com/js/api.js';
(document.head || document.documentElement).appendChild(gApi);

window.addEventListener('load', function() { // init script after page loaded
    
    /*setting testnet parameters*/
    golos.config.set('websocket', 'wss://ws.testnet.golos.io');
    golos.config.set('address_prefix', 'GLS');
    golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');
    
    /*creating of the html structure for the injecting GolosFeedback*/
    gFeedbackContainer = document.createElement('div');
    gFeedbackContainer.className = 'modal fade modal-lg-golos-feedback';
    gFeedbackContainer.setAttribute('id','golos-feedback-container');
    gFeedbackContainer.setAttribute('tabindex','-1');
    gFeedbackContainer.setAttribute('role','dialog');
    gFeedbackContainer.setAttribute('aria-labelledby','GolosFeedback');
    gFeedbackContainer.setAttribute('aria-hidden','true');
    gFeedbackContainer.innerHTML = '<div class="modal-dialog modal-lg .modal-dialog-centered"><div class="modal-content golos-feedback-container"></div></div>';
    document.querySelector('body').appendChild(gFeedbackContainer);
    
    var modalStructure = document.getElementById('golos-feedback-container');
    var gFeedbackModalWindow = new Modal(modalStructure, {
        content: '<div class="card"><div class="card-header"><img src="https://golosfeedback.com/graphics/logo.png" width="25" height="25" class="d-inline-block align-top" alt=""><a href="https://golosfeedback.com/" target="_blank">GolosFeedback.com</a></div><div class="card-header-right"><button class="btn btn-primary gFbtn-add-fb"><span class="icon-forward"></span> Add feedback</button><button class="btn btn-success" id="golos-urls"><span class="icon-box-add"></span> Get my feedbacks</button></div><div class="card-body text-dark"><div class="gFwrapper"></div></div></div>',
        keyboard: false
    });
    
    /*creating button-toggler*/
    let button = document.createElement('button');
    button.className = 'btn btn-primary modal-golos-feedback-toggler';
    button.setAttribute('type','button');
    button.setAttribute('data-toggle','modal');
    button.setAttribute('data-target','#golos-feedback-container');
    button.innerHTML = ' Open Golos Feedback';
    
    /*function*/
    var createDefaultGFeedbackOptions = function(
        corner_ = 'right', 
        buttonTextColor_ = '#fff',
        buttonBackgroundColor_ = '#0079a1',
        buttonShadow_ = true
    ) {
        return gFeedbackOptions = {
            corner: corner_,
            buttonTextColor: buttonTextColor_,
            buttonBackgroundColor: buttonBackgroundColor_,
            buttonShadow: buttonShadow_
        };
    }
    
    /*definig undefined variable with customizable options*/
    if (window.gFeedbackOptions === undefined) {
        var gFeedbackOptions = createDefaultGFeedbackOptions();
    } else {
        var gFeedbackOptions = createDefaultGFeedbackOptions();
    }
    
    /*Applying parameters*/
    
    if(gFeedbackOptions.corner == 'right') {
        button.style.right = '3%';
    } else if (gFeedbackOptions.corner == 'left') {
        button.style.left = '3%';
    }
    
    if(gFeedbackOptions.buttonShadow) {
        button.style.boxShadow = '2px 2px 2px rgba(0,0,0,.5)';
    }
    
    button.style.color = gFeedbackOptions.buttonTextColor;
    button.style.backgroundColor = gFeedbackOptions.buttonBackgroundColor;
    
    /*the end of applying parameters*/
    
    /*placing the button on its place*/
    document.querySelector('body').appendChild(button);
    
    /*controller for the button*/
    document.querySelector('.modal-golos-feedback-toggler').addEventListener('click', function(){
        gFeedbackModalWindow.toggle();
    });    
    
    /*launch the main building algorythm of injecting GolosFeedback*/
    initGolosFeedback();
    
    // event for btn add feedback
    document.querySelector('.' + prefix + 'btn-add-fb').addEventListener('click', function(){
        openAddFbForm();
    });
    
    // event for getMyFeedbacks button
    document.getElementById('golos-urls').addEventListener('click', function() {
        this.dispatchEvent(new Event("modalopen"));
        modalAuth.show();
    });
    window.addEventListener("modalopen", function(){
        console.log('modalopen');
        gFeedbackModalWindow.hide();
    });
});