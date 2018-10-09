class GolosFeedback {
    constructor() {
        this.className = GFCLASS;
        this.setBootstrapStructure();
        this.domain = (location.hostname == "")? 'localhost' : location.hostname;
        this.setTestnetWebsocket();
        
        
        this.navbar2 = new Filter(this.className);
        this.formAddFb = new FormAddFeedback(this.className, this.navbar2.tabs);
        this.hashController = new HashController(this.navbar2.tabs);
        this.feedbacks = [];
    }
    
    init() {
        this.setNavigationBar();
        this.navbar2.init();
        this.addEventListeners();
        this.loadFbs();
    }
    
    
    addEventListeners() {
        let $ = this;
        this.getThisEl().addEventListener('reloadFeedbacks', function() {
            $.formAddFb.remove();
            $.reloadFbs();
        });
        this.getThisEl().addEventListener('hashChange', function() {
            $.hashController.setHash($.navbar2.tabs[$.navbar2.activeTab].name);
        })
        this.getThisEl().addEventListener('formAddFbDelete', function() {
            
        });
        this.getThisEl().addEventListener('expandFb', function(e) {
            console.log('expanding fb with id: ' + e.detail.id);
            $.expandFb(e.detail.id);
        });
        
        document.querySelector('.button-add-feedback').addEventListener('click', function() {
            $.removeFbs();
            $.formAddFb.place();
        });
    }
    
    getThisEl() {
        return document.querySelector('.' + this.className);
    }
    
    loadFbs() {
        let $ = this;
        this.feedbacks.push( new Feedback(43, 'permlink', 'idea', 'Title of the feedback', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi iusto ex aperiam facere, explicabo odit dolore doloremque officia et quasi!', 'author-43', '28-04-2018', 0) );
        this.placeFbs();
        var query = {
            select_tags: ['fb', this.domain ],
            select_authors: ['test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9'],
            limit: 100
        };
        
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
        this.navbar2.resetCounters();
    }
    expandFb(id) {
        let targetFeedback = this.getFeedbackById(id);
        this.removeFbs();
        this.feedbacks.push(targetFeedback);
        this.placeFbs();
        targetFeedback.expand();
        
    }
    createFb(fb) {
        this.feedbacks.push( new Feedback(
                                fb.id,
                                fb.permlink,
                                JSON.parse(fb.json_metadata).tags[1],
                                fb.title,
                                fb.body,
                                fb.author,
                                fb.created,
                                fb.replies.length,
                                this.className
                                //TODO: pass votes
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
        this.getThisEl().innerHTML = 
            '<div class="container golos-feedback-container-wrapper">'+
                '<div class="row mount-place"></div>'+
            '</div>';
    }
    setNavigationBar() {
        this.getThisEl().querySelector(MP).innerHTML = 
            '<nav class="col-12 navigation">'+
                '<div class="wrapper tile">'+
                    '<div class="logo">'+
                        '<img src="graphics/logo.png">GolosFeedback'+
                    '</div>'+
                    '<div class="buttons">'+
                        '<button type="button" class="btn btn-primary button-get-my-feedbacks">Get my feedbacks</button>'+
                        '<button type="button" class="btn btn-primary button-add-feedback">Add feedback</button>'+
                        '<button type="button" class="btn btn-primary button-about">About</button>'+
                    '</div>'+
                '</div>'+
            '</nav>';
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
}