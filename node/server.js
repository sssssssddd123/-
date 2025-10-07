const express = require("express");
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

// console_success(route)
function console_success(route) {
	console.log(`[${route} 실행 완료]`);
	console.log(`------------------------------------------------`);
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
		console_success("makePool(함수)");
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};
startServer(); // 서버 가동

// sql 작성에 필요한 keys, binds 입력 함수
function createKeysBind(data) {
	const beginKeys = Object.keys(data).map(key => `:${key}`).join(', ');
	const selectKeys = Object.keys(data).map(key => `${key} = :${key}`).join(' AND ');
	const binds = {};
	for (let key in data) {
		binds[key] = data[key];
	};
	return { beginKeys, selectKeys, binds };
};

// 글 목록을 html에 전송
app.get("/posts", async (req, res) => {
	let connection;
	try {
		connection = await oracledb.getConnection(dbConfig.poolAlias);
		let sql = `SELECT * FROM post ORDER BY CREATED_AT DESC`
		let result = await connection.execute(sql);
		res.status(200).json(result.rows);
	} catch (err) {
		console.log(err);
	} finally {
		if (connection) {
			try {
				await connection.close();
				console_success("app.get /posts");
			} catch (err) {
				console.log(err);
			}
		}
	}
});

// 글쓰기 데이터를 oracle로 전송
app.post("/write", async (req, res) => {
	let connection;
	try {
		connection = await oracledb.getConnection(dbConfig.poolAlias);
		const { beginKeys, binds } = createKeysBind(req.body);
		let sql = `
		BEGIN
			write_post(${beginKeys});
		END;
		`;
		console.log(sql)
		await connection.execute(sql, binds, { autoCommit: true });
	} catch (err) {
		console.log(err);
	} finally {
		if (connection) {
			try {
				await connection.close();
				console_success("app.post /write");
			} catch (err) {
				console.log(err);
			}
		}
	}
});

// login할 시 user data를 html로 전송해 줌
app.post("/login", async (req, res) => {
	let connection;
	try {
		connection = await oracledb.getConnection(dbConfig.poolAlias);
		const { selectKeys, binds } = createKeysBind(req.body);
		let sql = `
		SELECT * FROM users
		WHERE ${selectKeys}
		`;
		const result = await connection.execute(sql, binds, { autoCommit: true });
		if (result.rows.length == 0) {
			return res.status(401).json({ success: false, message: 'ID 또는 PW 불일치' });
		}
		res.status(200).json({ success: true, message: '로그인 성공', data: { user_id: result.rows[0].USER_ID } });
	} catch (err) {
		console.log(err);
	} finally {
		if (connection) {
			try {
				await connection.close();
				console_success("app.post /login");
			} catch (err) {
				console.log(err);
			}
		}
	}
});

// 회원가입 시 중복된 id가 있는지 확인
app.get("/idCheck", async (req, res) => {
	let connection;
	let sql;
	try {
		connection = await oracledb.getConnection(dbConfig.poolAlias);
		sql = `SELECT user_id FROM users`;
		let result = await connection.execute(sql);
		res.status(200).json(result.rows);
	} catch (err) {
		console.log(err);
	} finally {
		if (connection) {
			try {
				await connection.close();
				console_success(`app.get SQL(${sql})`);
			} catch (err) {
				console.log(err);
			}
		}
	}
});

// 회원가입 데이터를 oracle로 전송
app.post("/sign", async (req, res) => {
	let connection;
	try {
		connection = await oracledb.getConnection(dbConfig.poolAlias);
		const { beginKeys, binds } = createKeysBind(req.body);
		let sql = `
		BEGIN
			add_user(${beginKeys});
		END;
		`;
		await connection.execute(sql, binds, { autoCommit: true });
	} catch (err) {
		console.log(err);
	} finally {
		if (connection) {
			try {
				await connection.close();
				console_success("app.post /sign");
			} catch (err) {
				console.log(err);
			}
		}
	}
});