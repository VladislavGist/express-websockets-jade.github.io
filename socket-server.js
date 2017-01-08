var socket = require("socket.io"),
	app = require("express")(),
	io = socket.listen(app.listen(8080));

app.set("views", __dirname);

//подключение шаблонизатора jade
app.set("view engine", "jade");
//магия активации jade
app.engine("jade", require("jade").__express);
//папка для статических файлов
app.use(require("express").static(__dirname + "/folder"));

//для express
app.get("/", (req, res) => {
	res.render("page");
});

//для сокетов. когда произойдет соединение
io.sockets.on("connection", client => {
	client.on("message", data => {
		client.emit("hello", {hello: "Hi " + data});
		client.broadcast.emit("hello", "Привет от " + data);
	});

	client.on("disconnect", () => {
		io.sockets.emit("hello", {hello: "Один из нас вышел из сети"});
	});
});