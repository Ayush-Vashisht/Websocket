# import asyncio
# import websockets

# connected_clients = set()

# async def handle_client(websocket, path):
    
#     connected_clients.add(websocket)
#     try:
#         async for message in websocket:
#             await asyncio.wait([client.send(message) for client in connected_clients])
#     finally:
#         connected_clients.remove(websocket)


# async def main():
#     server = await websockets.serve(handle_client, "localhost", 6789)
#     await server.wait_closed()
    
# if __name__ == "__main__":
#     asyncio.run(main())

from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit, join_room, leave_room
import random
import string
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

def ack():
    print('message was received!')
    
# @socketio.on('consent')
# def handle_message(data):
#     print('received message: ' + data)
#     token=generate_link_token()
#     emit('response', token, broadcast=True)

# @socketio.on('join')
# def on_join(data):
#     username = data['username']
#     room = data['room']
#     join_room(room)
#     emit(username + ' has entered the room.', to=room)

# @socketio.on('leave')
# def on_leave(data):
#     username = data['username']
#     room = data['room']
#     leave_room(room)
#     emit(username + ' has left the room.', to=room)

def generate_link_token():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=20))

# Handle 'join' event
@socketio.on('join')
def handle_join(data):
    username = data.get('username')
    room = data.get('room')

    if username and room:
        join_room(room)
        print(f'{username} joined room: {room}')
        # Emit link-token once user joins the room
        token = generate_link_token()
        emit('link-token', token, room=room)

# Handle 'leave' event
@socketio.on('leave')
def handle_leave(data):
    username = data.get('username')
    room = data.get('room')

    if username and room:
        leave_room(room)
        print(f'{username} left room: {room}')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, use_reloader=False)