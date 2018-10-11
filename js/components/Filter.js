/*Navigation bar with tabs with counters for filtering incoming feedbacks*/
class Filter {
    constructor() {
        this.tabs = [];
        this.createFilterTabs();
        this.activeTab = null; //Int 
        this.className = 'filter';
        this.currentFbSelector = [''];
        this.hashController = new HashController(this.tabs);
        this.makeTabActive(0);
    }
    
    init() {
        this.place();
    }
    
    getThisEl() {
        return document.querySelector(`.${GFCLASS} .col-12.${this.className}`);
    }
    getDynBlock() {
        return this.getThisEl().querySelector('.wrapper.tile');
    }
    makeDynHTML() {
        let exportHTML = '';
        this.tabs.forEach( function(tab) {
            exportHTML += ( tab.makeHTML() );
        });
        return exportHTML;
    }
    
    place() {
        let el = document.createElement('div');
        el.className = `col-12 ${this.className}`;
        el.innerHTML = `<div class="wrapper tile"></div>`;
        document.querySelector(MP).appendChild(el);
        this.restate();
    }
    
    restate() {
        let el = this.getDynBlock();
        if( el.innerHTML != '') el.innerHTML = '';
        
        this.setCounterAll();
        el.innerHTML = this.makeDynHTML();
        this.addDynEventListeners();
    }
    
    /*Events*/
    addDynEventListeners() {
        for( let i = 0; i < this.tabs.length; i++) {
            this.tabs[i].getThisEl().addEventListener('click', () => {
                this.makeTabActive(i);
                console.log(this.currentFbSelector);
                this.restate();
                
                document.querySelector(`.${GFCLASS}`).dispatchEvent(new CustomEvent('reloadFeedbacks'));
            });
        }
    }
    
    /*Incapsulated*/
    createFilterTabs() {
        this.tabs.push( new FilterTab('All', 'all', 'icon-radio-unchecked'));
        this.tabs.push( new FilterTab('Ideas', 'idea', 'icon-magic-wand'));
        this.tabs.push( new FilterTab('Problems', 'problem', 'icon-bug'));
        this.tabs.push( new FilterTab('Questions', 'question', 'icon-question'));
        this.tabs.push( new FilterTab('Thanks', 'thank', 'icon-gift'));
    }
    makeTabActive(index) {
        for(let i = 0; i < this.tabs.length; i++) {
            this.tabs[i].active = false;
        }
        this.activeTab = index;
        this.currentFbSelector[0] = this.tabs[index].click();
        this.hashController.setHash(this.currentFbSelector[0]);
        
    }
    incCounter(key) {
        this.getTabByKey(key).counter++;
    }    
    getTabByKey(key) {
        for(let i=0; i<this.tabs.length; i++) {
            if( this.tabs[i].key == key) return this.tabs[i];
        }
    }
    setCounterAll() {
        let sum = 0;
        for(let i=1; i<this.tabs.length; i++) {
            sum += this.tabs[i].counter;
        }
        this.tabs[0].counter = sum;
    }
    resetCounters() {
        for(let i=1; i<this.tabs.length; i++) {
            this.tabs[i].counter = 0;
        }
    }
}