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

app.get("/posts", async (req, res) => {
	let oracleDB
	try {
		oracleDB = await oracledb.getConnection(dbConfig.poolAlias);
		let sql = `SELECT * FROM post ORDER BY post_no DESC`
		let result = await oracleDB.execute(sql)
		res.status(200).json(result.rows)
	} catch (err) {
		console.log(err);
		console.log(`"get /posts[try]" 에러 발생`);
	} finally {
		if (oracleDB) {
			try {
				await oracleDB.close();
			} catch (err) { // 에러 발생
				console.log(err);
				console.log(`"get /posts[finally]" 에러 발생`);
			}
		}
	}
})






































// 이 아래는 서버 구동 관련
async function initialize() {
	try {
		await oracledb.createPool(dbConfig);
		console.log("[project_01_Pool: 연결 성공 (initialize)]");
	} catch (err) {
		console.log("[project_01_Pool: 연결 성공 (initialize)]");
		process.exit(1);
	}
};

// pool이 만들어지면 서버 작동
const port = 7000;
async function startServer() {
	await initialize(); // oracle 연결을 위한 pool을 만듬
	app.listen(port, () => {
		console.log(
			`[project_01_Pool: 서버 on http://localhost:${port} (startServer)]`);
	})
};
startServer();