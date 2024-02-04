# Project install

1. Clone repository
2. Install docker
3. Make sure you have Metamask plugin
4. Allow insecure localhost - chrome://flags/#allow-insecure-localhost
5. Launch backend - "docker-compose up" from the root folder
6. Launch frontend - "cd ./frontend && yarn && yarn start:dev"
7. Open https://localhost:5173/

Demo - https://drive.google.com/file/d/1aGV7TUJFxTYV1-EhuP05_ZsY_KKr4VL5/view?usp=sharing

## Diagram

![App architecture](/diagram.png)

## Next steps

1. Setup monorepo
2. Create package with common services
3. Add config validation. Do not start app if env is invalid
4. Add logging
5. Add refresh token
6. ....
