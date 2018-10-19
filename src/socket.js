
export default function (socketUrl, customData, path) {
  const options = path ? { path } : {};
  console.log(`Socket options: ${JSON.stringify(options, 2)}`);
  const socket = new WebSocket(`ws://${socketUrl}/${options.path}`);
  socket.onopen = () => {
    console.log(`connect:${socket}`);
    socket.customData = customData;
  };

  socket.onerror =  (error) => {
    console.log(error);
  };

  socket.onclose((reason) => {
    console.log(reason);
  });

  return socket;
};
