Custom Template reactjs-thunk for HiSoft with:
===
 
## 1. Chạy Project
Bước 1. Cài đặt thư viện (nên dùng yarn thay cho npm)
```
yarn install
```
Bước 2. Setup endpoint API và chạy App
```
> *  REACT_APP_END_POINT   
> *  REACT_APP_END_POINT_MATH
yarn start
```

## 2. View version build with [preval.macro](https://github.com/kentcdodds/preval.macro)

Thời gian build sẽ hiển thị tại console web, ví dụ:
```
=====================================
REACT VERSION CREATED AT:  30/11/2020 23:25:02
=====================================
```

## 3. Tạo files, folder với [Plopjs](https://plopjs.com/)

Cú pháp:
```
yarn plop
```

```
Select type of file to create:
  > page - Tạo một page mới 
    component - Tạo một component mới 
    componentofpage - Tạo một component trong page 
```

## 4. Build and deploy

Bước 1: Tạo biến trong Project tại: setting/CI-CD/Variables
> *  GITLAB_USER  
> *  GITLAB_PASSWORD

Bước 2: Tạo gitlab-runner có thể chạy câu lệnh docker tạị setting/CI-CD/Variables của projects:

Thông tin cụ thể: [use-docker-socket-binding](https://docs.gitlab.com/ee/ci/docker/using_docker_build.html#use-docker-socket-binding)

Hiện tại các gitlab pipeline sẽ chạy khi merge master. Tùy biến tại file .gitlab-ci-yml.


### 5. Testing with [Cypress](https://www.cypress.io/)

For more information: https://www.cypress.io/

