const grpc = require("@grpc/grpc-js");
const { WriteFlags } = require("@grpc/grpc-js/build/src/call-interface");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

function main() {
  const server = new grpc.Server();
  server.addService(todoPackage.Todo.service, {
    "createTodo": createTodo,
    "readtodos": readtodos,
    "readTodosStream": readTodosStream
  });
  server.bindAsync(`0.0.0.0:40000`, grpc.ServerCredentials.createInsecure(), () => server.start());
  console.log('server is running')
}
main();

const todos = [];

function createTodo(call, callback) {
  const todoItem = {
    "id": todos.length + 1,
    "text": call.request.text
  }
  todos.push(todoItem)
  console.log(call)
  callback(null,todoItem)
}

function readTodosStream(call, callback) {
  todos.forEach(items => call.write(items))
  call.end()
}

function readtodos(call, callback) {
  callback(null, {"items": todos})
}
