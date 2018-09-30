class GolosFeedback {
    constructor() {
        this.className = 'golos-feedback-container';
        this.initBootstrapStructure();
        
        this.navbar2 = new Filter(this.className);
        this.formAddFb = new FormAddFeedback(this.className, this.navbar2.tabs);
        this.hashController = new HashController(this.navbar2.tabs);
        //this.feedbacks = [];
        
        //this.feedbacks.push( new Feedback(0,'blablabla','idea' ,'title','Lorem ipsum dolor sit amet, consectetur adipiscing elit.','author', '28-04-2018', this.className));
        //this.feedbacks.push( new Feedback(1,'eeeeeeeeeee','thank' ,'feedback here','Aliquam eget mi dapibus, consequat mauris eget, rutrum diam.','Vasya', '03-06-2018', this.className));
    }
    
    init() {
        this.navbar2.init();
        //this.formAddFb.place();
        //this.feedbacks[0].place();
        //this.feedbacks[1].place();
        this.addEventListeners();
    }
    
    initBootstrapStructure() {
        this.getThisEl().classList.add('container');
        
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
}