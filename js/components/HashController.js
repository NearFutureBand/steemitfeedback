class HashController {
    constructor(tabs) {
        this.tabs = tabs;
    }
    
    setHash(text) {
        location.hash = text;
    }
    
    clearHash() {
        location.hash = '';
    }
    
    resetHash() {
        location.hash = this.tabs.activeTab;
    }
}