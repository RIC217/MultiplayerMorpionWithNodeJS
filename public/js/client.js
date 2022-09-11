const pseudoInput = document.querySelector(".pseudo");
const submit = document.querySelector(".createGame");
const form = document.querySelector("form");
const morpion = document.querySelector(".morpion");
const buttons = document.getElementsByClassName("btn");
const waiting = document.querySelector(".waiting");
const link = document.querySelector(".link");
const turnLabel = document.querySelector(".turn");
const roomList = document.querySelector(".rooms");
const searchForRooms = document.querySelector(".search");
const ou = document.querySelector(".ou");
let socket = null;
let searchSocket = null;
let advPseudo;
const success = new Audio("/mp3/success.mp3");
const music = new Audio("/mp3/music.mp3");
music.play();
music.loop = true;
const clickSound = new Audio("/mp3/click.mp3");
const gameOverSound = new Audio("/mp3/gameover.mp3");
searchForRooms.addEventListener("click",(e)=>{
    if(searchSocket===null){
        searchSocket=io();
        searchSocket.on("rooms",(rooms)=>{
            roomList.innerHTML = "";
            rooms.forEach(room => {
                console.log(room);
                roomList.innerHTML+='<div class="room"><p>Salon de '+room.owner+'</p><button class="join'+room.id+'">Rejoindre</button></div>';
                document.querySelector(".join"+room.id).addEventListener("click",(e)=>{
                    location.replace("/join?"+room.id);
                });
            });
        })
    }
    searchSocket.emit("iWantToKnowTheRoomsAvailable");
})
submit.addEventListener("click",(e)=>{
    e.preventDefault();
    if(socket===null){
        socket = io();
        socket.on("tooshort",()=>{
            alert("Pseudo trop court !");
        });
        socket.on("nospaces",()=>{
            alert("Espaces, tabulations et retours à la lignes interdits !")
        });
        socket.on("alreadycreatedparty",()=>{
            alert("Tu es encore dans la partie que tu as créé.e !");
        })
        socket.on("alreadyinaparty",()=>{
            alert("Tu es déjà dans une autre partie !");
        })
        socket.on("successfullyCreatedParty",()=>{
            console.log("Created party");
            form.classList.add("d-none");
            searchForRooms.classList.add("d-none");
            ou.classList.add("d-none");
            waiting.classList.remove("d-none");
            link.classList.remove("d-none");
            link.href = "https://"+location.hostname+"/join?"+socket.id;
            link.innerText = "https://"+location.hostname+"/join?"+socket.id;
        })
        socket.on("advQuit",()=>{
            turnLabel.innerText = "Tu as gagné car ton adversaire a quitté !";
            turnLabel.style.color = "green";
            won();
        });
        socket.on("playerJoined",(player)=>{
            waiting.classList.add("d-none");
            link.classList.add("d-none");
            morpion.classList.remove("d-none");
            morpion.style.backgroundColor = "black";
            advPseudo=player;
            turnLabel.classList.remove("d-none");
            turnLabel.innerText = "C'est à ton tour de jouer !";
            turnLabel.style.color = "green";
            for(i = 0;i<9;i++){
                buttons[i].classList.remove("d-none");
            }
            buttons[0].addEventListener("click",(e)=>{
                socket.emit("play",0);
                click();
            });
            buttons[1].addEventListener("click",(e)=>{
                socket.emit("play",1);
                click();
            });
            buttons[2].addEventListener("click",(e)=>{
                socket.emit("play",2);
                click();
            });
            buttons[3].addEventListener("click",(e)=>{
                socket.emit("play",3);
                click();
            });
            buttons[4].addEventListener("click",(e)=>{
                socket.emit("play",4);
                click();
            });
            buttons[5].addEventListener("click",(e)=>{
                socket.emit("play",5);
                click();
            });
            buttons[6].addEventListener("click",(e)=>{
                socket.emit("play",6);
                click();
            });
            buttons[7].addEventListener("click",(e)=>{
                socket.emit("play",7);
                click();
            });
            buttons[8].addEventListener("click",(e)=>{
                socket.emit("play",8);
                click();
            });
        })
        socket.on("invalidnumber",()=>{
            // alert("Nombre invalide !");
        })
        socket.on("notturn",()=>{
            // alert("Ce n'est pas ton tour, sois patient !")
            turnLabel.style.scale = 2.5;
            turnLabel.style.scale = 1;
        })
        socket.on("successturn",(table)=>{
            for(i=0;i<9;i++){
                if(table[i]===pseudo){
                    buttons[i].classList.add("me");
                } else if(table[i]===' '){
                    buttons[i].classList.remove("me");
                    buttons[i].classList.remove("you");
                } else{
                    buttons[i].classList.add("you");
                }
            }
        })
        socket.on("yourturn",()=>{
            turnLabel.innerText = "C'est à ton tour de jouer !";
            turnLabel.style.color = "green";
        })
        socket.on("notagainyourturn",()=>{
            turnLabel.innerText = "C'est au tour de "+ advPseudo +" de jouer !";
            turnLabel.style.color = "red";
        })
        socket.on("youwon",()=>{
            turnLabel.innerText = "Tu as gagné !";
            turnLabel.style.color = "green";
            won();
        })
        socket.on("youlose",()=>{
            turnLabel.innerText = "Tu as perdu !";
            turnLabel.style.color = "red";
            gameOver();
        })
    }
    let pseudo = pseudoInput.value;
    socket.emit("pseudo",pseudo,true,null);
})

const won = ()=>{
    success.play();
}

const click = ()=>{
    clickSound.play();
}
const gameOver = ()=>{
    gameOverSound.play();
    gameOverSound.volume = 1;
}