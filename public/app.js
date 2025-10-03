//
// 중복된 id가 있는지 확인하기 위한 변수
let id_check;

// nav 버튼 목록
const btmIds = [
	"home_btn",
	"posts_btn",
	"write_btn",
	"login_btn",
	"sign_btn",
	"find_btn"
];

function postBtn(btn) {
	if (btn == 'posts_btn' || btn == 'write_add') {
		fetch(`http://localhost:7000/posts`)
			.then(response =>
				response.json()
			).then(result => {
				document.querySelector("#posts_table tbody").innerHTML = "";
				result.forEach(item => {
					// 게시글 목록 출력
					let tr = makeRow(item);
					document.querySelector("#posts_table tbody").appendChild(tr);
				})
			}).catch(err =>
				console.log(err)
			);
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
}

function makeRow(item) { // 게시글 목록 출력
	let fileds = ["POST_NO", "POST_TITLE", "USER_ID"];
	let tr = document.createElement('tr');
	fileds.forEach(filed => {
		let td = document.createElement('td');
		td.innerHTML = item[filed];
		tr.appendChild(td);
	})
	return tr;
}

// write 글작성
document.getElementById('write_form').addEventListener('submit',
	function(e) {
		e.preventDefault();
		let datas = {};
		document.querySelectorAll('#write_form div').forEach(item => {
			let result = item.querySelector('input, textarea');
			datas[result.name] = result.value;
		});
		postJSON(datas, "write"); // 서버로 보내는 postJSON(data, route) 함수
		document.querySelector(`[name="posts_btn"]`).classList.remove('hide');
		this.closest(`[name="write_btn"]`).classList.add('hide');
		postBtn(this.id);
	})

// 서버로 보내는 postJSON(data, route) 함수
async function postJSON(data, route) {
	fetch(`http://localhost:7000/${route}`, {
		method: "post",
		headers: { "Content-Type": "application/json;charset=UTF-8" },
		body: JSON.stringify(data)
	}).then(response =>
		response.json()
	).catch(e => {
		console.log(e);
		console.log(`[postJSON[fetch] 에러 발생]`);
		console.log(`------------------------------------------------`);
	})
}





// 회원가입
document.getElementById('sign_form').addEventListener('submit',
	function(e) {
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
		postJSON(data, "sign");
		// alert("반갑습니다.");
		document.querySelector(`[name="home_btn"]`).classList.remove('hide');
		this.closest('.modal').classList.add('hide');
	});




//