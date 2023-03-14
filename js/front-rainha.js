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

let mensagemRainha = "Você ja votou em uma candidata!"

document.getElementById('login').addEventListener('click', function (e) {
    login();
});


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
            if (usuario.votouRainha === true) {
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
    (async function () {
        const querySnapshot = await getDocs(collection(db, "votacao-rainha"));
        querySnapshot.forEach((doc) => {
            document.getElementById(doc.id).innerText = doc.data().votos.toFixed(0) + ' votos';
        });
    })()
    document.querySelectorAll('.botao-votar').forEach((botao) => {
        botao.disabled = true;
        botao.style.display = "block"
    })
}

function votouRainha() {
    onAuthStateChanged(auth, async (user) => {
        await updateDoc(doc(db, "users", user.displayName), {
            votouRainha: true
        });
    });
    usuario.votouRainha = true;
    exibirVoto();
}


function thauane() {
    (async function () {
        const docRef = doc(db, "votacao-rainha", "thauane-mendes");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao-rainha", "thauane-mendes"), {
                votos: media
            });
            votouRainha();
            alert("Obrigado por votar na candidata Thauane!")
        }
    })()
}


document.getElementById('votar-thauane').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {
        const response = confirm("Confirmar voto para Thauane Mendes?");

        if (response) {
            if (user) {
                if (usuario.votouRainha == false) {
                    thauane();
                } else {
                    alert(mensagemRainha)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            }
        }
    });
})

function kelly() {
    (async function () {
        const docRef = doc(db, "votacao-rainha", "kelly-santos");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao-rainha", "kelly-santos"), {
                votos: media
            });
            votouRainha();
            alert("Obrigado por votar na candidata Kelly!")
        }
    })()
}


document.getElementById('votar-kelly').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {
        const response = confirm("Confirmar voto para a Kelly Santos?");

        if (response) {
            if (user) {
                if (usuario.votouRainha == false) {
                    kelly();
                } else {
                    alert(mensagemRainha)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            }
        }
    });
})

function nathalieNeto() {
    (async function () {
        const docRef = doc(db, "votacao-rainha", "nathalie-neto");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao-rainha", "nathalie-neto"), {
                votos: media
            });
            votouRainha();
            alert("Obrigado por votar na candidata Nathalie Neto!")
        }
    })()
}


document.getElementById('votar-nathalie-neto').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {
        const response = confirm("Confirmar voto para a Nathalie Neto?");

        if (response) {
            if (user) {
                if (usuario.votouRainha == false) {
                    nathalieNeto();
                } else {
                    alert(mensagemRainha)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            }
        }
    });
})

function mariaLuisa() {
    (async function () {
        const docRef = doc(db, "votacao-rainha", "maria-luisa");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao-rainha", "maria-luisa"), {
                votos: media
            });
            votouRainha();
            alert("Obrigado por votar na candidata Maria Luísa!")
        }
    })()
}


document.getElementById('votar-maria-luisa').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {
        const response = confirm("Confirmar voto para a Maria Luísa?");

        if (response) {
            if (user) {
                if (usuario.votouRainha == false) {
                    mariaLuisa();
                } else {
                    alert(mensagemRainha)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            }
        }
    });
})

function marinaNunes() {
    (async function () {
        const docRef = doc(db, "votacao-rainha", "marina-nunes");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1.3;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao-rainha", "marina-nunes"), {
                votos: media
            });
            votouRainha();
            alert("Obrigado por votar na candidata Marina Nunes Pinheiro!")
        }
    })()
}


document.getElementById('votar-marina-nunes').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {
        const response = confirm("Confirmar voto para a Marina Nunes Pinheiro?");

        if (response) {
            if (user) {
                if (usuario.votouRainha == false) {
                    marinaNunes();
                } else {
                    alert(mensagemRainha)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            }
        }
    });
})
