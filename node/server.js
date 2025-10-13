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

// 글 목록을 html에 전송
app.get("/posts", async (req, res) => {
	let connection;
	try {
		connection = await oracledb.getConnection(dbConfig.poolAlias);
		let sql = `
		SELECT 
    post_no,
    post_title,
    post_content,
    user_id,
    TO_CHAR(created_at, 'YY-MM-DD HH24:MI') AS CREATED_AT
		FROM post
		ORDER BY created_at DESC
		`
		let result = await connection.execute(sql);
		res.status(200).json(result.rows);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			success: false,
			message: '게시글 불러오기 중 에러 발생.'
		});
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

// 글작성 데이터를 oracle로 전송
app.post("/write", async (req, res) => {
	let connection;
	try {
		connection = await oracledb.getConnection(dbConfig.poolAlias);
		let sql = `
		BEGIN
			write_post(:write_id, :write_title, :write_content);
		END;
		`;
		const binds = {};
		for (let key in req.body) {
			binds[key] = req.body[key];
		};
		await connection.execute(sql, binds, { autoCommit: true });
		res.status(200).json([]);
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

// 댓글 목록 가져옴
app.post("/postComments", async (req, res) => {
	let connection;
	try {
		connection = await oracledb.getConnection(dbConfig.poolAlias);
		let sql = `
		SELECT 
		c.post_no,
    c.user_id,
    c.post_comment
		FROM comment_all c
		JOIN post p ON c.post_no = p.post_no
		WHERE c.post_no = :post_no
		ORDER BY c.comment_no DESC
		`
		const binds = { post_no: req.body.postNo };
		const result = await connection.execute(sql, binds, { autoCommit: true });
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

// 댓글 작성
app.post("/commentAdd", async (req, res) => {
	let connection;
	try {
		connection = await oracledb.getConnection(dbConfig.poolAlias);
		let sql = `
		BEGIN
			write_comment(:user_id, :post_no, :post_comment);
		END;
		`;
		const binds = {};
		for (let key in req.body) {
			binds[key] = req.body[key];
		};
		await connection.execute(sql, binds, { autoCommit: true });
		sql = `
		SELECT user_id, post_no, post_comment
		FROM comment_all
		WHERE post_no = ${req.body.post_no}
		ORDER BY comment_no DESC
		`;
		console.log(req.body.post_no)
		const result = await connection.execute(sql);
		res.status(200).json(result.rows);
	} catch (err) {
		console.log(err);
	} finally {
		if (connection) {
			try {
				await connection.close();
				console_success("app.post /commentAdd");
			} catch (err) {
				console.log(err);
			}
		}
	}
})

// login할 시 user data를 html로 전송해 줌
app.post("/login", async (req, res) => {
	let connection;
	try {
		connection = await oracledb.getConnection(dbConfig.poolAlias);
		let sql = `
		SELECT * FROM users
		WHERE user_id = :user_id AND user_pw = :user_pw
		`;
		const binds = {};
		for (let key in req.body) {
			binds[key] = req.body[key];
		};
		const result = await connection.execute(sql, binds, { autoCommit: true });
		res.status(200).json({
			success: true,
			data: result.rows[0].USER_ID
		});
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
		let sql = `
		BEGIN
			add_user(:sign_id, :sign_pw, :sign_name, :sign_tel);
		END;
		`;
		const binds = {};
		for (let key in req.body) {
			binds[key] = req.body[key];
		};
		await connection.execute(sql, binds, { autoCommit: true });
		res.status(200).json([]);
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

// todo Add
app.post("/todoAdd", async (req, res) => {
	let connection;
	try {
		connection = await oracledb.getConnection(dbConfig.poolAlias);
		let sql = `
		BEGIN
			write_todo(:user_id, :todo_content);
		END;
		`;
		const binds = {};
		for (let key in req.body) {
			binds[key] = req.body[key];
		};
		await connection.execute(sql, binds, { autoCommit: true });
		res.status(200).json([]);
	} catch (err) {
		console.log(err);
	} finally {
		if (connection) {
			try {
				await connection.close();
				console_success("app.post /todoAdd");
			} catch (err) {
				console.log(err);
			}
		}
	}
});

app.post("/todoDBget", async (req, res) => {
	let connection;
	try {
		connection = await oracledb.getConnection(dbConfig.poolAlias);
		let sql = `
		SELECT todo_content
		FROM todolist
		WHERE user_id = :user_id
		ORDER BY todo_no DESC
		`;
		const binds = { user_id: req.body.user_id };
		const result = await connection.execute(sql, binds, { autoCommit: true });
		res.status(200).json(result.rows);
	} catch (err) {
		console.log(err);
	} finally {
		if (connection) {
			try {
				await connection.close();
				console_success("app.post /todoAdd");
			} catch (err) {
				console.log(err);
			}
		}
	}
});