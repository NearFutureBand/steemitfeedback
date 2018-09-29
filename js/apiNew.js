/*
    makeHTML() - returns HTML code of the exemplar to build in it somewhere
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
        this.addEvntClk();
    }
    
    makeHTML() {
        let exportHTML = 
            '<div class="col-12">'+
                '<nav class="navbar navbar-expand-lg tabs">'+
                    '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavFeedbackTabs" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">'+
                        '<span class="navbar-toggler-icon"></span>'+
                    '</button>'+
                    '<div class="collapse navbar-collapse d-flex justify-content-center" id="navbarNavFeedbackTabs">'+
                        '<div class="container">'+
                            '<div class="row">'+
                                '<div class="col-12 tabs">'+
                                    '<ul class="nav nav-tabs">';
        this.tabs.forEach( function(tab) {
            exportHTML += ('<li class="nav-item">'+ tab.makeHTML() + '</li>');
        });
        exportHTML += (
                                    '</ul>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</nav>'+
            '</div>'
        );
        return exportHTML;
    }
    
    place() {
        let el = document.createElement('div');
        el.className = 'row ' + this.className;
        //el.innerHTML = ''
        document.querySelector('.' + this.GFCLASS).appendChild(el);
        this.restate();
    }
    
    restate() {
        let el = this.getThisEl();
        if( el.innerHTML != '') el.innerHTML = '';
        el.innerHTML = this.makeHTML();
        
        this.addEvntClk();
    }
    
    /*Events*/
    addEvntClk() {
        let $ = this;
        for( let i = 0; i < this.tabs.length; i++) {
            this.tabs[i].getThisEl().addEventListener('click', function() {
                $.makeTabActive(i);
                $.restate();
            });
        }
    }
    
    /*Incapsulated*/
    getThisEl() {
        return document.querySelector('.'+ this.GFCLASS +' .row.'+ this.className);
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
        this.tabs[index].active = true;
        this.activeTab = index;
        this.currentFbSelector[0] = this.tabs[index].key;
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

}
class Comment {
    
}
class ControlPanel {
    
}

class GolosFeedback {
    constructor() {
        this.className = 'golos-feedback-container';
        this.initBootstrapStructure();
        this.navbar2 = new Filter(this.className);
    }
    
    init() {
        this.navbar2.init();
    }
    
    initBootstrapStructure() {
        this.getThisEl().classList.add('container');
    }
    
    getThisEl() {
        return document.querySelector('.' + this.className);
    }
}

var GF = new GolosFeedback();
GF.init();
