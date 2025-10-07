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
	"find_btn"
];

// 로그인 확인
function is_online() {
	return localStorage.getItem('online') == 'true';
}

// 메인 화면 / todo, 작성 글, 댓글
function resetMain() {
	if (!is_online()) {
		todo_list.textContent = "로그인하시면 todo list를 이용하실 수 있습니다 :)";
		my_post.textContent = "회원님의 생각을 마음껏 작성해 주세요!";
		my_comment.textContent = "다른 회원님과 생각을 공유해보시는 건 어떤가요?";
		document.querySelector(`[name="home_btn"]`).classList.remove('hide');
		document.getElementById('log_off').classList.remove('hide');
		document.getElementById('log_on').classList.add('hide');
	} else {
		todo_list.textContent = "test";
		my_post.textContent = "test";
		my_comment.textContent = "test";
		document.querySelector(`[name="home_btn"]`).classList.remove('hide');
		document.getElementById('log_off').classList.add('hide');
		document.getElementById('log_on').classList.remove('hide');
	}
}
resetMain();

// 온라인 체크
function online_check() {
	alert("죄송합니다. \n저희 사이트는 로그인을 하셔야 이용이 가능합니다. :)");
	btmIds.forEach(btn_name => {
		const btn = document.querySelector(`[name="${btn_name}"]`);
		if (btn_name !== 'login_btn') {
			btn.classList.add('hide')
		} else {
			btn.classList.remove('hide')
		};
	});
}

// console_success(route)
function console_success(route) {
	console.log(`[${route} 실행 완료]`);
	console.log('------------------------------------------------');
}

// fetchDB(route)
async function fetchDB(route) {
	const res = await fetch(`http://localhost:7000/${route}`);
	if (!res.ok) throw new Error('[fetchDB(route) 에러 발생]');
	return res.json();
}

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
}

// 게시글 리스트 출력
async function postBtn(btn) {
	if (btn == 'posts_btn' || btn == 'write_form') {
		const tbody = document.querySelector('#posts_table tbody');
		try {
			const result = await fetchDB('posts');
			tbody.innerHTML = ''; // 게시글 리스트 초기화 후 새로 출력해 줌
			result.forEach(item => tbody.appendChild(makeRow(item))); // makeRow = tr 반환
			document.querySelectorAll('.post_click').forEach(item => {
				item.addEventListener('click', function() { // 게시글 클릭 이벤트
					if (!is_online()) { // 온라인 체크
						online_check();
						return;
					}
					console.log(this.children[1].innerHTML);
				});
			});
		} catch (err) {
			console_err(err);
		};
	};
};

// 게시글 행(tr) 생성
function makeRow(item) {
	const fields = ["POST_NO", "POST_TITLE", "USER_ID"];
	const tr = document.createElement('tr');
	fields.forEach(f => {
		const td = document.createElement('td');
		td.textContent = item[f];
		tr.appendChild(td);
	});
	tr.classList.add('post_click');
	return tr;
};

// 닫기 버튼
document.querySelectorAll(`[name="close_btn"]`).forEach(item => {
	item.addEventListener('click', function(e) {
		e.preventDefault();
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

async function btnClick(e) { // nav 버튼 속 if문 안에 쓰임
	e.preventDefault();
	const btnName = this.dataset.name;
	btmIds.forEach(item => {
		const section = document.querySelector(`[name="${item}"]`);
		if (item != btnName) {
			section.classList.add('hide');
			return;
		}
		section.classList.remove('hide');
	});
	postBtn(this.id); // post, write 게시글 리스트 출력 버튼
	if (btnName == 'sign_btn') { // 회원가입 버튼
		try {
			const res = await fetch('http://localhost:7000/idCheck');
			const ID_data = await res.json(); // id 중복 체크 데이터를 가져옴
			idCheck = ID_data.map(value => value.USER_ID);
		} catch (err) {
			console.log(err);
		}
	};
	if (btnName == 'logout_btn') { // 로그아웃 버튼
		localStorage.setItem('user_id', '');
		localStorage.setItem('online', 'false');
		resetMain();
		alert("시간내어 주셔서 감사합니다. \n앞으로도 많은 관심 부탁드려요 :)");
	};
}

// 글 작성
document.getElementById('write_form').addEventListener('submit', function(e) {
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
		alert("제목 및 내용을 입력해 주세요. :(");
		return;
	};
	postJSON(write_data, 'write');
	this.reset();
	postBtn(this.id);
	document.querySelector(`[name="posts_btn"]`).classList.remove('hide');
	document.querySelector(`[name="write_btn"]`).classList.add('hide');
});

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
	if (data.sign_pw !== pwCheck) {
		alert("동일한 PW를 입력해주세요.");
		return;
	};
	postJSON(data, 'sign');
	alert("뉴페이스는 오랜만이네요! 반가워요 :)");
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
	if (dbData.success) {
		this.closest('.modal').classList.add('hide');
		this.reset();
		document.querySelector(`[name="home_btn"]`).classList.remove('hide');
		document.getElementById('log_off').classList.add('hide');
		document.getElementById('log_on').classList.remove('hide');
		localStorage.setItem('user_id', dbData.data.user_id);
		localStorage.setItem('online', 'true');
		resetMain();
		alert(`반갑습니다 ${htmlData.user_id}. \n오늘 하루는 어땠나요?`);
	} else {
		alert("ID 또는 PW가 맞지 않습니다. \n다시 확인해 보시는 건 어떨까요?");
	}
});