const express = require("express"); // express = 웹서버
const oracledb = require("oracledb");
const cors = require("cors");

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const app = express();
app.use(cors());
app.use(express.json());

// 오라클 서버에서 DB를 가져오기 위해 필요한 값들 작성
const dbConfig = {
	user: 'hr',
	password: 'hr',
	connectString: 'localhost:1521/xe',
	poolMin: 10,
	poolMax: 10,
	poolIncrement: 0,
	poolAlias: "project_01_Pool" // 풀 이름 지정
}

// 서버 구동 관련
const port = 7000;
async function startServer() {
	// oracle 연결을 위한 pool을 만듬
	await makePool();
	app.listen(port, () => {
		console.log(
			`[서버 가동 http://localhost:${port} (startServer)]`);
		console.log(`------------------------------------------------`);
	})
};

async function makePool() { // oracle 연결을 위한 pool을 만듬
	try {
		await oracledb.createPool(dbConfig);
		console.log("[Pool 생성 완료 (initialize)]");
		console.log(`------------------------------------------------`);
	} catch (err) {
		console.log("[Pool 생성 에러 발생 (initialize)]");
		console.log(`------------------------------------------------`);
		process.exit(1);
	}
};
startServer(); // 서버 가동

// 글 목록을 html에 전송
app.get("/posts", async (req, res) => {
	let connection;
	try {
		connection = await oracledb.getConnection(dbConfig.poolAlias);
		let sql = `SELECT * FROM post ORDER BY post_no DESC`
		let result = await connection.execute(sql);
		res.status(200).json(result.rows);
	} catch (err) {
		console.log(err);
		console.log(`[get /posts[try] 에러 발생]`);
		console.log(`------------------------------------------------`);
	} finally {
		if (connection) {
			try {
				await connection.close();
				console.log(`[get /posts] 목록 출력]`);
				console.log(`------------------------------------------------`);
			} catch (err) { // 에러 발생
				console.log(err);
				console.log(`[get /posts[finally] 에러 발생]`);
				console.log(`------------------------------------------------`);
			}
		}
	}
})

// 글쓰기 데이터를 oracle로 전송
app.post("/write", async (req, res) => {
	let connection;
	try {
		connection = await oracledb.getConnection(dbConfig.poolAlias);
		let sql = `
		BEGIN
			write_post(:write_id, :write_title, :write_content);
		END;
		`;
		const binds = {
			write_id: 'seung',
			write_title: req.body.write_title,
			write_content: req.body.write_content
		};

		// const binds = {};
		// for (let item in req.body) {
		// 	binds[item] = req.body[item];
		// };

		await connection.execute(sql, binds, { autoCommit: true });
	} catch (err) {
		console.log(err);
		console.log(`[post /write[try] 에러 발생]`);
		console.log(`------------------------------------------------`);
	} finally {
		if (connection) {
			try {
				await connection.close();
				console.log(`[post /write 전송 완료]`);
				console.log(`------------------------------------------------`);
			} catch (err) { // 에러 발생
				console.log(err);
				console.log(`[post /write[finally] 에러 발생]`);
				console.log(`------------------------------------------------`);
			}
		}
	}
});

// 회원가입 시 중복된 id가 있는지 확인
app.get("/", async (req, res) => {
	let connection;
	try {
		connection = await oracledb.getConnection(dbConfig.poolAlias);
		let sql = `SELECT user_id FROM users`;
		let result = await connection.execute(sql);
		res.status(200).json(result.rows);
	} catch (err) {
		console.log(err);
		console.log(`[get / [try] 에러 발생]`);
		console.log(`------------------------------------------------`);
	} finally {
		if (connection) {
			try {
				await connection.close();
				console.log(`[get / 전송 완료]`);
				console.log(`------------------------------------------------`);
			} catch (err) { // 에러 발생
				console.log(err);
				console.log(`[get / [finally] 에러 발생]`);
				console.log(`------------------------------------------------`);
			}
		}
	}
});

// 회원가입 데이터를 oracle로 전송
app.post("/sign", async (req, res) => {
	let connection;
	try {
		connection = await oracledb.getConnection(dbConfig.poolAlias);;
		let sql = `
		BEGIN
			add_user(:sign_id, :sign_pw, :sign_name, :sign_tel);
		END;
		`;
		const binds = {};
		for (let item in req.body) {
			binds[item] = req.body[item];
		};
		await connection.execute(sql, binds, { autoCommit: true });
	} catch (err) {
		console.log(err);
		console.log(`[post /sign[try] 에러 발생]`);
		console.log(`------------------------------------------------`);
	} finally {
		if (connection) {
			try {
				await connection.close();
				console.log(`[post /sign 전송 완료]`);
				console.log(`------------------------------------------------`);
			} catch (err) { // 에러 발생
				console.log(err);
				console.log(`[post /sign[finally] 에러 발생]`);
				console.log(`------------------------------------------------`);
			}
		}
	}
});