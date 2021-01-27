# NewLoco
**※** ↓ Docker使わない場合 **!推奨** 
```bash
  cd src/desktop
  yarn
  yarn dev
```
**※** ↑ Docker使わない場合    
**※** ↓ Dockerでする場合 

electron + docker *はじめに必要*
```
  brew update
  brew install xquartz
```

権限付与 *※コンピューター再起動したら毎回実行*
```
    xhost + 127.0.0.1
```
https://qiita.com/twu_go/items/8539bde01662c2a0a7a2

## 始める
```bash
  docker-compose up --build -d
  docker-compose exec desktop bash
  yarn
  yarn dev
```
**※** ↑ Dockerでする場合 

