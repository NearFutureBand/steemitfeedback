class GolosController {
    constructor() {
        
    }
    getFeedbacks( callback ) {
        var query = {
            select_tags: ['fb', this.domain ],
            select_authors: ['test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9'],
            limit: 100
        };
        
        //TODO make a function createFb(fb)
        golos.api.getDiscussionsByBlog(query, function(err, result) {
            console.log(err, result);
            
            if ( ! err) {
                if( result.length != 0) {
                    result.forEach( function(fb) {
                        if( $.filterFb(fb) ) {
                            $.createFb(fb);
                        }
                    });
                    
                    if($.feedbacks.length == 0) {
                        //create empty fb
                        console.log('Create empty fb');
                    } else {
                        $.placeFbs();
                    }
                } else {
                    //create empty fb
                    console.log('Create empty fb');
                }
                
            } else {
                console.error(err);
                //showError(err.message);
            }
        });
    }
}