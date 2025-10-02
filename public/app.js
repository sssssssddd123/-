//


const btmIds = [
	"home_btn",
	"posts_btn",
	"write_btn",
	"login_btn",
	"sign_btn",
	"find_btn"
];
const closebtn = document.querySelectorAll('.close_btn');

// 닫기 버튼 이벤트 생성
closebtn.forEach(item => {
	item.addEventListener('click', function(e) {
		e.preventDefault();
		document.querySelector(`[name="home_btn"]`).classList.remove('hide');
		this.closest('.modal').classList.add('hide');
	})
})

// nav 버튼 이벤트 생성
btmIds.forEach(item => {
	let btn = document.getElementById(item);
	if (btn) {
		btn.dataset.name = item;
		btn.addEventListener('click', btnClick);
	};
});

// nav 버튼 이벤트 생성
function btnClick(e) {
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

	// posts 버튼 (게시글 목록 출력)
	if (btnName == 'posts_btn') {
		fetch(`http://localhost:7000/posts`)
			.then(response => response.json())
			.then(result => {
				document.querySelector("#posts_table tbody").innerHTML = "";
				result.forEach(item => {
					let tr = makeRow(item);
					document.querySelector("#posts_table tbody").appendChild(tr);
				})
			}).catch(err => console.log(err));
	}
}

function makeRow(item) {
	let fileds = ["POST_NO", "POST_TITLE", "USER_ID"];
	let tr = document.createElement('tr');
	fileds.forEach(filed => {
		let td = document.createElement('td');
		td.innerHTML = item[filed];
		tr.appendChild(td)
	})
	return tr;
}