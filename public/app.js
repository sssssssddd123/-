// 자동 로그인
const todo_list = document.getElementById('todo_list');
const my_post = document.getElementById('my_post');
const my_comment = document.getElementById('my_comment');

const btmIds = [
	"home_btn",
	"posts_btn",
	"write_btn",
	"login_btn",
	"logout_btn",
	"sign_btn",
	"find_btn",
	"to_do_btn"
];

// fetchDB(route)
async function fetchDB(route) {
	const res = await fetch(`http://localhost:7000/${route}`);
	if (!res.ok) throw new Error('[fetchDB(route) 에러 발생]');
	return res.json();
};

// postJSON(data, route)
async function postJSON(data, route) {
	try {
		const res = await fetch(`http://localhost:7000/${route}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=UTF-8' },
			body: JSON.stringify(data)
		});
		const resData = await res.json();
		return resData;
	} catch (err) {
		console.log(err);
		return { success: false, message: "[postJSON(data, route) 에러 발생]" };
	}
};

// 로그인 확인
function is_online() {
	return localStorage.getItem('online') == 'true';
};

// 온라인 체크
function online_check() {
	alert("로그인을 해주세요.");
	btmIds.forEach(btn_name => {
		const btn = document.querySelector(`[name="${btn_name}"]`);
		if (btn_name !== 'login_btn') {
			btn.classList.add('hide')
		} else {
			btn.classList.remove('hide')
		};
	});
};

// to do list를 만들어 줌
function makeTodo(data, tag) {
	tb = document.createElement(tag);
	data.forEach(item => {
		td = document.createElement('td');
		tr = document.createElement('tr');
		td.innerText = item["TODO_CONTENT"];
		td.dataset.todo_no = item["TODO_NO"];
		td.setAttribute('class', 'todo_item');
		td.addEventListener('click', async function() { // to do 삭제 기능
			if (this.classList.contains('done')) {
				const todoDel = confirm("삭제하시겠습니까?");
				if (todoDel) {
					const data = { todo_no: this.dataset.todo_no };
					await postJSON(data, "todoDel");
					this.closest('tr').remove();
				}
			}
			this.classList.toggle('done'); // 완료 표시
		});
		tr.appendChild(td);
		tb.appendChild(tr);
	});
	return tb;
};

// my 댓글 list를 만들어 줌
function makeMyComList(data) {
	const thisDiv = document.getElementById('my_comment');
	data.forEach(item => {
		span = document.createElement('span');
		span.innerText = item["POST_COMMENT"];
		span.dataset.comment_no = item["COMMENT_NO"];
		span.setAttribute('class', 'myCom_item');
		span.addEventListener('click', async function() { // my 댓글 삭제 기능
			const myCommentDel = confirm("삭제하시겠습니까?");
			if (myCommentDel) {
				const data = { comment_no: this.dataset.comment_no };
				await postJSON(data, "myCommentDel");
				this.closest('span').remove();
			}
		});
		thisDiv.appendChild(span);
	});
};

// my Posts list를 만들어 줌
function makeMyPostsList(data) {
	const thisDiv = document.getElementById('my_post');
	data.forEach(item => {
		span = document.createElement('span');
		span.innerText = item["POST_TITLE"];
		span.dataset.post_no = item["POST_NO"];
		span.setAttribute('class', 'myPost_item');
		span.addEventListener('click', async function() { // my Posts 삭제 기능
			const myCommentDel = confirm("삭제하시겠습니까?");
			if (myCommentDel) {
				const data = { post_no: this.dataset.post_no };
				await postJSON(data, "myPostsDel");
				this.closest('span').remove();
			}
		});
		thisDiv.appendChild(span);
	});
};


// 메인 화면
// todo, 작성 글, 댓글
async function todoListAdd() { // to do list 만들기위한 DB를 가져옴
	const data = { user_id: localStorage.getItem('user_id') };
	const todoDB = await postJSON(data, "todoDBget");
	todo_list.innerHTML = "";
	todo_list.appendChild(makeTodo(todoDB, 'todo_tbody'));
};

// 댓글 list를 화면에 출력해 줌
async function myComListAdd() {
	const data = { user_id: localStorage.getItem('user_id') };
	const myComDB = await postJSON(data, "myCommentGet");
	document.getElementById('my_comment').innerHTML = "";
	makeMyComList(myComDB);
}

// Posts list를 화면에 출력해 줌
async function myPostsListAdd() {
	const data = { user_id: localStorage.getItem('user_id') };
	const myPostsDB = await postJSON(data, "myPostsGet");
	document.getElementById('my_post').innerHTML = "";
	makeMyPostsList(myPostsDB);
}

// to do를 서버에 전송
document.getElementById('todo_form').addEventListener('submit',
	async function(e) {
		e.preventDefault();
		const todoData = {
			user_id: localStorage.getItem('user_id'),
			todo_content: this.querySelector('input').value
		};
		await postJSON(todoData, "todoAdd");
		await resetMain();
	}
);

function resetMain() { // main 화면 reset
	if (!is_online()) {
		todo_list.textContent = "로그인을 하시면 to do list를 이용하실 수 있습니다";
		my_post.textContent = "내가 쓴 글들";
		my_comment.textContent = "내가 작성한 댓글들";
		document.querySelector(`[name="home_btn"]`).classList.remove('hide');
		document.getElementById('log_off').classList.remove('hide');
		document.getElementById('log_on').classList.add('hide');
	} else {
		todoListAdd(); // to do list 출력
		myPostsListAdd() // my Posts list 출력
		myComListAdd() // my 댓글 list 출력
		document.querySelector(`[name="home_btn"]`).classList.remove('hide');
		document.getElementById('log_off').classList.add('hide');
		document.getElementById('log_on').classList.remove('hide');
	}
}
resetMain();

// 게시글 리스트 출력
const postCloseBtn = document.querySelector(`[name="posts_modal"] button`);
const postModal = document.querySelector(`[name="posts_modal"]`);
async function postBtn(btn) {
	if (btn == 'posts_btn' || btn == 'write_form') {
		const tbody = document.querySelector('#posts_table tbody');
		try {
			const result = await fetchDB('posts');
			tbody.innerHTML = ''; // 게시글 리스트 초기화 후 새로 출력해 줌
			result.forEach(item => tbody.appendChild(makeRow(item))); // makeRow = tr 반환
			document.querySelectorAll('.post_click').forEach(item => {
				item.addEventListener('click', async function() { // 게시글 클릭 이벤트
					if (!is_online()) { // 온라인 체크
						online_check();
						return;
					};
					const postNo = this.querySelectorAll('td')[0].innerText;
					const thisData = result.find(item => item.POST_NO == postNo);
					const commentsDB = await postJSON({ postNo: postNo }, 'postComments');
					for (let item in thisData) { // 게시글 본문(제목, 작성자, 작성시간, 내용)
						let thisModal = document.querySelector(`[name=${item}]`);
						if (thisModal) {
							thisModal.innerText = thisData[item];
						}
					};
					postModal.classList.remove('hide');
					let postComment = document.getElementById('comment_list'); // 댓글 리스트
					postComment.innerHTML = "";
					if (commentsDB.length == 0) {
						let div = document.createElement('div'); // 댓글 div
						let span = document.createElement('span'); // 댓글 작성자
						let p = document.createElement('p'); // 댓글 내용
						span.innerText = "빈 댓글 test";
						p.innerText = "빈 댓글 test";
						span.setAttribute('class', 'comment_user');
						p.setAttribute('class', 'comment_text');
						div.setAttribute('class', 'comment_item');
						div.appendChild(span);
						div.appendChild(p);
						postComment.parentElement.dataset.name = postNo;
						postComment.appendChild(div);
						return;
					};
					commentsDB.forEach(item => {
						let div = document.createElement('div'); // 댓글 div
						let span = document.createElement('span'); // 댓글 작성자
						let p = document.createElement('p'); // 댓글 내용
						span.innerText = item.USER_ID;
						p.innerText = item.POST_COMMENT;
						span.setAttribute('class', 'comment_user');
						p.setAttribute('class', 'comment_text');
						div.setAttribute('class', 'comment_item');
						div.appendChild(span);
						div.appendChild(p);
						postComment.parentElement.dataset.name = postNo;
						postComment.appendChild(div);
					});
				});
			});
		} catch (err) {
			console_err(err);
		};
	};
};

// makeRow(item) 게시글 행(tr) 생성
function makeRow(item) {
	const fields = ["POST_NO", "POST_TITLE", "USER_ID"];
	const tr = document.createElement('tr');
	fields.forEach(field => {
		const td = document.createElement('td');
		td.dataset.name = field;
		td.innerText = item[field];
		tr.appendChild(td);
	});
	tr.classList.add('post_click');
	return tr;
};

// 닫기 버튼
document.querySelectorAll(`[name="close_btn"]`).forEach(item => {
	item.addEventListener('click', function(e) {
		e.preventDefault();
		if (this == postCloseBtn) {
			this.closest('.modal').classList.add('hide');
			return;
		};
		document.querySelector(`[name="home_btn"]`).classList.remove('hide');
		this.closest('.modal').classList.add('hide');
	});
});

// nav 버튼
btmIds.forEach(item => {
	const btn = document.getElementById(item);
	if (btn) {
		btn.dataset.name = item;
		btn.addEventListener('click', btnClick);
	};
});

// btnClick(e)
async function btnClick(e) { // nav 버튼 속 if문 안에 쓰임
	e.preventDefault();
	const btnName = this.dataset.name;
	if (btnName == "to_do_btn") {
		if (!is_online()) {
			online_check();
			return;
		}
		document.querySelector(`[name="to_do_btn"]`).classList.remove('hide');
	};
	btmIds.forEach(item => {
		const section = document.querySelector(`[name="${item}"]`);
		if (item != btnName) {
			section.classList.add('hide');
			return;
		};
		section.classList.remove('hide');
	});
	postBtn(this.id); // post, write 게시글 리스트 출력 버튼
	if (btnName == 'sign_btn') { // 회원가입 버튼
		try {
			const res = await fetch('http://localhost:7000/idCheck');
			const ID_data = await res.json(); // id 중복 체크 데이터를 가져옴
			// console.log(ID_data);
			idCheck = ID_data.map(value => value.USER_ID);
		} catch (err) {
			console.log(err);
		}
	};
	if (btnName == 'logout_btn') { // 로그아웃 버튼
		localStorage.setItem('user_id', '');
		localStorage.setItem('online', 'false');
		resetMain();
		alert("log out");
	};
}

// 글 작성
document.getElementById('write_form').addEventListener('submit',
	async function(e) {
		e.preventDefault();
		if (!is_online()) {
			online_check();
			return;
		}
		const write_data = {
			write_id: localStorage.getItem('user_id'),
			write_title: document.getElementById('write_title').value,
			write_content: document.getElementById('write_content').value
		};
		if (Object.values(write_data).some(field => !field)) {
			alert("제목 및 내용을 입력해 주세요.");
			return;
		};
		await postJSON(write_data, 'write');
		this.reset();
		postBtn(this.id);
		document.querySelector(`[name="posts_btn"]`).classList.remove('hide');
		document.querySelector(`[name="write_btn"]`).classList.add('hide');
	}
);

// 댓글 작성
document.getElementById('comment_form').addEventListener('submit',
	async function(e) {
		e.preventDefault();
		const commentData = {
			post_no: this.parentElement.dataset.name,
			user_id: localStorage.getItem('user_id'),
			post_comment: this.querySelectorAll('input')[0].value
		};
		await postJSON(commentData, "commentAdd");
		postModal.classList.add('hide');
		this.querySelectorAll('input')[0].value = "";
		const newCommentsDB = await postJSON({
			postNo: commentData.post_no
		}, 'postComments');
		let postComment = document.getElementById('comment_list'); // 댓글 리스트
		postComment.innerHTML = "";
		newCommentsDB.forEach(item => {
			let div = document.createElement('div'); // 댓글 div
			let span = document.createElement('span'); // 댓글 작성자
			let p = document.createElement('p'); // 댓글 내용
			span.innerText = item.USER_ID;
			p.innerText = item.POST_COMMENT;
			span.setAttribute('class', 'comment_user');
			p.setAttribute('class', 'comment_text');
			div.setAttribute('class', 'comment_item');
			div.appendChild(span);
			div.appendChild(p);
			postComment.parentElement.dataset.name = commentData.post_no;
			postComment.appendChild(div);
			postModal.classList.remove('hide');
		})
	}
);

// 회원가입
let idCheck = []; // btnClick(e) 함수 속에 사용하는 전역변수
document.getElementById('sign_form').addEventListener('submit', async function(e) {
	e.preventDefault();
	const data = {};
	const pwCheck = document.getElementById('sign_pwcheck').value;
	const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
	const noWords = /\s/;
	this.querySelectorAll('input').forEach(item => {
		if (item.name && item.name != 'sign_pwcheck') { // pwCheck를 제외한 input 값을 data에 입력
			data[item.name] = item.value.trim();
		};
	});
	if (idCheck.some(field => field == data.sign_id)) {
		alert("이미 사용중인 ID 입니다.");
		return;
	};
	if (Object.keys(data).some(key => noWords.test(String(data[key])))) {
		alert("공백을 제외하고 입력해주세요.");
		return;
	};
	if (korean.test(data.sign_id)) {
		alert("ID는 영어, 숫자, 특수문자만 사용 가능합니다.");
		return;
	};
	if (data.sign_pw != pwCheck) {
		alert("동일한 PW를 입력해주세요.");
		return;
	};
	await postJSON(data, 'sign');
	alert("반갑습니다.");
	document.querySelector(`[name="home_btn"]`).classList.remove('hide');
	this.closest('.modal').classList.add('hide');
});

// 로그인
document.getElementById('login_form').addEventListener('submit', async function(e) {
	e.preventDefault();
	const htmlData = {
		user_id: document.getElementById('user_id').value,
		user_pw: document.getElementById('user_pw').value
	};
	const dbData = await postJSON(htmlData, 'login');
	if (!dbData.success) {
		alert("ID 또는 PW가 맞지 않습니다.");
		return;
	};
	this.closest('.modal').classList.add('hide');
	this.reset();
	document.querySelector(`[name="home_btn"]`).classList.remove('hide');
	document.getElementById('log_off').classList.add('hide');
	document.getElementById('log_on').classList.remove('hide');
	localStorage.setItem('user_id', dbData.data);
	localStorage.setItem('online', 'true');
	await resetMain();
	alert(`반갑습니다 ${localStorage.getItem('user_id')}.`);
});