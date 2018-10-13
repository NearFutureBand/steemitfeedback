class FilterTab {
    constructor(name, key, icon) {
        this.name = name;
        this.key = key;
        this.counter = 0;
        this.icon = icon;
        this.active = false;
    }
    
    getThisEl() {
        return document.querySelector(`.${GFCLASS} a.tab[data-target="${this.key}"]`);
    }
    
    makeHTML() {
        return `
            <a class="tab ${(this.active ? 'active' : '')}" href="#${this.key}" data-target="${this.key}">
                <span class="${this.icon}"></span> 
                <span class="label">${this.name}</span> 
                <span class="badge badge-light couter">${this.counter}</span>
            </a>
        `;
    }
    
    /*Events*/
    click() {
        this.active = true;
        return this.key;
    }
}