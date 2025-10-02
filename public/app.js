//



const btmIds = ["home_btn", "posts_btn", "write_btn", "login_btn", "sign_btn", "find_btn"];
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
	// hide class 토글
	btmIds.forEach(item => {
		let btn = document.querySelector(`[name="${item}"]`);
		if (item != this.dataset.name) {
			btn.classList.add('hide');
		} else if (btn.classList.contains('hide')) {
			btn.classList.remove('hide');
		}
	})
}

// // 버튼 클릭
// function btnClick(e) {
// 	e.preventDefault();
// 	// hide class 토글
// 	btmIds.forEach(item => {
// 		let btn = document.querySelector(`[name="${item}"]`);
// 		if (item != this.dataset.name) {
// 			btn.classList.add('hide');
// 			if (item == "close_btn" || item == "sign_close_btn") {
// 				btn.classList.remove('hide');
// 			}
// 		} else if (item == "close_btn" || item == "sign_close_btn") {
// 			document.querySelector(`[name="home_btn"]`).classList.remove('hide');
// 		} else if (btn.classList.contains('hide')) {
// 			btn.classList.remove('hide');
// 		}
// 	})
// }