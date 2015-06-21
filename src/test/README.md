# Test Support

Test provides permanent support for the test harnesses.

## testClientSupport

Mocha tests that need to use server connections use these routines.

### mochaTestConnect()

This routine connects to a mMeddle server as a client named 'mochatests',
and populates mm with the most useful objects to do client testing.
Note that once connected, this will only attempt to reconnect if the
connection is lost.

### mockMeddleServer()

For mock server testing the mocksock socket.io simulator is used with
the express.js server to create an in-process version of the mMeddle 
server. Since there is no actual network IO problems can often be
isolated more easily. This also helps in getting code coverage since
both sides of the client/server pair are tested concurrently.

## MockSock

This is the mocksock socket.io simulator. It replaces the normal
socket.io based `mm.socketClient` and  `mm.socketServer` with an
emulator that runs in-process. The server and client communicate with
each other through a Q promises based mechanism that provides a 
mockup of all the Socket.io routines used by mMeddle.

##.

