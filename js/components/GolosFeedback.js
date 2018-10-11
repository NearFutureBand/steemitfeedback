class GolosFeedback {
    constructor() {
        this.className = GFCLASS;
        this.setBootstrapStructure();
        this.domain = (location.hostname == "")? 'localhost' : location.hostname;
        this.setTestnetWebsocket();
        
        
        this.navbar2 = new Filter();
        this.formAddFb = new FormAddFeedback(this.navbar2.tabs, this.domain);
        this.hashController = new HashController(this.navbar2.tabs);
        this.feedbacks = [];
    }
    
    init() {
        this.setNavigationBar();
        //this.initLang('en');
        //this.replaceLangButton();
        this.setFooter();
        this.navbar2.init();
        this.addStaticEventListeners();
        this.loadFbs();
    }
    
    
    addStaticEventListeners() {
        
        this.getThisEl().addEventListener('reloadFeedbacks', () => {
            this.formAddFb.delete();
            this.reloadFbs();
        });
        
        this.getThisEl().addEventListener('expandFb', (e) => {
            console.log(`expanding fb with id: ${e.detail.id}`);
            this.expandFb(e.detail.id);
        });
        
        document.querySelector('.button-about').addEventListener('click', () => {
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
        
        document.querySelector('.button-get-my-feedbacks').addEventListener('click', () => {
            auth( () => {
                this.removeFbs();
                this.loadFbs('test3');
            }, ['posting']);
        });
        
        document.querySelector('.button-add-feedback').addEventListener('click', () => {
            this.removeFbs();
            this.formAddFb.place();
        });
    }
    
    getThisEl() {
        return document.querySelector('.' + this.className);
    }
    
    loadFbs(customUsername) {
        this.navbar2.resetCounters();
        let $ = this;
        /*this.feedbacks.push( new Feedback(43, 'permlink', 'idea', 'Title of the feedback', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi iusto ex aperiam facere, explicabo odit dolore doloremque officia et quasi!', 'author-43', '28-04-2018', 0) );
        this.placeFbs();*/
        
        var query = {
            select_tags: ['fb', this.domain ],
            select_authors: ['test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9'],
            limit: 100
        };
        
        if(customUsername != undefined) {
            //console.log(customUsername);
            query.select_authors = [customUsername];
        }
        
        golos.api.getDiscussionsByBlog(query, function(err, result) {
            console.log(err, result);
            
            if ( ! err) {
                if( result.length != 0) {
                    result.forEach( function(fb) {
                        if( $.filterFb(fb) ) {
                            $.createFb(fb);
                        }
                    });
                    
                    if($.feedbacks.length == 0) {
                        //create empty fb
                        console.log('Create empty fb');
                    } else {
                        $.placeFbs();
                    }
                } else {
                    //create empty fb
                    console.log('Create empty fb');
                }
                
            } else {
                console.error(err);
                //showError(err.message);
            }
        });
        
    }
    reloadFbs() {
        this.removeFbs();
        this.loadFbs();
    }
    getOneFb() {
        //getContent()
        //this.feedbacks.push( new Feedback() );
    }
    
    placeFbs() {
        this.feedbacks.forEach( function(fb) {
            fb.place();
        });
        this.navbar2.restate();
    }
    removeFbs() {
        this.feedbacks.forEach( function(fb) {
            fb.remove();
        });
        this.feedbacks = [];
    }
    expandFb(id) {
        let targetFeedback = this.getFeedbackById(id);
        this.removeFbs();
        this.feedbacks.push(targetFeedback);
        this.placeFbs();
        targetFeedback.expand();
        
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
            votes.d
            )
        );
    }
    
    filterFb(fb) {
        let $ = this;
        if(fb.parent_permlink != 'fb') {
            return false;
        } else {
            let json = JSON.parse(fb.json_metadata);
            if(json.tags[0] != $.domain) {
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
                
                $.navbar2.incCounter( json.tags[1] );
                
                if( (json.tags[1] == $.navbar2.currentFbSelector[0] || $.navbar2.currentFbSelector[0] == 'all') ) {
                    return true;
                }
            }
        }
    }
    
    /*Not interesting*/
    setBootstrapStructure() {
        this.getThisEl().innerHTML = `
            <nav class="navigation"></nav>
            <div class="container golos-feedback-container-wrapper">
                <div class="row mount-place"></div>
            </div>
            <footer class="footer"></footer>
        `;
    }
    setNavigationBar() {
        this.getThisEl().querySelector(`.${GFCLASS} .navigation`).innerHTML = `
            <div class="wrapper tile">
                <div class="logo">
                    <img src="graphics/logo.png">GolosFeedback
                </div>
                <div class="buttons" id="navbar-right">
                    <button type="button" class="btn btn-primary button-get-my-feedbacks"><span class="icon-box-add"></span> Get my feedbacks</button>
                    <button type="button" class="btn btn-primary button-add-feedback"><span class="icon-forward"></span> Add feedback</button>
                    <button type="button" class="btn btn-primary button-about" id="aboutGolosFeedbackCallBtn"><span class="icon-info"></span> About</button>
                </div>
            </div>
        `;
    }
    
    setFooter() {
        this.getThisEl().querySelector(`.${GFCLASS} .footer`).innerHTML = `
            <div class="wrapper tile">
                <div class="buttons">
                    <button type="button" class="btn btn-primary button-integration">Integration</button>
                    <button type="button" class="btn btn-primary button-support">Support</button>
                </div>
                
                <div class="copyright">
                    GolosFeedback @ 2018
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
        for( let i = 0; i < this.feedbacks.length; i++) {
            if( this.feedbacks[i].id == id ) return this.feedbacks[i];
        }
    }
    getVotes(votesArray) {
        let likes = 0;
        let dislikes = 0;
        votesArray.forEach( function( item ) {
            if(item.percent > 0) likes++;
            else if(item.percent < 0) dislikes++;
        });
        return {l: likes, d: dislikes};
    }
}