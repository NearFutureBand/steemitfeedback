class SteemitFeedback {
    constructor() {
        this.className = GFCLASS;
        this.setBootstrapStructure();
        this.domain = (location.hostname == "")? 'localhost' : location.hostname;
        this.setTestnetWebsocket();
        
        
        this.navbar2 = new Filter();
        this.formAddFb = new FormAddFeedback(this.navbar2.tabs, this.domain);
        this.hashController = new HashController(this.navbar2.tabs);
        this.feedbacks = [];
        this.customUsername = null;
    }
    
    init() {
        this.setNavigationBar();
        
        //this.initLang('en');
        this.setFooter();
        this.setPaddingsForFeedbackContainer();
        this.navbar2.init();
        this.addStaticEventListeners();
        this.loadFbs();
    }
    
    getThisEl() {
        return document.querySelector(`.${this.className}`);
    }
    
    addStaticEventListeners() {
        
        this.getThisEl().addEventListener('reloadFeedbacks', () => {
            this.formAddFb.delete();
            this.reloadFbs();
        });
        
        this.getThisEl().addEventListener('expandFb', (e) => {
            this.expandFb(e.detail.id);
        });
        
        document.querySelector(`.${this.className} .button-about`).addEventListener('click', () => {
            swal({
                title: `About!`,
                html: `<p class="float-left text-left">
	                       GolosFeedback - is a microservice on the blockchain <a target="_blank" href="https://golos.io">Golos</a> that allows you to manage all the messages with ideas, offers and problems from your clients or users. This platform is a thin client, that works without a backend (only frontend and blockchain) directly on the GitHub Pages (through CloudFlare).
	                   </p>
	                   <ul class="float-left text-left">
	                       We use:
	                       <li><a target="_blank"  href="https://github.com/GolosChain/golos-js">Golos.js</a> - the JavaScript API for Golos blockchain;</li>
	                       <li><a target="_blank" href="https://github.com/twbs/bootstrap">Bootstrap</a> - the most popular HTML, CSS, and JavaScript framework for developing responsive, mobile first projects on the web;</li>
	                       <li><a target="_blank" href="http://www.dropzonejs.com">Dropzone</a> - DropzoneJS is an open source library that provides drag’n’drop file uploads with image previews;</li>
	                       <li><a target="_blank" href="https://github.com/lipis/flag-icon-css">Flag-icon-css</a> - a collection of all country flags in SVG;</li>
	                       <li><a target="_blank" href="https://github.com/padolsey/findAndReplaceDOMText">FindAndReplaceDOMText</a> - searches for regular expression matches in a given DOM node and replaces or wraps each match with a node or piece of text that you can specify;</li>
	                       <li><a target="_blank" href="https://www.i18next.com">I18next</a> - is an internationalization-framework written in and for JavaScript;</li>
	                       <li><a target="_blank" href="https://github.com/ipfs/js-ipfs-api">Js-ipfs-api</a> - a client library for the IPFS HTTP API, implemented in JavaScript;</li>
	                       <li><a target="_blank" href="https://github.com/limonte/sweetalert2">SweetAlert2</a> - a beautiful, responsive, customizable, accessible replacement for JavaScript's popup boxes.</li>
	                   </ul>`,
                type: 'info',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-success btn-lg',
                confirmButtonText: 'Cool!',
                position: 'top',
                showCloseButton: true
            });    
        });
        
        let buttonMyFeedbacks = document.querySelector(`.${this.className} .button-get-my-feedbacks`);
        buttonMyFeedbacks.addEventListener('click', () => {
            auth( () => {
                this.removeFbs();
                if( buttonMyFeedbacks.getAttribute('data-mode') == 'my') {
                    this.customUsername = username;
                    buttonMyFeedbacks.setAttribute('data-mode', 'all');
                    buttonMyFeedbacks.querySelector('span.label').innerHTML = 'Get all feedbacks';
                } else {
                    this.customUsername = null;
                    buttonMyFeedbacks.setAttribute('data-mode', 'my');
                    buttonMyFeedbacks.querySelector('span.label').innerHTML = 'Get my feedbacks';
                }
                this.loadFbs();
            }, ['posting']);
        });
        
        document.querySelector(`.${this.className} .button-add-feedback`).addEventListener('click', () => {
            this.removeFbs();
            this.formAddFb.place();
        });
        
        document.querySelector(`.${this.className} .button-integration`).addEventListener('click', () => {
            swal({
                title: 'About Integration!',
                html: `
                    <div class="text-left">
                    1. Add JavaScript in your HTML-page: 
                    <pre><code>&lt;script src=&quot;https://golosfeedback.com/js/inject.js&quot;&gt;&lt;/script&gt;</code></pre>
                    2. Script adds all the necessary resources to deploy GolosFeedback to your website or applicaion. All the interface of our service will be placed into a modal window with special button-toggler. The button will be added to your page above all content so everybody always be able to interact with GolosFeedback.<br>
                    3. You can set different options of the microservice by passing some additional parameters. All that you need is to create special variable with the name of 'gFeedbackOptions'. Check out this example: 
                    <div class="text-left"><pre><code>
&lt;script&gt;
var gFeedbackOptions = {
    corner: 'right',
    buttonTextColor: '#fff',
    buttonBackgroundColor: '#0079a1',
    buttonShadow: true,
    zIndex: 7
}
&lt;/script&gt;
&lt;script src="https://golosfeedback.com/js/inject.js"&gt;&lt;/script&gt;
                    </code></pre>
                    </div>
                    4. Visit this <a style="color:lightblue" href="integration_example.html">integration example</a> to see how it works!
                    </div>
                `,
                type: 'info',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-success btn-lg',
                confirmButtonText: '<span class="icon-checkmark"></span> Cool!',
                position: 'top',
                showCloseButton: true
            })
        });
                                                                                          
        document.querySelector(`.${this.className} .button-support`).addEventListener('click', () => {
            swal({
                html: `
                    <div class="text-left"><h3><strong>If you have any ideas / problems / questions, you can report it:</strong></h3></div>
                    <div class="text-left">
                        <p>1. On GitHub in Issues: <strong><a href="https://github.com/NearFutureBand/golosfeedback/issues" target="_blank"> https://github.com/NearFutureBand/golosfeedback/issues</a></strong></p>
                        <p>2. On e-mail:<strong><a href="info@golosfeedback.com" target="_blank"> info@golosfeedback.com</a></strong></p>
                    </div>`,
                showCloseButton: true,
                width: 600,
                type: 'question'
            })
        });
        
        document.querySelector(`.${this.className} .navigation .toggler`).addEventListener('click', () => {
            let buttonsBlock = document.querySelector(`.${this.className} .navigation .buttons`);
            if( buttonsBlock.style.display == 'block') buttonsBlock.style.display = 'none';
            else buttonsBlock.style.display = 'block';
            
        });
    }
    
    loadFbs() {
        this.navbar2.resetCounters();
        
        var query = {
            select_tags: ['fb', this.domain ],
            select_authors: ['test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9'],
            limit: 100
        };
        
        if(this.customUsername != null) {
            query.select_authors = [this.customUsername];
        }
        
        golos.api.getDiscussionsByBlog(query, (err, result) => {
            console.log(err, result);
            
            if ( ! err) {
                if( result.length != 0) {
                    result.forEach( fb => {
                        if( this.filterFb(fb) ) {
                            this.createFb(fb);
                        }
                    });
                    
                    if(this.feedbacks.length == 0) this.createEmptyFb();
                } else {
                    this.createEmptyFb();
                }
                this.placeFbs();
            } else {
                console.error(err);
                ErrorController.showError(err.message);
            }
            
            VFX.hideVFX();
        });
        
    }
    reloadFbs() {
        this.removeFbs();
        this.loadFbs();
    }
    getOneFb(feedback) {
        
        golos.api.getContent(
            feedback.author,
            feedback.permlink,
            1000,
            (err, result) => {
                console.log(err, result);
                if ( ! err) {
                    this.createFb(result);
                    this.placeFbs();
                    this.feedbacks[0].expand();
                } else {
                    console.error(err);
                    ErrorController.showError(err.message);
                }
            }
        );
    }
    
    placeFbs() {
        if(this.feedbacks.length != 0) {
            this.feedbacks.forEach( fb => {
                fb.place();
            });
        }
        this.navbar2.restate();
    }
    removeFbs() {
        this.feedbacks.forEach( fb => {
            fb.delete();
        });
        this.feedbacks = [];
    }
    expandFb(id) {
        let targetFeedback = this.getFeedbackById(id);
        this.removeFbs();
        this.getOneFb(targetFeedback);
    }
    createFb(fb) {
        let votes = this.getVotes(fb.active_votes);
        this.feedbacks.push( new Feedback(
            fb.id,
            fb.permlink,
            JSON.parse(fb.json_metadata).tags[1],
            fb.title,
            fb.body,
            fb.author,
            fb.created,
            fb.children,
            votes.l,
            votes.d,
            votes.m
        ));
    }
    createEmptyFb() {
        this.feedbacks.push( new Feedback(
            -1,
            'empty-feedback-on-the-golos-feedback-microservice',
            this.navbar2.currentFbSelector[0],
            'There is nothing here',
            'There\'s no feedbacks in this category yet. You can add the first one!',
            'Nobody',
            'right now',
            '0',
            0,
            0   
        ));
    }
    
    filterFb(fb) {
        
        if(fb.parent_permlink != 'fb') {
            return false;
        } else {
            let json = JSON.parse(fb.json_metadata);
            if( json.tags[0] != this.domain ) {
                return false;
            } else {
                /*//переменная отсеит кривые фидбеки, если они не относятся ни к одному из существующих типов
                //var control = false;
                
                //проверить по всем типам фидбеков
                for(let j = 0; j < navbar2.tabs.length; j++) {
                    
                    //инкрементировать лейбл
                    if(json.tags[1] == tabLabelNames[j] ) {
                        //incData(json.tags[1]);
                        control = true;
                        break;
                    }
                }*/
                
                this.navbar2.incCounter( json.tags[1] );
                
                if( (json.tags[1] == this.navbar2.currentFbSelector[0] || this.navbar2.currentFbSelector[0] == 'all') ) {
                    return true;
                }
            }
        }
    }
    
    /*Not interesting*/
    setBootstrapStructure() {
        this.getThisEl().classList.add('container-fluid');
        this.getThisEl().innerHTML = `
            <div class="row">
                <div class="col-12">
                    <div class="row">
            
                        <nav class="navigation"></nav>
                        <div class="col-lg-10 col-md-12 col-sm-12 col-xs-12 offset-lg-1 golos-feedback-container-wrapper">
                            <div class="row mount-place"></div>
                        </div>
                        <footer class="footer"></footer>
                        <div class="utility"></div>
                    </div>
                </div>
            </div>
        `;
        this.setLoadVFXHTML();
    }
    setNavigationBar() {
        this.getThisEl().querySelector(`.${GFCLASS} .navigation`).innerHTML = `
            <div class="wrapper tile">
                <div class="toggler"><span class="icon-menu"></span></div>
                <div class="logo">
                    <img src="graphics/logo.png">SteemitFeedback
                </div>
                <ul class="buttons" id="navbar-right" class="collapse navbar-collapse">
                    <li class="nav-item">
                        <button class="btn btn-primary button-get-my-feedbacks" data-mode="my"><span class="icon-download"></span> <span class="label">Get my feedbacks</span></button>
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-primary button-add-feedback"><span class="icon-forward"></span> Add feedback</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-primary button-about" id="aboutGolosFeedbackCallBtn"><span class="icon-info"></span> About</button>
                    </li>
                </ul>
                <a href="https://github.com/NearFutureBand/golosfeedback" class="github-corner" tabindex="-1">
                    <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="80px" height="80px" viewBox="0 0 250 250" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"  xmlns:xlink="http://www.w3.org/1999/xlink">
                        <defs>
                           <style type="text/css">
                                <![CDATA[
                                    svg:hover .octo-arm {
                                        animation:octocat-wave 560ms ease-in-out
                                    }
                                    .octo-arm {
                                        transform-origin: 55% 55%;
                                        transform:rotate(-10deg) translateY(1px);
                                    }
                                    @keyframes octocat-wave{
                                        0%,100%{
                                            transform:rotate(-10deg)
                                        }
                                        20%,60%{
                                            transform:rotate(-1deg)
                                        }
                                        40%,80%{
                                            transform:rotate(10deg)
                                        }
                                    }
                                ]]>
                            </style>
                        </defs>
                        <g>
                            <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"/>
                            <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="#eee" class="octo-body"/>
                        </g>
                        <g>
                            <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="#eee" class="octo-arm"></path>
                        </g>
                    </svg>
                </a>
            </div>
        `;
    }
    setFooter() {
        this.getThisEl().querySelector(`.${GFCLASS} .footer`).innerHTML = `
            <div class="wrapper tile">
                <ul class="buttons">
                    <li class="nav-item">
                        <button type="button" class="btn btn-primary button-integration"><span class="icon-embed2"> Integration</button>
                    </li>
                    <li class="nav-item">
                        <button type="button" class="btn btn-primary button-support"><span class="icon-wrench"> Support</button>
                    </li>
                </ul>
                
                <div class="copyright">
                    SteemitFeedback @ 2018
                </div>
            </div>
        `;
    }
    setTestnetWebsocket() {
        golos.config.set('websocket', 'wss://ws.testnet.golos.io');
        golos.config.set('address_prefix', 'GLS');
        golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');
    }
    getFeedbackById(id) {
        for(let i = 0; i < this.feedbacks.length; i++) {
            if( this.feedbacks[i].id == id ) return this.feedbacks[i];
        }
    }
    getVotes(votesArray) {
        let likes = 0;
        let dislikes = 0;
        let myVote = 0;
        
        votesArray.forEach( item => {
            if(item.voter == username) {
                if(item.percent > 0) myVote = 1;
                else if(item.percent < 0) myVote = -1;
            }
               
            if(item.percent > 0) likes++;
            else if(item.percent < 0) dislikes++;
            
        });
        
        return {l: likes, d: dislikes, m: myVote};
    }
    setPaddingsForFeedbackContainer() {
        
        let calcPadding = () => {
            let container = document.querySelector(`.${this.className} .golos-feedback-container-wrapper`);
            container.style.paddingTop = parseInt( getComputedStyle( document.querySelector(`.${this.className} .navigation`)).height ) + 10 + 'px';
            container.style.paddingBottom = parseInt( getComputedStyle( document.querySelector(`.${this.className} .footer`)).height ) + 10 + 'px';
        };
        calcPadding();
        
        addEventListener('resize', () => {
            calcPadding();
        });
    }
    setLoadVFXHTML() {
        let el = document.createElement('div');
        el.className = 'vfx';
        el.innerHTML = `
            <div class="lding">
                <div class="lds-css ng-scope">
                    <div class="lds-cube">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        `;
        document.querySelector(`.${GFCLASS} .utility`).appendChild(el);
    }
}