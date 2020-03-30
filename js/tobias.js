window.addEventListener("load", function(event) {
    document.querySelector("body").setAttribute("style","");
    document.querySelector("body").setAttribute("class","");
    var app = new Vue({
    	el: '#app',
        mounted: function(){
            this.compiled_tech = this.compileToObject(this.technologies);
            if(window.location.href.indexOf('tobias.dappjump.io') > -1) window.history.pushState("", "", '/');
            if((window.pageYOffset) > 0) {
                document.querySelector('.reduce').style = "transition:all 0s!important;"
                document.querySelector('.wave').style = "transition:all 0s!important;"
                this.reduceHero();
            } else {
                setTimeout(function(){
                    window.scrollTo(0,1);
                }.bind(this),1)
                setTimeout(this.reduceHero,1000);
            }
        },
    	data: {
            compiled_tech: {},
            companies: [
                {
                    name: "dapp.com",
                    thumb: "/tobias/media/dapp.png",
                    url: "https://dapp.com"
                },{
                    name: "Zeux Ltd.",
                    thumb: "/tobias/media/zeux.png",
                    url: "https://zeux.com"
                },{
                    name: "ARCC / IBMR",
                    thumb: "/tobias/media/arccibmr.png",
                    url: "https://ibmr.io"
                },{
                    name: "DEXON Blockchain",
                    thumb: "/tobias/media/dexon.png",
                    url: "https://dexon.org"
                },{
                    name: "Cobinhood Cryptocurrency Exchange",
                    thumb: "/tobias/media/cobinhood.png",
                    url: "https://blockonomi.com/cobinhood-review/"
                },{
                    name: "Ethos.io",
                    thumb: "/tobias/media/ethosio.png",
                    url: "https://ethos.io"
                },{
                    name: "Canimo",
                    thumb: "/tobias/media/canimo.png",
                    url: "https://canimo.dk"
                },{
                    name: "Nordic Web Design",
                    thumb: "/tobias/media/nwd.png",
                    url: "https://www.nordicwebdesign.dk"
                }
            ],
            technologies: [
                {
                    name: "JavaScript",
                    icon: "js-square"
                },{
                    name: "NodeJS",
                    icon: "node-js"
                },{
                    name: "HTML5",
                    icon: "html5"
                },{
                    name: "CSS3",
                    icon: "css3"
                },{
                    name: "Docker",
                    icon: "docker"
                },{
                    name: "Git",
                    icon: "git"
                },{
                    name: "Kubernetes",
                    thumb: "/tobias/media/kubernetes.png"
                },{
                    name: "Mongo DB",
                    thumb: "/tobias/media/mongodb.png"
                },{
                    name: "Vue JS",
                    icon: "vuejs"
                },{
                    name: "React JS",
                    icon: "react"
                },{
                    name: "Angular JS",
                    icon: "angular"
                },{
                    name: "Websockets",
                    thumb: "/tobias/media/websocket.png"
                }
            ],
            socials: [
                {
                    name: "Telegram",
                    icon: "telegram",
                    url: "https://t.me/dappjumper"
                },{
                    name: "LinkedIn",
                    icon: "linkedin",
                    url: "https://www.linkedin.com/in/dappjump/"
                },{
                    name: "GitHub",
                    icon: "github",
                    url: "https://github.com/dappjumper/"
                }
            ],
            expanded_piece: "",
            portfolio: [
                {
                    slug: "pixiccw",
                    name: "PIXI.js Credit Card",
                    summary: "Generating graphics for a credit card and displaying it nicely using vanilla-tilt.js and PIXI.js (WebGL 2 with canvas fallback)\n\nSince it generates an image on a canvas, it is very easy to copy and save the generated credit card to your local machine",
                    thumb: "/media/portfolio/pixiccw.png",
                    style:"",
                    skills: ["JavaScript", "PIXI.js", "vanilla-tilt.js", "Canvas"],
                    source: "https://github.com/dappjumper/pixiccw",
                    url: "https://pixiccw.herokuapp.com"
                },{
                    slug: "web3portfolio",
                    name: "Web3 User Flow",
                    summary: "Using private/public key signature verification, it is possible to prove identity without the use of email and password and then deliver a JWT token.\n\nMobile device compatibility is solved by allowing login with an access code displayed via QR code and using the camera API in-browser.",
                    thumb: "",
                    style:"background-color:#c5772a;",
                    source: "https://github.com/dappjumper/web3UserFlow",
                    url: "https://web3loginportfolio.herokuapp.com/",
                    video: "https://www.youtube-nocookie.com/embed/5kf68gPqpVU",
                    skills: "Node JS,MongoDB,Web3.js,Rivets,QR".split(',')
                },{
                    slug: "projectfinch",
                    name: "Project Finch",
                    summary: "Telegram chat bot platform running on a Kubernetes cluster with API and front-end microservice split.\n\nNodeJS & MongoDB backend. VueJS front-end without the use of pre-made templates.",
                    tech: ["react",""],
                    thumb: "/tobias/media/portfolio/projectfinch.png",
                    style: "background-color:#25343b;",
                    source: "",
                    url_type: "Alpha ver.",
                    url: "https://chat.dappjump.io",
                    video: "",
                    skills: "Node JS,MongoDB,Responsive,PWA,VueJS,API,Websockets".split(',')
                }
            ],
            message: {
                from: "",
                text: ""
            },
            errors: {
                contact: ""
            },
            success: {
                contact: ""
            },
            loading: {
                sendMessage: false
            }
        },
        methods: {
            activateIframe: function(e,index){
                try {
                    if(e.target.tagName == 'LAZYIFRAME') {
                        e.target.outerHTML = e.target.outerHTML.replace('lazy','');
                    }
                } catch(e){}
            },
            compileToObject: function(fromArray){
                let returnObject = {};
                for(let index in fromArray) {
                    returnObject[fromArray[index].name.split(' ').join('')] = fromArray[index];
                }
                return returnObject;
            },
            reduceHero: function(){
                document.querySelector('.reduce').className = document.querySelector('.reduce').className.replace('reduce','reduced');
            },
            scrollTo: function(target){
                document.querySelector(target).scrollIntoView({ 
                  behavior: 'smooth'
                });
            },
            validateEmail: function(email) {
                try {
                    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase());
                } catch(e){
                    return false
                }
            },
            sendMessage: function() {
                if(!this.validateEmail(this.message.from)) return this.errors.contact = "Please enter your email";
                if(!this.message.text) return this.errors.contact = "Please enter a message";
                this.loading.sendMessage = true;
                this.errors.contact = ""; this.success.contact = "";
                this.api(this.message,function(response){
                    this.loading.sendMessage = false;
                    if(response && !response.error) {
                        this.success.contact = "Message sent!"
                        for(var prop in this.message) {this.message[prop]='';}
                    } else {
                        this.errors.contact = response.error;
                    }
                }.bind(this))
            },
            api: function(payload, callback){
                var url = "https://pf-internal.dappjump.io/contact";
                var xmlhttp = new XMLHttpRequest();

                xmlhttp.open("POST", url);
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        try {
                            var response = JSON.parse(this.response);
                            response.api_timestamp = new Date().getTime();
                            callback(response);
                        } catch(e) {
                            console.log(e)
                            callback({error:"Failed to send, please try tobias@dappjump.io"})
                        }
                        }
                    }
                xmlhttp.send(JSON.stringify(payload));  
            }
        }
    });
});