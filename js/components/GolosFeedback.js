class GolosFeedback {
    constructor() {
        this.className = 'golos-feedback-container';
        this.initBootstrapStructure();
        this.domain = (location.hostname == "")? 'localhost' : location.hostname;
        this.setTestnetWebsocket();
        
        this.navbar2 = new Filter(this.className);
        this.formAddFb = new FormAddFeedback(this.className, this.navbar2.tabs);
        this.hashController = new HashController(this.navbar2.tabs);
        this.feedbacks = [];
        
        //this.feedbacks.push( new Feedback(0,'blablabla','idea' ,'title','Lorem ipsum dolor sit amet, consectetur adipiscing elit.','author', '28-04-2018', this.className));
        //this.feedbacks.push( new Feedback(1,'eeeeeeeeeee','thank' ,'feedback here','Aliquam eget mi dapibus, consequat mauris eget, rutrum diam.','Vasya', '03-06-2018', this.className));
    }
    
    init() {
        
        this.navbar2.init();
        this.addEventListeners();
        this.loadFbs();
    }
    
    
    addEventListeners() {
        let $ = this;
        this.getThisEl().addEventListener('reloadFeedbacks', function() {
            //close expanded feedback
            
            $.formAddFb.delete();
            $.reloadFbs();
        });
        this.getThisEl().addEventListener('hashChange', function() {
            $.hashController.setHash($.navbar2.tabs[$.navbar2.activeTab].name);
        })
        this.getThisEl().addEventListener('formAddFbDelete', function() {
            
        });
        this.getThisEl().addEventListener('expandFb', function(e) {
            $.expandFb(e.detail.id);
        });
        
        document.querySelector('.btn-add-fb').addEventListener('click', function() {
            $.formAddFb.place();
        });
    }
    
    getThisEl() {
        return document.querySelector('.' + this.className);
    }
    
    loadFbs() {
        let $ = this;
    
        var query = {
            select_tags: ['fb', this.domain ],
            select_authors: ['test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9'],
            limit: 100
        };
        
        //TODO make a function createFb(fb)
        golos.api.getDiscussionsByBlog(query, function(err, result) {
            console.log(err, result);
            
            if ( ! err) {
                if( result.length != 0) {
                    result.forEach( function(fb) {
                        if( $.filterFb(fb) ) {
                            $.feedbacks.push( new Feedback(
                                fb.id,
                                fb.permlink,
                                'default',
                                fb.title,
                                fb.body,
                                fb.author,
                                fb.created,
                                fb.replies.length,
                                $.className
                                //TODO: pass votes
                            )
                            );
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
    /*getOneFb() {
        //getContent()
        //this.feedbacks.push( new Feedback() );
    }*/
    
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
        targetFeedback.expand();
        this.feedbacks.push(targetFeedback);
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
    initBootstrapStructure() {
        this.getThisEl().classList.add('container');
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