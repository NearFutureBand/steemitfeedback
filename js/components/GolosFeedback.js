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
        
        //this.feedbacks[0].place();
        //this.feedbacks[1].place();
        this.addEventListeners();
    }
    
    
    addEventListeners() {
        let $ = this;
        this.getThisEl().addEventListener('fbSelectorChange', function() { 
            //close form-add-fb if it is opened
            //close expanded feedback
            //download feedbacks
            $.formAddFb.delete();
            
        });
        this.getThisEl().addEventListener('hashChange', function() {
            $.hashController.setHash($.navbar2.tabs[$.navbar2.activeTab].name);
        })
        this.getThisEl().addEventListener('formAddFbDelete', function() {
            //$.formAddFb = undefined;
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
        //clearTabLabels();
    
        var query = {
            select_tags: ['fb', this.domain ],
            select_authors: ['test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9'],
            limit: 100
        };
        
        golos.api.getDiscussionsByBlog(query, function(err, result) {
            console.log(err, result);
            
            if ( ! err) {
                //filter results - validate json-metadata
                //check result if it's empty
                //create feedbacks

                result.forEach( function( item) {
                    $.feedbacks.push( new Feedback(
                        item.id,
                        item.permlink,
                        'default',
                        item.title,
                        item.body,
                        item.author,
                        item.created,
                        $.className
                        )
                    );    
                });
            $.feedbacks.forEach( function(fb) {
                fb.place();
            });
                
                    
            } else {
                console.error(err);
                //showError(err.message);
            }
        });
        
    }
    
    initBootstrapStructure() {
        this.getThisEl().classList.add('container');
    }
    setTestnetWebsocket() {
        golos.config.set('websocket', 'wss://ws.testnet.golos.io');
        golos.config.set('address_prefix', 'GLS');
        golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');
    }
}