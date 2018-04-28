var prefix = 'gF';

//GENERAL

var initGolosFeedback = function(){
    
    //selector for sorting all the printing feedbacks
    var tagSelector='all';
    
    //setting up container-row-col structure
    initBootstrapStructure();
    
    //initialization of navbar with tabs for sorting feedbacks
    initTabs();
    
    //adding event for the button (DIFF) 
    document.querySelector('.'+prefix+'btn-add-note').addEventListener('click', function(){
        openAddNoteForm();
    });
}
document.addEventListener('DOMContentLoaded', initGolosFeedback);

//START

var initBootstrapStructure = function(){
    let wrapper = document.querySelector('.'+prefix+'wrapper');
    wrapper.classList.add('container');
}


//TABS

var initTabs = function(){
    let navTabs = document.createElement('div');
    navTabs.className = 'row nav-tab-buttons';
    navTabs.innerHTML = '<div class="col-12"><nav class="navbar navbar-expand-lg tabs"><button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavFeedbackTabs" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse d-flex justify-content-center" id="navbarNavFeedbackTabs"><div class="container"><div class="row"><div class="col-12 tabs"><ul class="nav nav-tabs"><li class="nav-item"><a class="nav-link tab active" href="#all" data-target="all">All</a></li><li class="nav-item"><a class="nav-link tab" href="#ideas" data-target="idea">Ideas</a></li><li class="nav-item"><a class="nav-link tab" href="#problems" data-target="problem">Problems</a></li><li class="nav-item"><a class="nav-link tab" href="#questions" data-target="question">Questions</a></li><li class="nav-item"><a class="nav-link tab" href="#offers" data-target="offer">Offers</a></li></ul></div></div></div></div></nav></div>';
    document.querySelector('.'+prefix+'wrapper').appendChild(navTabs);
    
    //add events for tab buttons
    Array.from(document.getElementById('navbarNavFeedbackTabs').getElementsByClassName('tab')).forEach(function(item){
        item.addEventListener('click',function(){
            Array.from(document.getElementById('navbarNavFeedbackTabs').getElementsByClassName('tab')).forEach(function(item){
                delClassIfContains(item, 'active');
            });
            item.classList.add('active');
            tagSelector = item.getAttribute('data-target');
            console.log(tagSelector);
            //removeNotes();
            //loadNotes();
        });
    });
}

//FORM FOR ADDING NEW FEEDBACK

var createFromAddFb = function(){
    let form = document.createElement('div');
    form.className = 'row form frm-add-note';
    form.innerHTML = "<div class='col-lg-12 tile'><form><div class='form-group'><label for='formHeader'>Header</label><input type='text' class='form-control' id='formHeader' name='inptHeader' aria-describedby='formHeader' required></div><div class='form-group'><label for='formTex'>Enter your text here</label><textarea class='form-control' id='formText' name='txtBody' rows='3' required></textarea></div><div class='form-check'><input class='form-check-input' type='radio' name='exampleRadios' id='radio-idea' value='option1' checked><label class='form-check-label' for='formRadio0'>Idea</label></div><div class='form-check'><input class='form-check-input' type='radio' name='exampleRadios' id='radio-question' value='option2'><label class='form-check-label' for='formRadio1'>Question</label></div><div class='form-check'><input class='form-check-input' type='radio' name='exampleRadios' id='radio-problem' value='option3'><label class='form-check-label' for='formRadio2'>Problem</label></div><div class='form-check'><input class='form-check-input' type='radio' name='exampleRadios' id='radio-offer' value='option3'><label class='form-check-label' for='formRadio3'>Offer</label></div><button type='submit' class='btn btn-primary btn-add-note-done mr-2'><span class='icon-checkmark'></span> Submit</button><button type='button' class='btn btn-primary btn-add-note-cancel ml-2'><span class='icon-cross'></span> Cancel</button></form></div>";
    document.querySelector('.'+prefix+'wrapper').appendChild(form);
    addEventForFbDone();
    addEventForFbCancel();
}
function addEventForFbDone(){
    document.querySelector('.'+prefix+'wrapper .frm-add-note').getElementsByTagName('form')[0].addEventListener('submit', function(e){
        e.preventDefault();
        if(wif){
            sendAddNoteForm();
        }else{
            auth(sendAddNoteForm);
        }
        return false;
    });
}
function addEventForFbCancel(){
    document.querySelector('.'+prefix+'wrapper .frm-add-note .btn-add-note-cancel').addEventListener('click',function(){
        closeAddNoteForm();
    });
}
function openAddNoteForm(){
    createFromAddFb();
    document.querySelector('.'+prefix+'btn-add-note').style.display = 'none';
    //removeNotes();
}
function closeAddNoteForm(){
    document.querySelector('.'+prefix+'wrapper .frm-add-note').remove();
    document.querySelector('.'+prefix+'btn-add-note').style.display = 'block';
    //loadNotes();
}


//OTHER FUNCTIONS

/*Removes class from the given element if it contains it*/
var delClassIfContains = function (element, className){
    if(element.classList.contains(className)){
        element.classList.remove(className);
    }
}

