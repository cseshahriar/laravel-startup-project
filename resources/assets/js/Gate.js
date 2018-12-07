export default  class Gate{
	constructor(user) {
		this.user = user; 
	}

	isAdmin() {
		return this.user.type === 'admin';  
	}

	isUser() {
		return this.user.type === 'user';   
	}

	isAdminOrAuthor() {
		//return this.user.type === 'user';   
		if (this.user.type === 'user' || this.user.type === 'author') { 
			return true;
		}
	}

	isAuthorOrUser() {
		//return this.user.type === 'user';   
		if (this.user.type === 'author' || this.user.type === 'user') {  
			return true;
		}
	}
}

