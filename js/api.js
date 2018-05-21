var prefix = 'gF';
var tagSelector = 'all';
var ckeditor;
var jsonMetadata = '';
var domain = location.hostname;

//GENERAL

var initGolosFeedback = function() {
    
    //setting up container-row-col structure
    initBootstrapStructure();
    
    //initialization of navbar with tabs for sorting feedbacks
    initTabs();
    
    //adding event for the button (DIFF) 
    //в полной версии подразумевается, что навбар уже на странице есть, и нужно только привязать событие к кнопке (как здесь)
    //в виджете навбара нет и кнопка будет создаваться отдельно
    
    //loading posts according to current tag selector
    loadFbs();
    
    location.hash = 'all';
}
document.addEventListener('DOMContentLoaded', initGolosFeedback);


//START---------------------------------------------------------------------------------
var initBootstrapStructure = function() {
    let wrapper = document.querySelector('.' + prefix + 'wrapper');
    wrapper.classList.add('container');
}




//TABS----------------------------------------------------------------------------------
var initTabs = function() {
    let navTabs = document.createElement('div');
    navTabs.className = 'row nav-tab-buttons';
    navTabs.innerHTML = '<div class="col-12"><nav class="navbar navbar-expand-lg tabs"><button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavFeedbackTabs" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse d-flex justify-content-center" id="navbarNavFeedbackTabs"><div class="container"><div class="row"><div class="col-12 tabs"><ul class="nav nav-tabs"><li class="nav-item"><a class="nav-link tab active" href="#all" data-target="all">All</a></li><li class="nav-item"><a class="nav-link tab" href="#ideas" data-target="idea">Ideas</a></li><li class="nav-item"><a class="nav-link tab" href="#problems" data-target="problem">Problems</a></li><li class="nav-item"><a class="nav-link tab" href="#questions" data-target="question">Questions</a></li><li class="nav-item"><a class="nav-link tab" href="#offers" data-target="offer">Offers</a></li></ul></div></div></div></div></nav></div>';
    document.querySelector('.' + prefix + 'wrapper').appendChild(navTabs);
    
    //add events for tab buttons
    Array.from(document.getElementById('navbarNavFeedbackTabs').getElementsByClassName('tab')).forEach( function(item) {
        item.addEventListener('click',function(){
            Array.from(document.getElementById('navbarNavFeedbackTabs').getElementsByClassName('tab')).forEach( function(item) {
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
var createFromAddFb = function() {
    let form = document.createElement('div');
    form.className = 'row form frm-add-fb';
    form.innerHTML = "<div class='col-lg-12 tile'><form><div class='form-group'><label for='formHeader'>Header</label><input type='text' class='form-control' id='formHeader' name='inptHeader' aria-describedby='formHeader' required></div><div class='form-group'><label for='formTex'>Enter your text here</label><textarea class='form-control' id='formText' name='txtBody' rows='3'></textarea></div><div class='form-group'><button class='btn btn-dark' id='upload'>Attach images</button></div><div class='form-check'><input class='form-check-input' type='radio' name='exampleRadios' id='radio-idea' value='option1' checked><label class='form-check-label' for='formRadio0'>Idea</label></div><div class='form-check'><input class='form-check-input' type='radio' name='exampleRadios' id='radio-question' value='option2'><label class='form-check-label' for='formRadio1'>Question</label></div><div class='form-check'><input class='form-check-input' type='radio' name='exampleRadios' id='radio-problem' value='option3'><label class='form-check-label' for='formRadio2'>Problem</label></div><div class='form-check'><input class='form-check-input' type='radio' name='exampleRadios' id='radio-offer' value='option3'><label class='form-check-label' for='formRadio3'>Offer</label></div><button type='submit' class='btn btn-primary btn-add-fb-done mr-2'><span class='icon-checkmark'></span> Submit</button><button type='button' class='btn btn-primary btn-add-fb-cancel ml-2'><span class='icon-cross'></span> Cancel</button></form></div>";
    document.querySelector('.'+prefix+'wrapper').appendChild(form);
    
    addEventForFbDone();
    addEventForFbCancel();
    addEventForBtnUploadImg();
    clearJsonMetadata();// = JSON.stringify(tagList);//add tagList to json
    
    ClassicEditor
        .create( document.querySelector( '#formText' )/*,{
             plugins: [ Essentials, Paragraph, Bold, Italic ],
        } */)
        .then( editor => {
            ckeditor = editor;
        } )
        .catch( err => {
            console.error( err.stack );
        } );
}
var addEventForFbDone = function() {
    document.querySelector('.' + prefix + 'wrapper .frm-add-fb')
        .getElementsByTagName('form')[0]
        .addEventListener('submit', function(e) {
            e.preventDefault();
            //if(wif){
                sendAddFbForm();
            //}else{
            //    auth(sendAddFbForm);
            //}
            return false;
        });
 }
var sendAddFbForm = function() {
    //wif test3 testnet1 5Hvp79CaQrYUD9d33VvdtWY5BhyimS4t5vMDCBJE1WsTUUPuu1F";
    let parentAuthor = '';
    let parentPermlink = 'fb';
    let author = username;
    let title = document.getElementById('formHeader').value;
    let permlink = 'post-' + parentPermlink.split(' ')[0] + '-' + Date.now().toString();
    let body = ckeditor.getData();
    //const body = formText.getData();
    /*let tagList = {
        tags: [findCheckedRadio()]
    };*/
    
    addToJsonMetadata([findCheckedRadio()], "tags");
    console.log(jsonMetadata);
    console.log('title: '+title+' body: '+body+' tags: '+parentPermlink+' permlink: '+permlink+' json: '+jsonMetadata);
    console.log(window.wif);
    /*golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function(err, result) {
        //console.log(err, result);
        if ( ! err) {
            document.getElementById('formHeader').value = '';
            ckeditor.setData('');
            closeAddFbForm();
            removeFbs();
            loadFbs();
        }
        
        else console.error(err);
    });*/
    
    
    
    //getContent and ONLY AFTER loadNotes();
    //SHOW MESSAGE ABOUT SUCCESSFUL SENDING
}
var addEventForBtnUploadImg = function() {
    document.getElementById('upload').addEventListener('click', function() {
        uploadImageToIpfs( function(files) {
            console.log(files);
            addToJsonMetadata(files, "image");
            files.forEach( function(item) {
                addImageToFb(item[0].path+item[0].hash);
                console.log('image to fb: '+item[0].path+item[0].hash);
            });
        });
    });
}
var addEventForFbCancel = function() {
    document.querySelector('.' + prefix + 'wrapper .frm-add-fb .btn-add-fb-cancel').addEventListener('click',function(){
        closeAddFbForm();
        loadFbs();
    });
}
var openAddFbForm = function() {
    removeFbs();
    createFromAddFb();
    document.querySelector('.' + prefix + 'btn-add-fb').style.display = 'none';
}
var closeAddFbForm = function() {
    if(document.querySelector('.' + prefix + 'btn-add-fb').style.display == 'none'){
        document.querySelector('.' + prefix + 'wrapper .frm-add-fb').remove();
        document.querySelector('.' + prefix + 'btn-add-fb').style.display = 'inline-block';
    }
}
var findCheckedRadio = function() {
    let res = '';
    Array.from(getBlockAddFb().getElementsByClassName('form-check-input')).forEach(function(item){
        if(item.checked == true){
            res = item.getAttribute('id').split('-')[1].toString();
        }
    });
    return res;
}

var getBlockAddFb = function() {
    return document.getElementsByClassName('frm-add-fb')[0];
}



//FEEDBACKS------------------------------------------------------------------------------
var loadFbs = function() {
    let tags = [domain];
    tags.push( (tagSelector == 'all') ? ['fb'] : ['fb', tagSelector]);
    
    var query = {
        select_tags: tags,
        //select_authors: ['test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9'],
        select_authors: ['beesocial-test','beesocial-test1','beesocial-test2','beesocial-test3','beesocial-test4'],
        limit: 100
    };

    console.log(query.select_tags);
    golos.api.getDiscussionsByCreated(query, function(err, result) {
        console.log(err, result);
        
        if ( ! err) {
            result.forEach(function(item) {
                console.log(item);
                createFb(formData(item));
            });
        }
        else console.error(err);
    });
    
    //загрузка тестового поста через permlink
    /*golos.api.getContent('test2', 'post-fb-1523961173281', function(err, result) {
        //console.log(err, result);
        if ( ! err) {
            console.log(result);
            createFb(formData(result));
        }
        else console.error(err);
    });*/
}
var formData = function(object) {
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
var createFb = function(data) {
    let note = document.createElement('div');
    note.className = 'row fb';
    note.setAttribute('id',data[0]);
    note.setAttribute('data-permlink',data[8]);
    note.setAttribute('data-opened',0);
    note.setAttribute('data-like',data[9]);
    note.innerHTML = "<div class='container body-fb tile'><div class='row'><div class='col-lg-9 col-md-9 text'><h3>"+data[1]+"</h3><p>"+data[2]+"</p><div class='buttons'><button type='button' class='btn btn-dark btn-show-comments'><span class='badge badge-light'>"+data[3]+"</span><span class='icon-message-square'></span><span class='icon-arrow-left hidden'></span><span class='hidden'> Back</span></button></div></div><div class='col-lg-3 col-md-3 controls'><div class='controls-wrapper'><div class='name'><h6>"+data[4]+"</h6></div><div class='photo'><img src='http://www.xn--80aefdbw1bleoa1d.xn--p1ai//plugins/uit/mychat/assets/img/no_avatar.jpg'></div><div class='date'><small>"+moment(data[5]).format('MMMM Do YYYY, h:mm:ss a')+"</small></div><div class='likes'><button type='button' class='btn btn-secondary btn-vote' data-like='1'><span class='badge badge-dark'>"+data[6]+"</span><span class='icon-thumbs-up'></span></button><button type='button' class='btn btn-secondary btn-vote' data-like='0'><span class='icon-thumbs-down'></span><span class='badge badge-dark'>"+data[7]+"</span></button></div></div></div></div></div><div class='container comments'></div>";
    document.querySelector('.'+prefix+'wrapper').appendChild(note);
    checkVoteColor(data[0], '');
    
    addEventsForCommentButtons(data[0]);
    addEventsForFbLikes(data[0]);
    addEventForFbHeader(data[0]);
    
    console.log('feedback has been created: id = ' + data[0]);
}
var addEventsForCommentButtons = function(fbId) {
    getBtnShowComment(fbId).addEventListener('click', function() {
        toggleFb(fbId);
    });
}
var expandFb = function(fbId) {
    golos.api.getContent(getAuthor(fbId,''), getPermlink(fbId,''), function(err, result) {
        //console.log(err, result);
        if (!err) {
            removeFbs();
            console.log(result);
            createFb(formData(result));
            toggleBtnCom(fbId);
            document.getElementById(fbId).setAttribute('data-opened', 1);
            loadComments(fbId);
            createCommentForm(fbId);
            setHash(fbId);
        }
        else console.error(err);
    });
}
var removeFbs = function() {
    Array.from(document.querySelectorAll('.' + prefix + 'wrapper .fb')).forEach( function(item) {
        item.remove();
    });
    closeAddFbForm();
    clearHash();
}
var checkVoteColor = function(fbId, comId) {
    let state = getVoteState(fbId, comId);
    if(state == -1) {
        delClassIfContains(getBtnVote(fbId, comId,1),'btn-success');
        getBtnVote(fbId, comId,0).classList.add('btn-danger');
    }else if(state == 0) {
        delClassIfContains(getBtnVote(fbId, comId,1),'btn-success');
        delClassIfContains(getBtnVote(fbId, comId,0),'btn-danger');
    }else if(state == 1) {
        delClassIfContains(getBtnVote(fbId, comId,0),'btn-danger');
        getBtnVote(fbId, comId,1).classList.add('btn-success');
    }
}
var toggleBtnCom = function(fbId) {
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
var addEventForFbHeader = function(fbId) {
    getFbHeader(fbId).addEventListener('click', function() {
        toggleFb(fbId);
    });
}
var toggleFb = function(fbId) {
    if(document.getElementById(fbId).getAttribute('data-opened') == '0') {
        expandFb(fbId);
    }else{
        removeFbs();
        loadFbs();
    }
}

var getBtnShowComment = function(fbId) {
    return document.getElementById(fbId).getElementsByClassName('btn-show-comments')[0];
}
var getFbHeader = function(fbId) {
    return document.getElementById(fbId).getElementsByClassName('text')[0].children[0];
}
//prototype getFbById(fbId) - take fb from existing here
//prototype getFbByPermlink(permlink) - take fb from the blockchain



//COMMENTS-------------------------------------------------------------------------------
var loadComments = function(fbId) {
    golos.api.getContentReplies(getAuthor(fbId, ''), getPermlink(fbId, ''), function(err, result) {
        //console.log(err, result);
        if ( ! err) {
            result.forEach(function(item) {
                console.log('getContentReplies', item);
                createComment(formDataCom(item, fbId));
            });
        }
        else console.error(err);
    });
}
var formDataCom = function(object, fbId) {
    var data = [];
    data.push(object.id);//0 - id
    data.push(fbId);//1 - parent ID
    data.push(object.body);//2 - body
    data.push(object.author);//3 - author
    data.push(object.created);//4 - created (date)
    let likes = 0;
    let dislikes = 0;
    object.active_votes.forEach(function(item) {
        if(item.percent>0) likes++;
        else if(item.percent<0) dislikes++;
    });
    data.push(likes);//5 - likes
    data.push(dislikes);//6 - dislikes
    data.push(object.permlink);//7 permlink
    data.push(getVoteStateOnload(object)/10000);// 8 vote of this user
    return data;
}
var createComment = function(data) {
    let comment = document.createElement('div');
    comment.className = 'row comment';
    comment.setAttribute('id',data[0]);
    comment.setAttribute('data-permlink',data[7]);
    comment.setAttribute('data-like',data[8]);
    comment.innerHTML = "<div class='col-lg-10 offset-lg-1 col-md-10 offset-md-1 tile body-comment'><div class='row'><div class='col-lg-9 col-md-9 text'><p>"+data[2]+"</p></div><div class='col-lg-3 col-md-3 controls'><div class='controls-wrapper'><div class='name'><h6>"+data[3]+"</h6></div><div class='photo'><img src='http://www.xn--80aefdbw1bleoa1d.xn--p1ai//plugins/uit/mychat/assets/img/no_avatar.jpg'></div><div class='date'><small>"+moment(data[4]).format('MMMM Do YYYY, h:mm:ss a')+"</small></div><div class='likes'><button type='button' class='btn btn-secondary btn-com-vote' data-like='1'><span class='badge badge-dark'>"+data[5]+"</span><span class='icon-thumbs-up'></span></button><button type='button' class='btn btn-secondary btn-com-vote' data-like='0'><span class='icon-thumbs-down'></span><span class='badge badge-dark'>"+data[6]+"</span></button></div></div></div></div></div>";
    getBlockComments(data[1]).appendChild(comment);
    checkVoteColor(data[1], data[0]);
    addEventsForComLikes(data[1], data[0]);
    console.log("comment has been created: " + data[1] + " " + data[0]);
}
var removeComments = function(fbId) {
    Array.from( getBlockComments(fbId).children ).forEach(function(item) {
        item.remove();
    });
}

var getComment = function(fbId, comId) {
    let comment;
    Array.from( getBlockComments(fbId).children ).forEach(function(item) {
        if( item.getAttribute('id') == comId) {
            comment = item;
        }
    });
    return comment;
}
var getBlockComments = function(fbId) {
    return document.getElementById(fbId).getElementsByClassName('comments')[0];
}
var getAddComForm = function(fbId) {
    return getBlockFormAddComment(fbId).children[0].children[0].children[0];
}



//FORM FOR ADDING NEW COMMENT-------------------------------------------------------------
function createCommentForm(fbId) {
    var commentForm = document.createElement('div');
    commentForm.className = 'container frm-add-com';
    commentForm.innerHTML = "<div class='row'><div class='col-lg-10 offset-lg-1 col-md-10 offset-md-1 tile'><form><div class='form-group'><textarea class='form-control txt-add-com' id='commentBody' rows='3' placeholder='Type your comment here'></textarea></div><div class='form-group'><button class='btn btn-dark' id='upload'>Attach images</button></div><button type='click' class='btn btn-primary btn-add-com-done'><span class='icon-checkmark'></span> Submit</button></form></div></div>";
    document.getElementById(fbId).appendChild(commentForm);
    
    addEventsForComDone(fbId);
    addEventForBtnUploadImg();
    clearJsonMetadata();
    
    ClassicEditor
    .create( document.querySelector( '#commentBody' )/*,{
             plugins: [ Essentials, Paragraph, Bold, Italic ],
        } */)
        .then( editor => {
            ckeditor = editor;
        } )
        .catch( err => {
            console.error( err.stack );
        } );
}
var addEventsForComDone = function(fbId) {
    getAddComForm(fbId).addEventListener('submit', function(e) {
        e.preventDefault();
        if(wif){
            sendAddComForm(fbId);
        }else{
            auth(sendAddComForm.bind(this, fbId));
        }
        return false;
    });
}
var sendAddComForm = function(fbId) {
    let parentAuthor = getAuthor(fbId, '');
    let parentPermlink = getPermlink(fbId, '');
    let author = username;
    let permlink = 're-' + parentAuthor + '-' + parentPermlink + '-' + Date.now();
    let title = '';
    let body = ckeditor.getData();
    console.log('comment to note '+fbId+'. Body: '+body);
    golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function(err, result) {
        //console.log(err, result);
        if (!err) {
            console.log('comment', result);
            getTxtareaCom(fbId).value = '';
            removeComments(fbId);
            loadComments(fbId);
        }
        else console.error(err);
    });
}

var getTxtareaCom = function(fbId) {
    return getBlockFormAddComment(fbId).getElementsByClassName('txt-add-com')[0];
}
var getBlockFormAddComment = function(fbId) {
    return document.getElementById(fbId).children[ document.getElementById(fbId).childElementCount-1 ];
}




//VOTING----------------------------------------------------------------------------------
//эти 4 функции похожи
var addEventsForFbLikes = function(fbId) {
    getBtnsVote(fbId, '').forEach(function(item) {
        item.addEventListener('click', function() {
            let isLike = Number(item.getAttribute('data-like'));
            if(wif) {
                voteForFb(fbId,isLike);
            }else{
                auth(voteForFb.bind(this, fbId, isLike));
            }
        });
    });
}
var voteForFb = function(fbId, like) {
    let weight;
    let state = getVoteState(fbId, '');
    (like == 1)? weight = 10000 : weight = -10000;
    weight = updateVoteState(fbId, '', weight/10000);
    golos.broadcast.vote(wif, username, getAuthor(fbId, ''), getPermlink(fbId, ''), weight, function(err, result) {
        console.log(err, result);
        if ( ! err) {
            setLblVote(fbId, '', weight/10000, state);
            checkVoteColor(fbId, '');
        }
    });
}
var addEventsForComLikes = function(fbId, comId) {
    getBtnsVote(fbId, comId).forEach(function(item) {
        item.addEventListener('click', function() {
            let isLike = Number(item.getAttribute('data-like'));
            if(wif) {
                voteForCom(fbId, comId, isLike);
            } else {
                auth(voteForCom.bind(this, fbId, comId, isLike));
            }
        });
    });
}
var voteForCom = function(fbId, comId, like) {
    let weight;
    let state = getVoteState(fbId, comId);
    (like == 1)? weight = 10000 : weight = -10000;
    weight = updateVoteState(fbId, comId, weight/10000);
    golos.broadcast.vote(wif, username, getAuthor(fbId, comId), getPermlink(fbId, comId), weight, function(err, result){
        console.log(err, result);
        if ( ! err) {
            setLblVote(fbId, comId, weight/10000, state);
            checkVoteColor(fbId, comId);
        }
    });
}

var getBtnVote = function(fbId, comId, isLike) {
    let btn;
    if(comId) {
        btn = getBlockControls(fbId, comId).getElementsByClassName('btn-com-vote')[ 1-isLike ];
    }else{
        btn = getBlockControls(fbId, '').getElementsByClassName('btn-vote')[ 1-isLike ];
    }
    return btn;
}
var getBtnsVote = function(fbId, comId) {
    if(comId) {
        return Array.from( getComment(fbId, comId).getElementsByClassName('btn-com-vote') );
    }else{
        return Array.from( getBlockControls(fbId, '').getElementsByClassName('btn-vote') );
    }
}




//OTHER FUNCTIONS


/*Removes class from the given element if it contains it*/
var delClassIfContains = function (element, className) {
    if(element.classList.contains(className)) {
        element.classList.remove(className);
    }
}

/*Calculates and sets a new vote state of a feedback or comment depending of their state and given vote*/
var updateVoteState = function(fbId, comId, vote) {
    let state = getVoteState(fbId, comId);
    let res;
    
    //setting up new state depending on the pressed button
    if(vote == -1 && state != -1) res = -1;
    if(vote == 1 && state != 1) res = 1
    if(vote*state > 0) res = 0;
    
    if(comId) {
        getComment(fbId, comId).setAttribute('data-like', res);
    } else {
        document.getElementById(fbId).setAttribute('data-like', res);
    }
    //setLblVote(fbId,comId,state,res);
    //checkVoteColor(fbId,comId);
    return res*10000;
}

/*Returns the block with info & controll buttons of a feedback or comment*/
var getBlockControls = function(fbId, comId){
    if(comId) {
        return getComment(fbId, comId).getElementsByClassName('controls')[0];
    } else {
        return document.getElementById(fbId).getElementsByClassName('controls')[0];
    }
}

/*Gets the permlink parameter of the given feedback or comment*/
var getPermlink = function(fbId, comId){
    let result;
    if(comId) {
        result = getComment(fbId, comId).getAttribute('data-permlink');
    } else {
        result = document.getElementById(fbId).getAttribute('data-permlink');
    }
    return result;
}

/*Gets the author's name of the given feedback of comment*/
var getAuthor = function(fbId, comId){
    let result;
    if(comId) {
        result = getBlockControls(fbId, comId);
    } else {
        result = getBlockControls(fbId, '');
    }
    return result.getElementsByClassName('name')[0].children[0].innerHTML;
}

/*Gets the current vote state of a feedback or comment*/
var getVoteState = function(fbId,comId){
    let state;
    if(comId) {
        state = Number(getComment(fbId, comId).getAttribute('data-like'));
    } else {
        state = Number(document.getElementById(fbId).getAttribute('data-like'));
    }
    return state;
}

/*Gets the vote state relatively to the current user if he has signed in*/
var getVoteStateOnload = function(object) {
    let result = 0;
    if(wif) {
        object.active_votes.forEach(function(item) {
            if(item.voter == username) {
                result = item.percent;
            }
        });
    } else {
        result = 0;
    }
    return result;
}

/*Sets the number of likes or dislikes on the label in a comment or feedback control panel*/
//упростить
var setLblVote = function(fbId, comId, val, val0) {
    let likes;
    let dislikes;
    let label;
    if(val == 0 || val0 == 0) {//одиночные изменения
        
        //нажатие на дизлайк
        if(val == -1 || val0 == -1) label = getBtnVote(fbId, comId, 0).children[1];
        //нажатие на лайк
        if(val == 1 || val0 == 1) label = getBtnVote(fbId, comId, 1).children[0];
        
        likes = Number(label.innerHTML);
        
        //изменение числа
        if(val == 0) likes--;
        if(val0 == 0) likes++;
        label.innerHTML = likes;
        
    } else if(val != 0 && val0 != 0){
        //двойное изменение
        likes = Number(getBtnVote(fbId, comId, 1).children[0].innerHTML);
        dislikes = Number(getBtnVote(fbId, comId, 0).children[1].innerHTML);
        if(val == 1){
            //нажатие на лайк
            likes++;
            dislikes--;
        } else {
            //нажатие на дизлайк
            likes--;
            dislikes++;
        }
        getBtnVote(fbId, comId, 1).children[0].innerHTML = likes;
        getBtnVote(fbId, comId, 0).children[1].innerHTML = dislikes;
    }
}

/*checks the color of vote buttons and sets it according to actual vote state*/
var checkVoteColor = function(fbId, comId) {
    let state = getVoteState(fbId, comId);
    if(state == -1) {
        delClassIfContains(getBtnVote(fbId, comId, 1),'btn-success');
        getBtnVote(fbId, comId, 0).classList.add('btn-danger');
    } else if(state == 0) {
        delClassIfContains(getBtnVote(fbId, comId, 1),'btn-success');
        delClassIfContains(getBtnVote(fbId, comId, 0),'btn-danger');
    } else if(state == 1) {
        delClassIfContains(getBtnVote(fbId, comId, 0),'btn-danger');
        getBtnVote(fbId, comId, 1).classList.add('btn-success');
    }
}

/*Sets the default statement of the json*/
var clearJsonMetadata = function() {
    jsonMetadata = '{"tags":['+domain+'],"images":[]}';
}

/*Adds the image tag to the current text in textbox of a texteditor*/
var addImageToFb = function(path) {
    let text = ckeditor.getData();
    text += '<img src='+path+'>';
    ckeditor.setData(text);
}

/*Adds data of different types to the json*/
var addToJsonMetadata = function( element, mode){
    let parsed = {};
    parsed = JSON.parse(jsonMetadata);
    console.log(parsed);
    console.log(element);
    if(mode == "tags") {
        
        parsed.tags = element;
    }
    if(mode == "image") {
        element.forEach(function(item) {
            parsed.images.push(item);    
        });
        
    }
    console.log(parsed);
    jsonMetadata = JSON.stringify(parsed);
}

/**/
var setHash = function(fbId) {
    location.hash = getAuthor(fbId, '') + '/' + getPermlink(fbId, '');
}
var clearHash = function() {
    location.hash = '';
}