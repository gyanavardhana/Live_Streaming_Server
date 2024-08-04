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
- [Peer.js Server on Back4App](https://something-tso2ioqj.b4a.run/)
- [Prometheus](https://peer-gtq5.onrender.com)
- [Grafana](https://graf-h4dxeosz.b4a.run/)
- Database on MongoDB Cluster

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
  ![image](https://github.com/user-attachments/assets/bce231cb-de10-4b78-a90d-89caa89ea3da)
- To Stream , we have to be authenticated so login with "admin@email.com" and "admin".
  ![image](https://github.com/user-attachments/assets/3435bfcb-d96c-494e-94ec-3de1ea18514b)
- After the logging in you will be redirected to the Home page and now click on "Start Streaming".
  ![image](https://github.com/user-attachments/assets/25ec9318-3d3c-4248-a3fe-1b1871ca84ef)
- Now You can open a new tab or in a new device ,open the homepage and click on "View Stream".
  ![image](https://github.com/user-attachments/assets/29b26243-08c1-4713-9fc5-b7747087d074)
- Use the chat feature to interact during the stream in various devices.
  ![image](https://github.com/user-attachments/assets/a90ee6ba-1386-4ce8-bdf9-4324f48ad5df)
  ![WhatsApp Image 2024-08-04 at 15 37 15_afe052e7](https://github.com/user-attachments/assets/95219d02-49a7-4d81-a680-f52f84104c77)
- Monitor performance and logs using Prometheus and Grafana.
  ![image](https://github.com/user-attachments/assets/a716e707-58b1-40e4-a99e-008cd3471aac)
  ![image](https://github.com/user-attachments/assets/7ad1418f-0aca-4d88-8b2a-267b75251828)

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


## Contributing
Feel free to submit issues or pull requests.
