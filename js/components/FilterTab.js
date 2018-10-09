class FilterTab {
    constructor(name, key, icon) {
        this.name = name;
        this.key = key;
        this.counter = 0;
        this.icon = icon;
        this.active = false;
    }
    
    makeHTML() {
        return '<a class="tab '+ (this.active ? 'active' : '') +'" href="#'+ this.key +'" data-target="'+ this.key +'">'+this.name+' <span class="badge badge-light couter">0</span></a>';
    }
    
    getThisEl() {
        return document.querySelector('.' + GFCLASS + ' a.tab[data-target="'+ this.key +'"]');
    }
    
    /*Events*/
    click() {
        this.active = true;
        return this.key;
    }
    
    
    /*Not Interesting*/
}