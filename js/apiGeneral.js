//временно
golos.config.set('websocket', 'wss://ws.testnet.golos.io');
golos.config.set('address_prefix', 'GLS');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');


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
    //в полной версии подразумевается, что навбар уже на странице есть, и нужно только привязать событие к кнопке (как здесь)
    //в виджете навбара нет и кнопка будет создаваться отдельно
    document.querySelector('.'+prefix+'btn-add-fb').addEventListener('click', function(){
        openAddFbForm();
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
            removeFbs();
            loadFbs();
        });
    });
}


//FORM FOR ADDING NEW FEEDBACK

var createFromAddFb = function(){
    let form = document.createElement('div');
    form.className = 'row form frm-add-fb';
    form.innerHTML = "<div class='col-lg-12 tile'><form><div class='form-group'><label for='formHeader'>Header</label><input type='text' class='form-control' id='formHeader' name='inptHeader' aria-describedby='formHeader' required></div><div class='form-group'><label for='formTex'>Enter your text here</label><textarea class='form-control' id='formText' name='txtBody' rows='3' required></textarea></div><div class='form-check'><input class='form-check-input' type='radio' name='exampleRadios' id='radio-idea' value='option1' checked><label class='form-check-label' for='formRadio0'>Idea</label></div><div class='form-check'><input class='form-check-input' type='radio' name='exampleRadios' id='radio-question' value='option2'><label class='form-check-label' for='formRadio1'>Question</label></div><div class='form-check'><input class='form-check-input' type='radio' name='exampleRadios' id='radio-problem' value='option3'><label class='form-check-label' for='formRadio2'>Problem</label></div><div class='form-check'><input class='form-check-input' type='radio' name='exampleRadios' id='radio-offer' value='option3'><label class='form-check-label' for='formRadio3'>Offer</label></div><button type='submit' class='btn btn-primary btn-add-fb-done mr-2'><span class='icon-checkmark'></span> Submit</button><button type='button' class='btn btn-primary btn-add-fb-cancel ml-2'><span class='icon-cross'></span> Cancel</button></form></div>";
    document.querySelector('.'+prefix+'wrapper').appendChild(form);
    addEventForFbDone();
    addEventForFbCancel();
}
function addEventForFbDone(){
    document.querySelector('.'+prefix+'wrapper .frm-add-fb').getElementsByTagName('form')[0].addEventListener('submit', function(e){
        e.preventDefault();
        if(wif){
            sendAddFbForm();
        }else{
            auth(sendAddFbForm);
        }
        return false;
    });
}
function addEventForFbCancel(){
    document.querySelector('.'+prefix+'wrapper .frm-add-fb .btn-add-fb-cancel').addEventListener('click',function(){
        closeAddFbForm();
    });
}
function openAddFbForm(){
    createFromAddFb();
    document.querySelector('.'+prefix+'btn-add-fb').style.display = 'none';
    removeFbs();
}
function closeAddFbForm(){
    document.querySelector('.'+prefix+'wrapper .frm-add-fb').remove();
    document.querySelector('.'+prefix+'btn-add-fb').style.display = 'block';
    loadFbs();
}

//FEEDBACKS

var loadFbs = function(){
    
    var query = {
        select_tags: (tagSelector=='all')?['fb']:[tagSelector],
        select_authors: ['test2','test3','test4','test5','test6','test7','test8','test9'],
        limit: 100
    };
    console.log(query.select_tags);
    golos.api.getDiscussionsByBlog(query, function(err, result) {
        console.log(err, result);
        
        if ( ! err){
            result.forEach(function(item) {
                console.log(item);           
                createFbs(formData(item));
            });
        }
        else console.error(err);
    });
    
    //загрузка тестового поста через permlink
    golos.api.getContent('test2', 'post-fb-1523961173281', function(err, result) {
        //console.log(err, result);
        if (!err){
            console.log(result);
            createFbs(formData(result));
        }
        else console.error(err);
    });
}
var createFbs = function(data){
    let note = document.createElement('div');
    note.className = 'row '+prefix+'fb';
    note.setAttribute('id',data[0]);
    note.setAttribute('data-permlink',data[8]);
    note.setAttribute('data-opened',0);
    note.setAttribute('data-like',data[9]);
    note.innerHTML = "<div class='container body-fb tile'><div class='row'><div class='col-lg-9 col-md-9 text'><h3>"+data[1]+"</h3><p>"+data[2]+"</p><div class='buttons'><button type='button' class='btn btn-dark btn-show-comments'><span class='badge badge-light'>"+data[3]+"</span><span class='icon-message-square'></span><span class='icon-arrow-left hidden'></span><span class='hidden'> Back</span></button></div></div><div class='col-lg-3 col-md-3 controls'><div class='controls-wrapper'><div class='name'><h6>"+data[4]+"</h6></div><div class='date'><small>"+data[5]+"</small></div><div class='likes'><span>"+data[6]+"</span><button type='button' class='btn btn-secondary btn-vote' data-like='1'><span class='icon-thumbs-up'></span></button><button type='button' class='btn btn-secondary btn-vote' data-like='0'><span class='icon-thumbs-down'></span></button><span>"+data[7]+"</span></div></div></div></div></div><div class='container comments'></div>";
    document.querySelector('.'+prefix+'wrapper').appendChild(note);
    //checkVoteColor(data[0],'');
    
    //addEventsForCommentButtons(data[0]);
    //addEventsForFbLikes(data[0]);
    //addEventForFbHeader(data[0]);
    
    console.log('feedback has been created: id = '+data[0]);
}
var formData = function(object){
    let data = [];
    data.push(object.id);//0 id
    data.push(object.title);//1 title
    data.push(object.body);//2 body
    data.push(object.children);//3 count of comments
    data.push(object.author);//4 author
    data.push(object.created);// 5 date
    
    //эти строки повторяются в formDataCom
    let likes = 0;
    let dislikes = 0;
    object.active_votes.forEach(function(item){
        if(item.percent>0) likes++;
        else if(item.percent<0) dislikes++;
    });
    data.push(likes);//6 likes
    //их нужно вынести в функцию
    
    
    data.push(dislikes);//7 dislikes
    data.push(object.permlink);//8 permlink
    
    data.push(getVoteStateOnload(object)/10000);//9 vote of this user
    return data;
}
function removeFbs(){
    Array.from(document.getElementsByClassName(prefix+'fb')).forEach(function(item){
        item.remove();
    });
}
function getVoteStateOnload(object){
    let result=0;
    /*if(wif){
        object.active_votes.forEach(function(item){
            if(item.voter==username){
                result = item.percent;
            }
        });
    }else{
        result = 0;
    }*/
    return result;
}

//COMMENTS
//FORM FOR ADDING NEW COMMENT
//VOTES


//OTHER FUNCTIONS

/*Removes class from the given element if it contains it*/
var delClassIfContains = function (element, className){
    if(element.classList.contains(className)){
        element.classList.remove(className);
    }
}

