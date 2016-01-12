Template.postEdit.events({ 

	'submit form': function(e) {
	    e.preventDefault();
		var postProperties = {
			_id: this._id,
			url: $(e.target).find('[name=url]').val(), 
			title: $(e.target).find('[name=title]').val()
		}

		Meteor.call('postUpdate',postProperties, function(error,result) { 
			if (error)
		        // display the error to the user
				return throwError(error.reason); 
			if(result.postExists)
				throwError('This link has already been submitted');
			
		   	Router.go('postPage', {_id:result._id});
		    
		}); 
	},
	
	'click .delete': function(e) { 
		e.preventDefault();
		if (confirm("Delete this post?")) { 
			var currentPostId = this._id; 
			Meteor.call('postDelete',currentPostId); 
			Router.go('postsList');
		}
	}
});