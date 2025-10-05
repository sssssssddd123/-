//

// 자동 로그인
let todo_list = document.getElementById('todo_list');
let my_post = document.getElementById('my_post');
let my_comment = document.getElementById('my_comment');

function isOnline() {
	return localStorage.getItem('online') == 'true';
}

function resetMain() {
	if (!isOnline()) {
		todo_list.innerHTML = "로그인하시면 todo list를 이용하실 수 있습니다 :)";
		my_post.innerHTML = "회원님의 생각을 마음껏 작성해 주세요!"; 
		my_comment.innerHTML = "다른 회원님과 생각을 공유해보시는 건 어떤가요?";
		document.querySelector(`[name="home_btn"]`).classList.remove('hide');
		document.getElementById('log_off').classList.remove('hide');
		document.getElementById('log_on').classList.add('hide');
	} else {
		todo_list.innerHTML = "test";
		my_post.innerHTML = "test";
		my_comment.innerHTML = "test";
		document.querySelector(`[name="home_btn"]`).classList.remove('hide');
		document.getElementById('log_off').classList.add('hide');
		document.getElementById('log_on').classList.remove('hide');
	};
};
resetMain();

// 로그인 유무 확인
function online_check() {
	alert("죄송합니다. \n저희 사이트는 로그인을 하셔야 이용이 가능합니다. :)");
	btmIds.forEach(item => {
		let btn = document.querySelector(`[name="${item}"]`);
		if (item != 'login_btn') {
			btn.classList.add('hide');
		} else {
			btn.classList.remove('hide');
		}
	})
}

// 중복된 id가 있는지 확인하기 위한 변수
let id_check;

// nav 버튼 목록
const btmIds = [
	"home_btn",
	"posts_btn",
	"write_btn",
	"login_btn",
	"logout_btn",
	"sign_btn",
	"find_btn"
];

// console_success(route)
function console_success(route) {
	console.log(`[${route} 실행 완료]`);
	console.log(`------------------------------------------------`);
}

// console_err(err)
function console_err(err) {
	console.error(err);
	console.log(`------------------------------------------------`);
}

// fetchDB(route)
async function fetchDB(route) {
	const response = await fetch(`http://localhost:7000/${route}`);
	if (!response.ok) throw new Error(console_err(err));
	return await response.json();
}

// postJSON(data, route)
async function postJSON(data, route) {
	try {
		const response = await fetch(`http://localhost:7000/${route}`, {
			method: "post",
			headers: { "Content-Type": "application/json;charset=UTF-8" },
			body: JSON.stringify(data)
		});
		const resdata = await response.json();
		if (!response.ok) {
			return resdata;
		}
		return resdata;
	} catch {
		console_err(err);
		return { success: false, message: "서버 통신 오류" }
	};
};

// postBtn(btn)
async function postBtn(btn) {
	if (btn == 'posts_btn' || btn == 'write_form') {
		let tbody = document.querySelector("#posts_table tbody");
		try {
			let result = await fetchDB("posts");
			tbody.innerHTML = "";
			result.forEach(item => {
				// 게시글 목록 출력
				let tr = makeRow(item);
				tbody.appendChild(tr);
			});
			document.querySelectorAll('.post_click').forEach(item => {
				item.addEventListener('click', function(e) {
					if (localStorage.getItem("online") != "true") {
						online_check();
						return;
					};
					console.log(this.children[1].innerHTML);
				});
			});
		} catch (err) {
			console_err(err);
		}
	}
}

// 닫기 버튼
const closebtn = document.querySelectorAll(`[name="close_btn"]`);

// 닫기 버튼 이벤트 생성
function hide(e) {
	e.preventDefault();
	document.querySelector(`[name="home_btn"]`).classList.remove('hide');
	this.closest('.modal').classList.add('hide');
}

closebtn.forEach(item => {
	item.addEventListener('click', hide);
})

// nav 버튼 이벤트 생성
btmIds.forEach(item => {
	let btn = document.getElementById(item);
	if (btn) {
		btn.dataset.name = item;
		btn.addEventListener('click', btnClick);
	};
});

function btnClick(e) { // nav 버튼 이벤트 생성
	e.preventDefault();
	const btnName = this.dataset.name;

	// hide class 토글
	btmIds.forEach(item => {
		let btn = document.querySelector(`[name="${item}"]`);
		if (item != this.dataset.name) {
			btn.classList.add('hide');
		} else if (btn.classList.contains('hide')) {
			btn.classList.remove('hide');
		}
	})

	// posts 버튼
	postBtn(this.id);

	// 중복된 id가 있는지 확인하기 위한 데이터 가져오기
	if (btnName == 'sign_btn') {
		fetch(`http://localhost:7000/`)
			.then(response =>
				response.json()
			).then(result => {
				id_check = result;
			}).catch(err =>
				console.log(err)
			);
	}

	// 로그아웃 버튼
	if (btnName == 'logout_btn') {
		e.preventDefault();
		localStorage.setItem("user_id", "");
		localStorage.setItem("online", "false");
		resetMain();
		alert(`시간내어 주셔서 감사합니다. \n앞으로도 많은 관심 부탁드려요 :)`);
	}
};

function makeRow(item) { // 게시글 목록 출력
	let fileds = ["POST_NO", "POST_TITLE", "USER_ID"];
	let tr = document.createElement('tr');
	fileds.forEach(filed => {
		let td = document.createElement('td');
		td.innerHTML = item[filed];
		tr.appendChild(td);
	});
	tr.setAttribute('class', 'post_click');
	return tr;
};

// write 글작성
document.getElementById('write_form').addEventListener('submit',
	function(e) {
		e.preventDefault();
		if (!isOnline()) {
			online_check();
			return;
		}
		let datas = {
			write_id: localStorage.getItem('user_id')
		};
		document.querySelectorAll('#write_form div').forEach(item => {
			let result = item.querySelector('input, textarea');
			datas[result.name] = result.value;
		});
		console.log(datas);
		postJSON(datas, "write"); // 서버로 보내는 postJSON(data, route) 함수
		document.getElementById('write_title').value = "";
		document.getElementById('write_content').value = "";
		postBtn(this.id);
		document.querySelector(`[name="posts_btn"]`).classList.remove('hide');
		this.closest(`[name="write_btn"]`).classList.add('hide');
	})

// 회원가입
document.getElementById('sign_form').addEventListener('submit',
	async function(e) {
		e.preventDefault();
		let data = {};
		const pwcheck = document.querySelector('#sign_pwcheck').value;
		document.querySelectorAll('#sign_form input').forEach(item => {
			if (item.name != 'sign_pwcheck') {
				data[item.name] = item.value;
			}
		});
		for (let item of id_check) {
			if (item.USER_ID == data.sign_id) {
				alert("이미 사용중인 ID 입니다.");
				return;
			}
		}
		for (let key in data) {
			if (data[key].includes(' ')) {
				alert("공백을 제외하고 입력해주세요.");
				return;
			} else if (sign_pw.value != pwcheck) {
				alert("PW를 확인해주세요.");
				return;
			}
		}
		await postJSON(data, "sign");
		alert("뉴페이스는 오랜만이네요! 반가워요 :)");
		document.querySelector(`[name="home_btn"]`).classList.remove('hide');
		this.closest('.modal').classList.add('hide');
	}
);

// 로그인
document.getElementById('login_form').addEventListener('submit',
	async function(e) {
		e.preventDefault();
		const htmldata = {
			user_id: document.getElementById('user_id').value,
			user_pw: document.getElementById('user_pw').value
		};
		const dbdata = await postJSON(htmldata, "login");
		if (dbdata.success) {
			this.closest('.modal').classList.add('hide');
			document.getElementById('user_id').value = "";
			document.getElementById('user_pw').value = "";
			document.querySelector(`[name="home_btn"]`).classList.remove('hide');
			document.getElementById('log_off').classList.add('hide');
			document.getElementById('log_on').classList.remove('hide');
			localStorage.setItem("user_id", dbdata.data.user_id);
			localStorage.setItem("online", "true");
			resetMain();
			alert(`반갑습니다 ${htmldata['user_id']}. \n오늘 하루는 어땠나요?`);
		} else {
			alert(`ID 또는 PW가 맞지 않습니다. \n다시 확인해 보시는 건 어떨까요?`);
		};
	}
);










//