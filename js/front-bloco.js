import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc, updateDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "xxxxx",
    authDomain: "xxxxx",
    projectId: "xxxxx",
    storageBucket: "xxxxxxx",
    messagingSenderId: "xxxxx",
    appId: "xxxxxx"
};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let provider = new GoogleAuthProvider(app);
const db = getFirestore(app);

let usuario = {
    votouBloco: Boolean,
    votouRainha: Boolean
}

let mensagemBloco = "Você ja votou em um bloco!";

document.getElementById('login').addEventListener('click', function (e) {
    login();
})

document.getElementById('botao-login').addEventListener('click', function (e) {
    login();
})

function login() {
        signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            

            (async function () {
                const docRef = doc(db, "users", user.displayName);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    usuario.votouBloco = docSnap.data().votouBloco;
                    usuario.votouRainha = docSnap.data().votouRainha;
                } else {
                    setDoc(doc(db, "users", user.displayName), {
                        nome: user.displayName,
                        email: user.email,
                        votouBloco: false,
                        votouRainha: false
                    });
                    usuario.votouBloco = false;
                    usuario.votouRainha = false;
                }
            })()
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const credential = GoogleAuthProvider.credentialFromError(error);

            console.log(errorMessage)
        });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.querySelector('.popup').remove();
        document.getElementById('imagem-perfil').src = user.providerData[0].photoURL;
        document.getElementById('login').style.display = "none";
        document.getElementById('imagem-perfil').style.display = "inline-block";
        document.querySelectorAll('.botao-votar').forEach((botao) => {
            botao.style.display = "block";
        });
        (async function () {
            const docRef = doc(db, "users", user.displayName);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                usuario.votouBloco = docSnap.data().votouBloco;
                usuario.votouRainha = docSnap.data().votouRainha;
            } else {
                setDoc(doc(db, "users", user.displayName), {
                    nome: user.displayName,
                    email: user.email,
                    votouBloco: false,
                    votouRainha: false
                });
                usuario.votouBloco = false;
                usuario.votouRainha = false;
            }
            if(usuario.votouBloco === true) {
                exibirVoto();
            }
        })()     
    } else {
        document.querySelector('.popup').style.display = 'flex';
        document.getElementById('imagem-perfil').style.display = "none";
        document.getElementById('login').style.display = "inline-block";
        document.querySelectorAll('.botao-votar').forEach((botao) => {
            botao.style.display = "none";
        })
    }
});

function exibirVoto() {
    (async function() {
        const querySnapshot = await getDocs(collection(db, "votacao"));
        querySnapshot.forEach((doc) => {
        document.getElementById(doc.id).innerText = doc.data().votos + ' votos';
        });
    })()
    document.querySelectorAll('.botao-votar').forEach((botao) => {
        botao.disabled = true;
        botao.style.display = "block"
    })
}

function votouBloco() {
    onAuthStateChanged(auth, async (user) => {
        await updateDoc(doc(db, "users", user.displayName), {
            votouBloco: true
        });
    });
    usuario.votouBloco = true;
    exibirVoto();
}


function peloAmorDeDeus() {
    (async function () {
        const docRef = doc(db, "votacao", "pelo-amor-de-deus");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao", "pelo-amor-de-deus"), {
                votos: media
            });
            votouBloco();
            alert("Obrigado por votar no bloco Pelo Amor de Deus!")
        }
    })()
}


document.getElementById('votar-pelo-amor-de-deus').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {

        const response = confirm("Confirmar voto no Pelo Amor de Deus?");

        if (response) {
           if (user) {
            if(usuario.votouBloco == false) {
                peloAmorDeDeus();
            } else {
                alert(mensagemBloco)
            }
        } else {
            alert('Você precisa fazer login primeiro!')
        } 
        }

        
    });
})

function goloMotiva() {
    (async function () {
        const docRef = doc(db, "votacao", "golomotiva");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao", "golomotiva"), {
                votos: media
            });
            votouBloco();
            alert("Obrigado por votar no bloco Golomotiva!")
        }
    })()
}


document.getElementById('votar-golomotiva').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {

        const response = confirm("Confirmar voto no Golomotiva?");

        if (response) {
            if (user) {
                if(usuario.votouBloco == false) {
                    goloMotiva();
                } else {
                    alert(mensagemBloco)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            }
        }

    });
})


function batuqueZe() {
    (async function () {
        const docRef = doc(db, "votacao", "batuque-do-ze");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao", "batuque-do-ze"), {
                votos: media
            });
            votouBloco();
            alert("Obrigado por votar no Batuque do Zé!")
        }
    })()
}


document.getElementById('votar-batuque-do-ze').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {

        const response = confirm("Confirmar voto no Batuque do Zé?");

        if (response) {
            if (user) {
                if(usuario.votouBloco == false) {
                    batuqueZe();
                } else {
                    alert(mensagemBloco)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            } 
        }
    });
})

function bloco10() {
    (async function () {
        const docRef = doc(db, "votacao", "bloco-10");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao", "bloco-10"), {
                votos: media
            });
            votouBloco();
            alert("Obrigado por votar no Bloco 10!")
        }
    })()
}


document.getElementById('votar-bloco-10').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {

        const response = confirm("Confirmar voto no Bloco 10?");

        if (response) {
            if (user) {
                if(usuario.votouBloco == false) {
                    bloco10();
                } else {
                    alert(mensagemBloco)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            }  
        }

    });
})

function blocoArvore() {
    (async function () {
        const docRef = doc(db, "votacao", "bloco-da-arvore");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao", "bloco-da-arvore"), {
                votos: media
            });
            votouBloco();
            alert("Obrigado por votar no Bloco da Árvore!")
        }
    })()
}


document.getElementById('votar-bloco-da-arvore').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {

        const response = confirm("Confirmar voto no Bloco da Árvore?");

        if (response) {
            if (user) {
                if(usuario.votouBloco == false) {
                    blocoArvore();
                } else {
                    alert(mensagemBloco)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            }
        }

    });
})


function blocoDesire() {
    (async function () {
        const docRef = doc(db, "votacao", "bloco-da-desiree");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao", "bloco-da-desiree"), {
                votos: media
            });
            votouBloco();
            alert("Obrigado por votar no Bloco da Desiree!")
        }
    })()
}


document.getElementById('votar-bloco-da-desiree').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {

        const response = confirm("Confirmar voto no Bloco da Desiree");

        if (response) {
            if (user) {
                if(usuario.votouBloco == false) {
                    blocoDesire();
                } else {
                    alert(mensagemBloco)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            } 
        }
        
    });
})


function blocoCapitao() {
    (async function () {
        const docRef = doc(db, "votacao", "bloco-do-capitao");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao", "bloco-do-capitao"), {
                votos: media
            });
            votouBloco();
            alert("Obrigado por votar no Bloco do Capitão!")
        }
    })()
}


document.getElementById('votar-bloco-do-capitao').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {

        const response = confirm("Confirmar voto no Bloco do Capitão?");

        if (response) {
           if (user) {
                if(usuario.votouBloco == false) {
                    blocoCapitao();
                } else {
                    alert(mensagemBloco)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            }
        }
        
    });
})

function blocoboi() {
    (async function () {
        const docRef = doc(db, "votacao", "boi-da-alegria");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao", "boi-da-alegria"), {
                votos: media
            });
            votouBloco();
            alert("Obrigado por votar no Bloco do Boi da Alegria!")
        }
    })()
}


document.getElementById('votar-boi-da-alegria').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {

        const response = confirm("Confirmar voto no Bloco Boi da Alegria?");

        if (response) {
            if (user) {
                if(usuario.votouBloco == false) {
                    blocoboi();
                } else {
                    alert(mensagemBloco)
                }
            } else {
            
            }
           alert('Você precisa fazer login primeiro!')
        }
    });
})

function blococainagua() {
    (async function () {
        const docRef = doc(db, "votacao", "cai-nagua");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao", "cai-nagua"), {
                votos: media
            });
            votouBloco();
            alert("Obrigado por votar no Bloco dos Cai-N'água!")
        }
    })()
}


document.getElementById('votar-cai-nagua').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {

        const response = confirm("Confirmar voto no Bloco dos Cai-N'água?");

        if (response) {
           if (user) {
                if(usuario.votouBloco == false) {
                    blococainagua();
                } else {
                    alert(mensagemBloco)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            }
        }
        
    });
})


function blocoDiamantuque() {
    (async function () {
        const docRef = doc(db, "votacao", "diamantuque");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao", "diamantuque"), {
                votos: media
            });
            votouBloco();
            alert("Obrigado por votar no Bloco Diamantuque!")
        }
    })()
}


document.getElementById('votar-diamantuque').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {

        const response = confirm("Confirmar voto no Bloco Diamantuque?");

        if (response) {
            if (user) {
                if(usuario.votouBloco == false) {
                    blocoDiamantuque();
                } else {
                    alert(mensagemBloco)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            }
        }
        
    });
})


function blocojiculinzila() {
    (async function () {
        const docRef = doc(db, "votacao", "jiculinzila");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao", "jiculinzila"), {
                votos: media
            });
            votouBloco();
            alert("Obrigado por votar no Bloco Jiculinzila!")
        }
    })()
}


document.getElementById('votar-jiculinzila').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {

        const response = confirm("Confirmar voto no Bloco Jikula N'zila?");

        if (response) {
            if (user) {
                if(usuario.votouBloco == false) {
                    blocojiculinzila();
                } else {
                    alert(mensagemBloco)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            }
        }
    });
})


function blocoLoucos() {
    (async function () {
        const docRef = doc(db, "votacao", "loucos-varridos");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao", "loucos-varridos"), {
                votos: media
            });
            votouBloco();
            alert("Obrigado por votar no Bloco Loucos Varridos!")
        }
    })()
}


document.getElementById('votar-loucos-varridos').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {

        const response = confirm("Confirmar voto no Bloco Loucos Varridos?");

        if (response) {
           if (user) {
                if(usuario.votouBloco == false) {
                    blocoLoucos();
                } else {
                    alert(mensagemBloco)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            }
        }
    });
})


function blocoPraia() {
    (async function () {
        const docRef = doc(db, "votacao", "praia-15");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao", "praia-15"), {
                votos: media
            });
            votouBloco();
            alert("Obrigado por votar no Bloco Praia 15!")
        }
    })()
}


document.getElementById('votar-praia-15').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {

        const response = confirm("Confirmar voto no Bloco Praia 15?");

        if (response) {
            if (user) {
                if(usuario.votouBloco == false) {
                    blocoPraia();
                } else {
                    alert(mensagemBloco)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            }
        }
    });
})


function blocofaia() {
    (async function () {
        const docRef = doc(db, "votacao", "so-faia");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao", "so-faia"), {
                votos: media
            });
            votouBloco();
            alert("Obrigado por votar no Bloco Só Faia!")
        }
    })()
}


document.getElementById('votar-so-faia').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {

        const response = confirm("Confirmar voto no bloco Só Faia?");

        if (response) {
            if (user) {
                if(usuario.votouBloco == false) {
                    blocofaia();
                } else {
                    alert(mensagemBloco)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            }
        }
    });
})


function blocoVoz() {
    (async function () {
        const docRef = doc(db, "votacao", "voz-do-morro");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao", "voz-do-morro"), {
                votos: media
            });
            votouBloco();
            alert("Obrigado por votar no Voz do Morro!")
        }
    })()
}


document.getElementById('votar-voz-do-morro').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {

        const response = confirm("Confirmar voto no Unidos da Voz do Morro?");

        if (response) {
            if (user) {
                if(usuario.votouBloco == false) {
                    blocoVoz();
                } else {
                    alert(mensagemBloco)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            }
        }
    });
})


function gatinhas() {
    (async function () {
        const docRef = doc(db, "votacao", "gatinhas");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao", "gatinhas"), {
                votos: media
            });
            votouBloco();
            alert("Obrigado por votar no Bloco das Gatinhas!")
        }
    })()
}


document.getElementById('votar-gatinhas').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {

        const response = confirm("Confirmar voto no bloco das Gatinhas?");

        if (response) {
            if (user) {
                if(usuario.votouBloco == false) {
                    gatinhas();
                } else {
                    alert(mensagemBloco)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            } 
        }
    });
})


function mucangas() {
    (async function () {
        const docRef = doc(db, "votacao", "mucangas");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao", "mucangas"), {
                votos: media
            });
            votouBloco();
            alert("Obrigado por votar no Bloco das Muçangas!")
        }
    })()
}


document.getElementById('votar-mucangas').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {

        const response = confirm("Confirmar voto no bloco das Muçangas?");

        if (response) {
            if (user) {
                if(usuario.votouBloco == false) {
                    mucangas();
                } else {
                    alert(mensagemBloco)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            }
        }
    });
})


function recordar() {
    (async function () {
        const docRef = doc(db, "votacao", "recordar");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao", "recordar"), {
                votos: media
            });
            votouBloco();
            alert("Obrigado por votar no Bloco Recordar é Viver!")
        }
    })()
}


document.getElementById('votar-mucangas').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {

        const response = confirm("Confirmar voto no bloco Recordar é Viver?");

        if (response) {
            if (user) {
                if(usuario.votouBloco == false) {
                    recordar();
                } else {
                    alert(mensagemBloco)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            }
        }
    });
})