class Post {
  constructor(id, title, content, authorId, status = 'draft') {
    this.id = id;
    this.title = title;
    this.content = content;
    this.authorId = authorId;
    this.status = status; // 'draft' or 'published'
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Static method to create a new post
  static create(postData) {
    const { title, content, authorId, status } = postData;
    return new Post(null, title.trim(), content.trim(), parseInt(authorId), status || 'draft');
  }

  // Update post data
  update(postData) {
    const { title, content, status } = postData;
    if (title !== undefined) this.title = title.trim();
    if (content !== undefined) this.content = content.trim();
    if (status !== undefined) this.status = status;
    this.updatedAt = new Date();
    return this;
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      authorId: this.authorId,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Validation method
  validate() {
    const errors = [];
    
    if (!this.title || this.title.trim().length === 0) {
      errors.push('Title is required');
    } else if (this.title.trim().length > 200) {
      errors.push('Title must not exceed 200 characters');
    }
    
    if (!this.content || this.content.trim().length === 0) {
      errors.push('Content is required');
    } else if (this.content.trim().length > 10000) {
      errors.push('Content must not exceed 10000 characters');
    }
    
    if (!this.authorId || isNaN(this.authorId) || this.authorId <= 0) {
      errors.push('Valid author ID is required');
    }
    
    if (this.status && !['draft', 'published'].includes(this.status)) {
      errors.push('Status must be either "draft" or "published"');
    }
    
    return errors;
  }
}

module.exports = Post;