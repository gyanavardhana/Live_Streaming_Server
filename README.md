---

# Live Streaming Server

## Overview
This project is a live streaming server built using Node.js for the backend and React.js for the frontend. The backend handles live stream data, supports multiple concurrent streams, and uses WebSockets for real-time data transfer. The frontend provides a basic interface for displaying and sending live streams. Additionally, the project includes Docker containerization, user authentication, a simple chat feature, and monitoring tools (Prometheus and Grafana).

## Features
- Live streaming server
- Real-time data transfer with WebSockets and Peer.js
- Multiple concurrent streams support
- User authentication and authorization
- Docker containerization
- Simple chat feature for live interaction
- Monitoring and logging with Prometheus and Grafana

## Deployed Links
- [Frontend on Vercel](https://live-streaming-server-eight.vercel.app/)
- [Backend on Render](https://live-streaming-server.onrender.com)
- [Database on MongoDB Cluster]
- [Peer.js Server on Back4App](https://something-tso2ioqj.b4a.run/)
- [Prometheus](https://peer-gtq5.onrender.com)
- [Grafana](https://graf-h4dxeosz.b4a.run/)

## Prerequisites
- Node.js
- Docker
- npm or yarn

## Getting Started

### Clone the Repository
```sh
git clone https://github.com/gyanavardhana/Live_Streaming_Server.git
cd Live_Streming_Server
```

### Backend Setup
1. Install dependencies:
    ```sh
    cd Backend
    npm install
    ```

2. Set up environment variables:
    Create a `.env` file in the `backend` directory and add the following:
    ```env
    CLIENT_URL=
    MONGO_URI=
    JWT_SECRET=
    NODE_ENV=

    ```

3. Start the backend server:
    ```sh
    npm run start
    ```

### Frontend Setup
1. Install dependencies:
    ```sh
    cd Frontend
    npm install
    ```

2. Set up environment variables:
    Create a `.env` file in the `frontend` directory and add the following:
    ```env
    VITE_APP_PEER=
    VITE_APP_SERVER=
    ```

3. Start the frontend server:
    ```sh
    npm run dev
    ```


### Monitoring Tools Setup
1. Prometheus:
    - Access Prometheus at [Prometheus URL](https://peer-gtq5.onrender.com).

2. Grafana:
    - Access Grafana at [Grafana URL](https://graf-h4dxeosz.b4a.run/).

## Usage
- Visit the frontend URL to start and stop streaming.
- Use the chat feature to interact during the stream.
- Monitor performance and logs using Prometheus and Grafana.

## API Endpoints
### Authentication
- **POST** `/signup` - Register a new user
- **POST** `/login` - Log in a user

## Technologies Used
- **Backend**: Node.js, Express.js
- **Frontend**: React.js
- **Real-time Communication**: WebSockets, Peer.js
- **Authentication**: JWT
- **Containerization**: Docker
- **Monitoring**: Prometheus, Grafana
- **Deployment**: Vercel, Render, Back4App

## Screenshots
### Demo
![Demo Screenshot 1](path/to/screenshot1.png)
![Demo Screenshot 2](path/to/screenshot2.png)

### Technologies Used
![Node.js](path/to/nodejs-logo.png)
![React.js](path/to/reactjs-logo.png)
![Docker](path/to/docker-logo.png)
![Prometheus](path/to/prometheus-logo.png)
![Grafana](path/to/grafana-logo.png)
![Peer.js](path/to/peerjs-logo.png)

## Contributing
Feel free to submit issues or pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to replace the placeholder paths for the images with the actual paths to your screenshots and logos.
