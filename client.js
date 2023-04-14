const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo(
  "localhost:40000",
  grpc.credentials.createInsecure()
);

const text = process.argv[2];

client.createTodo(
  {
    id: -1,
    text: text,
  },
  (err, response) => {
    !err
      ? console.log(
          `Received from server createtodo: ${JSON.stringify(response)}`
        )
      : console.log(err);
  }
);

//MENDAPATKAN DATA SECATA BERTAHAP MENGGUNAKAN LOOPING DI SISI CLIENT DAN MENGGUNAKAN METODE STREAM DI SISI SERVER
const call = client.readTodosStream();
call.on("data", (response) => {
  if (response) {
    console.log(`get data from server: ${JSON.stringify(response)}`);
  }
});

call.on("end", (e) => {
  console.log("server done!");
});

//MENDAPATKAN DATA SECARA BERTAHAP MENGGUNAKAN LOOPING DI SISI CLIENT
client.readtodos(null,(err, response) => {
  if (err) console.log(err)
  if(response) {
    response.items.forEach(data => {
      console.log(`Received from server readtodos: ${JSON.stringify(data.text)}`)
    });
  }
});
