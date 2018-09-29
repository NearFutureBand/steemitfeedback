/*
    makeDynHTML() - returns HTML code of the exemplar that will be constantly changing
    getThisEl() - returns js variable of the exemplar by using querySelector
    place() - places the exemplar to the DOM structure, it is executing only one time
    restate() - rebuilds the structure of the exemplar with updated dynamic parameters
    
*/

class FilterTab {
    constructor(name, key, icon, GFCLASS) {
        this.name = name;
        this.key = key;
        this.counter = 0;
        this.icon = icon;
        this.active = false;
        this.GFCLASS = GFCLASS;
    }
    
    makeHTML() {
        return '<a class="nav-link tab '+ (this.active ? 'active' : '') +'" href="#'+ this.key +'" data-target="'+ this.key +'">'+
                    '<span class="'+ this.icon +'"></span> '+ this.name +
                    ' <span class="tab-label"> ('+ this.counter +') </span>' +
                '</a>';
    }
    
    getThisEl() {
        return document.querySelector('.' + this.GFCLASS + ' a.nav-link.tab[data-target="'+ this.key +'"]');
    }
    
    /*Events*/
    click() {
        this.active = true;
        return this.key;
    }
}

/*Navigation bar with tabs with counters for filtering incoming feedbacks*/
class Filter {
    constructor(GFCLASS) {
        this.GFCLASS = GFCLASS;
        this.tabs = [];
        this.createFilterTabs(this.GFCLASS);
        this.activeTab = null;
        this.className = 'nav-filter';
        this.currentFbSelector = [''];
        this.makeTabActive(0);
    }
    
    init() {
        this.place();
    }
    
    makeDynHTML() {
        let exportHTML = '';
        this.tabs.forEach( function(tab) {
            exportHTML += ('<li class="nav-item">'+ tab.makeHTML() + '</li>');
        });
        return exportHTML;
    }
    
    place() {
        let el = document.createElement('div');
        el.className = 'row ' + this.className;
        el.innerHTML = 
            '<div class="col-12">'+
                '<nav class="navbar navbar-expand-lg tabs">'+
                    '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavFeedbackTabs" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">'+
                        '<span class="navbar-toggler-icon"></span>'+
                    '</button>'+
                    '<div class="collapse navbar-collapse d-flex justify-content-center" id="navbarNavFeedbackTabs">'+
                        '<div class="container">'+
                            '<div class="row">'+
                                '<div class="col-12 tabs">'+
                                    '<ul class="nav nav-tabs">'+
                                        
                                    '</ul>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</nav>'+
            '</div>';
        document.querySelector('.' + this.GFCLASS).appendChild(el);
        this.restate();
    }
    
    restate() {
        let el = this.getDynBlock();
        if( el.innerHTML != '') el.innerHTML = '';
        el.innerHTML = this.makeDynHTML();
        this.addEvntClk();
    }
    
    /*Events*/
    addEvntClk() {
        let $ = this;
        for( let i = 0; i < this.tabs.length; i++) {
            this.tabs[i].getThisEl().addEventListener('click', function() {
                $.makeTabActive(i);
                console.log($.currentFbSelector);
                $.restate();
                
                document.querySelector('.' + $.GFCLASS).dispatchEvent(new CustomEvent('fbSelectorChange'));
            });
        }
    }
    
    /*Incapsulated*/
    getThisEl() {
        return document.querySelector('.'+ this.GFCLASS +' .row.'+ this.className);
    }
    getDynBlock() {
        return document.querySelector('.'+ this.GFCLASS +' .row.'+ this.className +' ul.nav.nav-tabs');
    }
    createFilterTabs(GFCLASS) {
        this.tabs.push( new FilterTab('All', 'all', 'icon-radio-unchecked', GFCLASS));
        this.tabs.push( new FilterTab('Ideas', 'idea', 'icon-magic-wand', GFCLASS));
        this.tabs.push( new FilterTab('Problems', 'problem', 'icon-bug', GFCLASS));
        this.tabs.push( new FilterTab('Questions', 'question', 'icon-question', GFCLASS));
        this.tabs.push( new FilterTab('Thanks', 'thank', 'icon-gift', GFCLASS));
    }
    makeTabActive(index) {
        for(let i = 0; i < this.tabs.length; i++) {
            this.tabs[i].active = false;
        }
        this.activeTab = index;
        this.currentFbSelector[0] = this.tabs[index].click();
    }
    incCounter(index) {
        
    }
    getTabByKey(key) {
        for( let i = 0; i < this.tabs.length; i++) {
            if( this.tabs[i].key == key) return this.tabs[i];
        }
        console.log('getTabByKey function error: not found element with this key');
        return null;
    }
    
}

class Feedback {
    constructor(id, permlink, type, heading, body, author, date, GFCLASS) {
        this.className = 'fb';
        this.expanded = false;
        this.yourVote = 0;
        this.GFCLASS = GFCLASS;
        this.id = id;
        this.type = type;
        this.permlink = permlink;
        this.body = body;
        this.heading = heading;
        this.date = date;
        this.author = author;
        this.comments = [];
        this.likes = 0;
        this.dislikes = 0;
        this.controlPanel = new ControlPanel('fb-' + this.id, this.author, this.date, this.likes, this.dislikes);
    }
    place() {
        let el = document.createElement('div');
        el.className = 'row ' + this.className;
        el.setAttribute('id', 'fb-' + this.id);
        
        el.innerHTML = 
            '<div class="container body-fb tile">'+
                '<div class="row">'+
                    '<div class="col-lg-9 col-md-9 text">'+
                        '<h3>'+ this.heading +'</h3>'+
                        '<p>'+ this.body +'</p>'+
                        '<div class="buttons">'+
                            '<button type="button" class="btn btn-dark btn-show-comments">'+
                                '<span class="badge badge-light">'+ this.comments.length +'</span>'+
                                '<span class="icon-message-square"></span>'+
                                '<span class="icon-arrow-left hidden"></span>'+
                                '<span class="hidden"> Back</span>'+
                            '</button>'+
                        '</div>'+
                    '</div>'+
                    this.controlPanel.makeHTML() + 
                '</div>'+
            '</div>'+
            '<div class="container comments"></div>';
        document.querySelector('.' + this.GFCLASS).appendChild(el);
    }
}
class Comment {
    
}
class ControlPanel {
    constructor(id, author, date, likes, dislikes) {
        this.id = id;
        this.author = author;
        this.date = date;
        this.likes = likes;
        this.dislikes = dislikes;
        this.className = 'controls';
    }
    
    makeHTML() {
        return '<div class="col-lg-3 col-md-3 '+ this.className +'" id="ctrl-'+ this.id +'">'+
                   '<div class="controls-wrapper">'+
                       '<div class="name">'+
                           '<h6>'+ this.author +'</h6>'+
                       '</div>'+
                       '<div class="photo">'+
                           '<img src="http://www.xn--80aefdbw1bleoa1d.xn--p1ai//plugins/uit/mychat/assets/img/no_avatar.jpg">'+
                       '</div>'+
                       '<div class="date">'+
                           '<small>'+ this.date +'</small>'+
                       '</div>'+
                       '<div class="likes">'+
                           '<button type="button" class="btn btn-secondary btn-vote" data-like="1">'+
                               '<span class="badge badge-dark">'+ this.likes +'</span>'+
                               '<span class="icon-thumbs-up"></span>'+
                           '</button>'+
                           '<button type="button" class="btn btn-secondary btn-vote" data-like="0">'+
                               '<span class="icon-thumbs-down"></span>'+
                               '<span class="badge badge-dark">'+ this.dislikes +'</span>'+
                           '</button>'+
                       '</div>'+
                   '</div>'+
                '</div>';
    }
}
class FormAddFeedback {
    constructor(GFCLASS, tabs) {
        this.className = 'frm-add-fb';
        this.GFCLASS = GFCLASS;
        this.tabs = tabs;
    }
    
    place() {
        let el = document.createElement('div');
        el.className = 'row ' + this.className;
        el.innerHTML = 
            '<div class="col-lg-12 tile">'+
                '<form>'+
                    '<div class="form-group">'+
                        '<label for="formHeader">Header</label>'+
                        '<input type="text" class="form-control" id="formHeader" name="inptHeader" aria-describedby="formHeader" required>'+
                    '</div>'+
                    '<div class="form-group">'+
                        '<label for="formTex">Text</label>'+
                        '<textarea class="form-control" id="formText" name="txtBody" rows="3"></textarea>'+
                    '</div>'+
                    '<div class="form-check">'+
                        '<input class="form-check-input" type="radio" name="exampleRadios" id="radio-'+ this.tabs[1].key +'" value="option1" checked>'+
                        '<label class="form-check-label" for="formRadio0">'+ this.tabs[1].name +'</label>'+
                    '</div>'+
                    '<div class="form-check">'+
                        '<input class="form-check-input" type="radio" name="exampleRadios" id="radio-'+ this.tabs[2].key +'" value="option2">'+
                        '<label class="form-check-label" for="formRadio1">'+ this.tabs[2].name +'</label>'+
                    '</div>'+
                    '<div class="form-check">'+
                        '<input class="form-check-input" type="radio" name="exampleRadios" id="radio-'+ this.tabs[3].key +'" value="option3">'+
                        '<label class="form-check-label" for="formRadio2">'+ this.tabs[3].name +'</label>'+
                    '</div>'+
                    '<div class="form-check">'+
                        '<input class="form-check-input" type="radio" name="exampleRadios" id="radio-'+ this.tabs[4].key +'" value="option3">'+
                        '<label class="form-check-label" for="formRadio3">'+ this.tabs[4].name +'</label>'+
                    '</div>'+
                    '<button type="submit" class="btn btn-success btn-add-fb-done mr-2">'+
                        '<span class="icon-checkmark"></span> Submit'+
                    '</button>'+
                    '<button type="button" class="btn btn-danger btn-add-fb-cancel ml-2">'+
                        '<span class="icon-cross"></span> Cancel'+
                    '</button>'+
                '</form>'+
            '</div>';
        document.querySelector('.' + this.GFCLASS).appendChild(el);
    
        /*ClassicEditor
        .create( document.querySelector( '#formText' ), {
                language: detectLang(),
                removePlugins: [ 'ImageUpload' ],
            } )
        .then( editor => {
            ckeditor = editor;
            
            let but = document.createElement('button');
            but.className = "ck ck-button ck-enabled ck-off attach-image";
            but.innerHTML = '<svg class="ck ck-icon ck-button__icon" viewBox="0 0 20 20"><path d="M6.91 10.54c.26-.23.64-.21.88.03l3.36 3.14 2.23-2.06a.64.64 0 0 1 .87 0l2.52 2.97V4.5H3.2v10.12l3.71-4.08zm10.27-7.51c.6 0 1.09.47 1.09 1.05v11.84c0 .59-.49 1.06-1.09 1.06H2.79c-.6 0-1.09-.47-1.09-1.06V4.08c0-.58.49-1.05 1.1-1.05h14.38zm-5.22 5.56a1.96 1.96 0 1 1 3.4-1.96 1.96 1.96 0 0 1-3.4 1.96z" fill="#000" fill-rule="nonzero"></path></svg><span class="ck ck-tooltip ck-tooltip_s"><span class="ck ck-tooltip__text">Attach image via GolosImages</span></span><span class="ck ck-button__label">Attach image</span>';
            but.id = "upload";
            but.type = "button";
            document.querySelector('div.ck.ck-toolbar').appendChild(but);
            addEventForBtnUploadImg();
        } )
        .catch( err => {
            console.error( err.stack );
            showError(err.message);
        } );
    }*/
    }
}

class GolosFeedback {
    constructor() {
        this.className = 'golos-feedback-container';
        this.initBootstrapStructure();
        this.navbar2 = new Filter(this.className);
        this.formAddFb = new FormAddFeedback(this.className, this.navbar2.tabs);
        //this.feedbacks = [];
        //this.feedbacks.push( new Feedback(0,'blablabla','idea' ,'title','Lorem ipsum dolor sit amet, consectetur adipiscing elit.','author', '28-04-2018', this.className));
        //this.feedbacks.push( new Feedback(1,'eeeeeeeeeee','thank' ,'feedback here','Aliquam eget mi dapibus, consequat mauris eget, rutrum diam.','Vasya', '03-06-2018', this.className));
    }
    
    init() {
        this.navbar2.init();
        this.formAddFb.place();
        //this.feedbacks[0].place();
        //this.feedbacks[1].place();
    }
    
    initBootstrapStructure() {
        this.getThisEl().classList.add('container');
        this.getThisEl().addEventListener('fbSelectorChange', function() {
            console.log('event cought from main component'); 
        });
    }
    
    getThisEl() {
        return document.querySelector('.' + this.className);
    }
}

var GF = new GolosFeedback();
GF.init();
