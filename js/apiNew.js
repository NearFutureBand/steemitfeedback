var mountBlockName = 'golos-feedback-container';
var initBootstrapStructure = function() {
    let wrapper = document.querySelector('.' + mountBlockName);
    wrapper.classList.add('container');
}();

var Filter = {
    
    render: function() {
        let navTabs = document.createElement('div');
        navTabs.className = 'row nav-tab-buttons';
        navTabs.innerHTML = '<div class="col-12"><nav class="navbar navbar-expand-lg tabs"><button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavFeedbackTabs" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse d-flex justify-content-center" id="navbarNavFeedbackTabs"><div class="container"><div class="row"><div class="col-12 tabs"><ul class="nav nav-tabs"><li class="nav-item"><a class="nav-link tab active" href="#all" data-target="all"><span class="icon-radio-unchecked"> All </span> <span class="tab-label">('+0+')</span></a></li><li class="nav-item"><a class="nav-link tab" href="#ideas" data-target="idea"><span class="icon-magic-wand"></span> Tab <span class="tab-label">('+0+')</span></a></li><li class="nav-item"><a class="nav-link tab" href="#problems" data-target="problem"><span class="icon-bug"></span>  <span class="tab-label">('+0+')</span></a></li><li class="nav-item"><a class="nav-link tab" href="#questions" data-target="question"><span class="icon-question"></span> Tab <span class="tab-label">('+0+')</span></a></li><li class="nav-item"><a class="nav-link tab" href="#thanks" data-target="thank"><span class="icon-gift"></span> Tab <span class="tab-label">('+0+')</span></a></li></ul></div></div></div></div></nav></div>';
        document.querySelector('.' + mountBlockName).appendChild(navTabs);
    }
}

Filter.render();