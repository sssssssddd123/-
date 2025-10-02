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

async function initialize() {
	try {
		await oracledb.createPool(dbConfig);
		console.log("projectPool: 연결 성공 (initialize)");
	} catch (err) {
		console.log("projectPool: 연결 실패 (initialize)");
		process.exit(1);
	}
};

// pool이 만들어지면 서버 작동
const port = 7000;
async function startServer() {
	await initialize(); // oracle 연결을 위한 pool을 만듬
	app.listen(port, () => {
		console.log(`서버 on http://localhost:${port} (startServer)`);
	})
};

