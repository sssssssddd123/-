//



const btmIds = ["home_btn", "posts_btn", "write_btn", "login_btn", "login_close_btn"];

// 버튼 이벤트 생성
btmIds.forEach(item => {
	let btn = document.getElementById(item);
	if (btn) {
		btn.dataset.name = item;
		btn.addEventListener('click', btnClick);
	};
});

// 버튼 클릭
function btnClick(e) {
	e.preventDefault();
	// hide class 토글
	btmIds.forEach(item => {
		let btn = document.querySelector(`[name="${item}"]`);
		if (item != this.dataset.name) {
			btn.classList.add('hide');
			if (item == "login_close_btn") {
				btn.classList.remove('hide');
			}
		} else if (item == "login_close_btn") {
			document.querySelector(`[name="home_btn"]`).classList.remove('hide');
		} else if (btn.classList.contains('hide')) {
			btn.classList.remove('hide');
		}
	})
}
