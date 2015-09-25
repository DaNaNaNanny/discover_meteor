Comments = new Mongo.Collection('Comments');

Meteor.methods({
  commentInsert: function(commentAttributes) {
    check(this.userId, String);
    check(commentAttributes, {
      postId: String,
      body: String
    });
    var user = Meteor.user();
    var post = Posts.findOne(commentAttributes.postId);
    if (!post)
      throw new Meteor.Error('invalid-comment', 'You must comment on a post');
    comment = _.extend(commentAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });
		
		//update the post with the number of comments
		Posts.update(comment.postId, {$inc: {commentsCount: 1}});
		
		//create the comment, save the id
		comment._id = Comments.insert(comment);
		//now create the notification, informing the reciever of a comment
		createCommentNotification(comment);
		return comment._id;
	}
});
