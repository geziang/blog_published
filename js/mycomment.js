function av() {
	var apiurl = mycomment.apiurl;
	var apiurl_count = apiurl+"/count";
	
	function init() {
		console.log("AV init");
	}
	
	function dummy() {}
	
	function Comment(){}

	Comment.prototype.get = function(k){
		return this[k];
	}
	
	Comment.prototype.set = function(k,v){
		if (k == "createdAt") {
			this[k] = new Date(v);
		} else {
			this[k] = v;
		}
	}
	
	Comment.prototype.setACL = dummy;
	
	Comment.prototype.save = function(){
		var that = this;
		var p = new Promise(function(resolve, reject){
			console.log(that);
			if (that.comment) {
				$.post(apiurl,that,function(result){
					if ( result["error"] && result["error"] == "ratelimit" ) {
						alert("您的操作太频繁啦~一会再试吧");
					} else {
						let comment = new Comment();
						for (let j in result) {
							if (result.hasOwnProperty(j)) {
								let _v = result[j];
								comment.set(j, _v);
							}
						}
						resolve(comment);
					}
				});
			}
		});
		return p;
	}
	
	function Query() {
		var url;
		var qlimit;
		var qskip;
		
		function equalTo(k, v) {
			if (k == "url") {
				url = v;
			}
		}
		
		function limit(v) {
			qlimit = v;
		}
		
		function skip(v) {
			qskip = v;
		}
		
		function find() {
			var p = new Promise(function(resolve, reject){
				console.log("get comments for url="+url+" limit="+qlimit+" skip="+qskip);
				$.get(apiurl,{url:url,skip:qskip,limit:qlimit},function(result){
					let ret = [];
					for (let i in result) {
						let comment = new Comment();
						let jsonComment = result[i];
						for (let j in jsonComment) {
							if (jsonComment.hasOwnProperty(j)) {
								let _v = jsonComment[j];
								comment.set(j, _v);
							}
						}
						ret.push(comment);
					}
					resolve(ret);
				});
			});
			return p;
		}
		
		function count() {
			var p = new Promise(function(resolve, reject){
				console.log("count comments for url="+url);
				$.get(apiurl_count,{url:url},function(result){
					resolve(result);
				});
			});
			return p;
		}
		
		return {
			equalTo: equalTo,
			descending: dummy,
			addDescending: dummy,
			doesNotExist: dummy,
			limit: limit,
			skip: skip,
			find: find,
			count: count
		}
	}
	Query.or = Query;
	Query.doCloudQuery = function(str) {
		var p = new Promise(function(resolve, reject){
			console.log("doCloudQuery "+str);
			
			resolve([]);
		});
		return p;
	};
	
	function ACL() {}
	ACL.prototype.setPublicReadAccess = dummy;
	ACL.prototype.setPublicWriteAccess = dummy;
		
	function getObj() {
		return {
			extend: function() {
				return Comment;
			}
		}
	}
	
	return {
		init: init,
		Query: Query,
		ACL: ACL,
		Object: getObj()
	}
}
window.AV = av();