Posts = new Mongo.Collection('posts');

validatePost = function(post) {
	var errors = {};
	if (!post.title)
		errors.title = "Please fill in a headline";
	if (!post.url)
		errors.url = "Please fill in a URL";
	return errors;
}

Meteor.methods({
	postDelete: function(currentPostId) {
		check(currentPostId,String);
		Posts.remove(currentPostId);
	},

	postUpdate: function(postProperties) {
		check(postProperties, {_id:String, title:String, url:String});

		var currentPostId = postProperties._id;

        var newTitle = postProperties.title;

        var newUrl =  postProperties.url;

		var postWithSameLink = Posts.findOne({
			url: postProperties.url, 
			_id: {$ne: currentPostId} });

		if (postWithSameLink){
			return {
				postExists:true,
				_id: postWithSameLink._id
			}
		};

        var changed = Posts.update({_id: currentPostId}, {$set: {
            title: newTitle,
            url: newUrl
        	}
        });
		return {
			_id: currentPostId
		}
	},

	postInsert: function(postAttributes) {
	    check(Meteor.userId(), String);
	    check(postAttributes, {
	      title: String,
	      url: String
	    });

	    var errors = validatePost(postAttributes);
	    if (errors.title || errors.url)
	    	throw new Meteor.Error('invalid-post',
	    		"You must set a title and URL for your post");

	    var postWithSameLink = Posts.findOne({url: postAttributes.url});
	    if (postWithSameLink){
	    	return {
	    		postExists:true,
	    		_id: postWithSameLink._id
	    	}
	    }

		var user = Meteor.user();
		var post = _.extend(postAttributes, {
			userId: user._id, 
			author: user.username, 
			submitted: new Date()
		});
		var postId = Posts.insert(post);
		return {
			_id: postId
		}; 
	}
});