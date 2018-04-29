


var prefix = 'gF';
var tagSelector = 'all';
//GENERAL

var initGolosFeedback = function(){
    
    
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
    
    
    //loading posts according to current tag selector
    loadFbs();
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




//FORM FOR ADDING NEW FEEDBACK----------------------------------------------------------
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



//FEEDBACKS------------------------------------------------------------------------------
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
                createFb(formData(item));
            });
        }
        else console.error(err);
    });
    
    //загрузка тестового поста через permlink
    golos.api.getContent('test2', 'post-fb-1523961173281', function(err, result) {
        //console.log(err, result);
        if (!err){
            console.log(result);
            createFb(formData(result));
        }
        else console.error(err);
    });
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
var createFb = function(data){
    let note = document.createElement('div');
    note.className = 'row fb';
    note.setAttribute('id',data[0]);
    note.setAttribute('data-permlink',data[8]);
    note.setAttribute('data-opened',0);
    note.setAttribute('data-like',data[9]);
    note.innerHTML = "<div class='container body-fb tile'><div class='row'><div class='col-lg-9 col-md-9 text'><h3>"+data[1]+"</h3><p>"+data[2]+"</p><div class='buttons'><button type='button' class='btn btn-dark btn-show-comments'><span class='badge badge-light'>"+data[3]+"</span><span class='icon-message-square'></span><span class='icon-arrow-left hidden'></span><span class='hidden'> Back</span></button></div></div><div class='col-lg-3 col-md-3 controls'><div class='controls-wrapper'><div class='name'><h6>"+data[4]+"</h6></div><div class='date'><small>"+data[5]+"</small></div><div class='likes'><span>"+data[6]+"</span><button type='button' class='btn btn-secondary btn-vote' data-like='1'><span class='icon-thumbs-up'></span></button><button type='button' class='btn btn-secondary btn-vote' data-like='0'><span class='icon-thumbs-down'></span></button><span>"+data[7]+"</span></div></div></div></div></div><div class='container comments'></div>";
    document.querySelector('.'+prefix+'wrapper').appendChild(note);
    checkVoteColor(data[0],'');
    
    addEventsForCommentButtons(data[0]);
    //addEventsForFbLikes(data[0]);
    //addEventForFbHeader(data[0]);
    
    console.log('feedback has been created: id = '+data[0]);
}

var addEventsForCommentButtons = function (fbId){
    getBtnShowComment(fbId).addEventListener('click',function(){
        if(document.getElementById(fbId).getAttribute('data-opened') == '0'){
            reloadNote(fbId,true,true,true);            
        }else{
            removeFbs();
            loadFbs();
        }
    });
}
var reloadNote = function(fbId,expanded,loading,removeAll){
    
    // on/off loading animation
    /*if(loading==true){
        document.querySelector('.lding').style.display = 'block';
    }*/
    
    let permlink = getPermlink(fbId,'');
    let author = getAuthor(fbId,'');
    
    //remove all - for the expanding mode, remove one - for the reloading mode
    if(removeAll==true){
        removeFbs();
    }else{
        removeFb(fbId);
    }
    
    golos.api.getContent(author, permlink, function(err, result) {
        //console.log(err, result);
        if (!err) {
            console.log(result);
            createFb(formData(result));
            toggleBtnCom(fbId);
            
            //if the note was expanded
            if(expanded==true){
                document.getElementById(fbId).setAttribute('data-opened',1);
                loadComments(fbId);
                createCommentForm(fbId);
            }
        }
        else console.error(err);
    });
    
    /*if(loading==true){
        document.querySelector('.lding').style.display = 'none';
    }*/
}

function removeFbs(){
    document.querySelector('.'+prefix+'wrapper .fb').remove();
}
function getVoteState(fbId,comId){
    let state;
    if(comId){
        state = Number(getComment(fbId,comId).getAttribute('data-like'));
    }else{
        state = Number(document.getElementById(fbId).getAttribute('data-like'));
    }
    return state;
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
function checkVoteColor(fbId,comId){
    let state = getVoteState(fbId,comId);
    if(state == -1){
        delClassIfContains(getBtnVote(fbId,comId,1),'btn-success');
        getBtnVote(fbId,comId,0).classList.add('btn-danger');
    }else if(state == 0){
        delClassIfContains(getBtnVote(fbId,comId,1),'btn-success');
        delClassIfContains(getBtnVote(fbId,comId,0),'btn-danger');
    }else if(state == 1){
        delClassIfContains(getBtnVote(fbId,comId,0),'btn-danger');
        getBtnVote(fbId,comId,1).classList.add('btn-success');
    }
}
function getBtnShowComment(fbId){
    return document.getElementById(fbId).getElementsByClassName('btn-show-comments')[0];
}
function toggleBtnCom(fbId){
    let thisBtn = getBtnShowComment(fbId);
    if(thisBtn.children[2].classList.contains('hidden')){
        thisBtn.children[0].classList.add('hidden');
        thisBtn.children[1].classList.add('hidden');
        thisBtn.children[2].classList.remove('hidden');
        thisBtn.children[3].classList.remove('hidden');
    }else{
        thisBtn.children[2].classList.add('hidden');
        thisBtn.children[3].classList.add('hidden');
        thisBtn.children[0].classList.remove('hidden');
        thisBtn.children[1].classList.remove('hidden');
    }
}
function getFbControls(fbId){
    return document.getElementById(fbId).getElementsByClassName('controls')[0];
}


//COMMENTS-------------------------------------------------------------------------------
function loadComments(fbId){
    golos.api.getContentReplies(getAuthor(fbId,''), getPermlink(fbId,''), function(err, result) {
        //console.log(err, result);
        if (!err) {
            result.forEach(function(item) {
                console.log('getContentReplies', item);
                createComment(formDataCom(item,fbId));
            });
        }
        else console.error(err);
    });
}
var formDataCom = function(object, fbId){
    var data = [];
    data.push(object.id);//0 - id
    data.push(fbId);//1 - parent ID
    data.push(object.body);//2 - body
    data.push(object.author);//3 - author
    data.push(object.created);//4 - created (date)
    let likes = 0;
    let dislikes = 0;
    object.active_votes.forEach(function(item){
        if(item.percent>0) likes++;
        else if(item.percent<0) dislikes++;
    });
    data.push(likes);//5 - likes
    data.push(dislikes);//6 - dislikes
    data.push(object.permlink);//7 permlink
    data.push(getVoteStateOnload(object)/10000);// 8 vote of this user
    return data;
}
var createComment = function(data){
    let comment = document.createElement('div');
    comment.className = 'row comment';
    comment.setAttribute('id',data[0]);
    comment.setAttribute('data-permlink',data[7]);
    comment.setAttribute('data-like',data[8]);
    comment.innerHTML = "<div class='col-lg-10 offset-lg-1 col-md-10 offset-md-1 tile body-comment'><div class='row'><div class='col-lg-9 col-md-9 text'><p>"+data[2]+"</p></div><div class='col-lg-3 col-md-3 controls'><div class='controls-wrapper'><div class='name'><h6>"+data[3]+"</h6></div><div class='date'><small>"+data[4]+"</small></div><div class='likes'><span>"+data[5]+"</span><button type='button' class='btn btn-secondary btn-com-vote' data-like='1'><span class='icon-thumbs-up'></span></button><button type='button' class='btn btn-secondary btn-com-vote' data-like='0'><span class='icon-thumbs-down'></span></button><span>"+data[6]+"</span></div></div></div></div></div>";
    getBlockComments(data[1]).appendChild(comment);
    //checkVoteColor(data[1],data[0]);
    //addEventsForComLikes(data[1],data[0]);
    console.log("comment has been created: "+data[1]+" "+data[0]);
}

function getComment(fbId, comId){
    let comment;
    Array.from(getBlockComments(fbId).children).forEach(function(item){
        if(item.getAttribute('id')==comId){
            comment = item;
        }
    });
    return comment;
}

function getBlockComments(noteId){
    return document.getElementById(noteId).getElementsByClassName('comments')[0];
}


//FORM FOR ADDING NEW COMMENT-------------------------------------------------------------
function createCommentForm(fbId){
    var commentForm = document.createElement('div');
    commentForm.className = 'container frm-add-com';
    commentForm.innerHTML = "<div class='row'><div class='col-lg-10 offset-lg-1 col-md-10 offset-md-1 tile'><form><div class='form-group'><textarea class='form-control txt-add-com' id='commentBody' rows='3' placeholder='Type your comment here' required></textarea></div><button type='click' class='btn btn-primary btn-add-com-done'><span class='icon-checkmark'></span> Submit</button></form></div></div>";
    document.getElementById(fbId).appendChild(commentForm);
    //addEventsForComDone(noteId);
}




//VOTES

var getBtnVote = function(fbId, comId, isLike){
    let btn;
    if(comId){
        btn = getComControls(fbId,comId).getElementsByClassName('btn-com-vote')[1-isLike];
    }else{
        btn = getFbControls(fbId).getElementsByClassName('btn-vote')[1-isLike];
    }
    return btn;
}


//OTHER FUNCTIONS

/*Removes class from the given element if it contains it*/
var delClassIfContains = function (element, className){
    if(element.classList.contains(className)){
        element.classList.remove(className);
    }
}

function getPermlink(fbId,comId){
    let result;
    if(comId){
        result = getComment(fbId,comId).getAttribute('data-permlink');
    }else{
        result = document.getElementById(fbId).getAttribute('data-permlink');
    }
    return result;
}
function getAuthor(fbId,comId){
    let result;
    if(comId){
        //result = getComment(fbId,comId).getAttribute('data-permlink');
    }else{
        result = getFbControls(fbId).getElementsByClassName('name')[0].children[0].innerHTML;
    }
    return result;
}

