window.onload = () =>{
    "use strict";
    const csInterface = new CSInterface();
    themeManager.init();

    const filePath = csInterface.getSystemPath(SystemPath.EXTENSION) +`/js/`;
    const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) +`/jsx/`;
    const fs = require("fs");
    const path = require("path"); 
    csInterface.evalScript(`$.evalFile("${extensionRoot}json2.js")`);//json2読み込み
    
    const PSId = "PSVulcanExample";//メッセージ、送信側のID
    const messageArea = document.getElementById("messageArea");
    
    class ReciveMessage{
        constructor(sender){
            this.sender = sender;
            const vulcanNamespace = VulcanMessage.TYPE_PREFIX + this.sender;//ここで受信したい送信側のExtensionのIDを指定する
            VulcanInterface.addMessageListener(vulcanNamespace,this.receive);
            /*
            VulcanInterface.addMessageListenerで通信を待ち受け
            ちなみにhandleEventは使えませんでした、、、
            */
        }
        
        async receive(message){
            console.log(message);
            const msg = await messageHandler(message).catch(err => console.log(err));
            console.log(msg);
            switch(msg.num){//受信内容によって分岐
                case "1":
                    const writeFirst = new WriteDown(msg,"first");
                    break;
                    
                case "2":
                    const writeSecond = new WriteDown(msg,"Second");
                    break;
                    
                case "3":
                    const writeThird = new WriteDown(msg,"Third");
                    break
                default:
                    alert("nothing");
                    breal;
            }
            
            function messageHandler(message){
                return new Promise(resolve=>{
                    const payload = VulcanInterface.getPayload(message);
                    const object = JSON.parse(payload);
                    resolve(object);
                });    
            }
        }
    }
    
    const waiting = new ReciveMessage(PSId);
    
    
    class WriteDown{
        constructor(msg,num){
            csInterface.evalScript(`alert("${num}")`);
            this.msg = msg;
            this.area = messageArea;
            this.writemessage();
        }
        
        writemessage(){
            this.removeChild(this.area);
            Object.entries(this.msg).forEach(([key,prop])=>{
                const li = document.createElement("li");
                li.textContent = `${key}:${prop}`;
                this.area.appendChild(li);
            });
        }
        
        removeChild(parent){
            while(parent.firstChild){
                parent.removeChild(parent.firstChild);
            }
        }
    }
}
